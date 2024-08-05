import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { GetUsersQueryParams } from 'src/shared/types/users';
import { mapGetPaginationDto } from 'src/shared/mappers/pagination.mapper';
import { mapGetUsersData } from './mappers/getUsers.mapper';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserById(userId: string) {
    return this.userModel.findById(userId).exec();
  }

  async getUserByUsername(username: string) {
    return this.userModel.findOne({ username: username }).exec();
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

  async changePassword(username: string, password: string) {
    return this.userModel.updateOne(
      { username: username },
      { password: password },
    );
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
      data: mapGetUsersData(users),
      pagination: mapGetPaginationDto(limit, offset, total),
    };
  }
}
