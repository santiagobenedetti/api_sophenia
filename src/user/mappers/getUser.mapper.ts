import { User } from '../schemas/user.schema';

export const mapGetUserData = (user: User) => {
  console.log(user);
  return {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.wineRole,
    status: user.status,
  };
};
