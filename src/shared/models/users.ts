import { UserStatusEnum } from 'src/auth/enums/userStatus.enum';
import { User } from 'src/user/schemas/user.schema';

export const checkUserStatus =
  (status: UserStatusEnum) =>
  (user: User): boolean =>
    user.status === status;

export const isUserActive = checkUserStatus(UserStatusEnum.ACTIVE);

export const isUserDeleted = checkUserStatus(UserStatusEnum.DELETED);
