import { ApiProperty } from '@nestjs/swagger';
import { WineRoleEnum } from '../enums';
import { Types } from 'mongoose';

export class GetUserDto {
  @ApiProperty()
  id: Types.ObjectId;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  role: WineRoleEnum;

  @ApiProperty()
  available: boolean;
}
