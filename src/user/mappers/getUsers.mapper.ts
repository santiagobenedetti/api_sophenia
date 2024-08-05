import { GetUserDto } from '../dtos/getUser.dto';
import { User } from '../schemas/user.schema';

export const mapGetUsersData = (users: User[]): GetUserDto[] => {
  return users.map((user) => {
    return {
      id: user._id,
      fullname: user.fullname,
      role: user.wineRole,
      available: user.available,
    };
  });
};
