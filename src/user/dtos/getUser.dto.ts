import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { UserStatusEnum } from 'src/auth/enums/userStatus.enum';

export class GetUserDto {
  @ApiProperty()
  id: Types.ObjectId;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  status: UserStatusEnum;
}
