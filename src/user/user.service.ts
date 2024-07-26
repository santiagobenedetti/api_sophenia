import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

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

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {}
}
