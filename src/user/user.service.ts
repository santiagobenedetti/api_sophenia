import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { GetUsersQueryParams } from 'src/shared/types/users';
import { mapPagination } from 'src/shared/mappers/pagination.mapper';
import { UserStatusEnum } from 'src/auth/enums/userStatus.enum';
import { isUserDeleted } from 'src/shared/models/users';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email: email }).exec();
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    newUser.roles = [createUserDto.role];
    await newUser.save();
    Logger.log(
      `Created user with data: ${JSON.stringify(createUserDto)}`,
      'USER',
    );
    return newUser;
  }

  async changePassword(email: string, password: string) {
    return this.userModel.updateOne({ email: email }, { password: password });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.updateOne(updateUserDto);
  }

  async getUsers({ limit, offset }: GetUsersQueryParams) {
    const users = await this.userModel.find().skip(offset).limit(limit).exec();
    const total = await this.userModel.countDocuments();
    return {
      data: users,
      pagination: mapPagination(limit, offset, total),
    };
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (isUserDeleted(user)) {
      throw new BadRequestException('User already deleted');
    }

    return user.updateOne({ status: UserStatusEnum.DELETED });
  }
}
