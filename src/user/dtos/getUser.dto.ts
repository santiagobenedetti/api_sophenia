import { ApiProperty } from '@nestjs/swagger';
import { WineRoleEnum } from '../enums';
import { Types } from 'mongoose';
import { UserStatusEnum } from 'src/auth/enums/userStatus.enum';

export class GetUserDto {
  @ApiProperty()
  id: Types.ObjectId;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  role: WineRoleEnum;

  @ApiProperty()
  status: UserStatusEnum;
}
