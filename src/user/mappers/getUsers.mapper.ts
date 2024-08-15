import { GetUserDto } from '../dtos/getUser.dto';
import { User } from '../schemas/user.schema';
import { mapGetUserData } from './getUser.mapper';

export const mapGetUsersData = (users: User[]): GetUserDto[] =>
  users.map(mapGetUserData);
