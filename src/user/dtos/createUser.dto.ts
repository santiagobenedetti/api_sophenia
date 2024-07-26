import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { WineRoleEnum } from '../enums';
import { User } from '../schemas/user.schema';

export class CreateUserDto implements Omit<User, 'password'> {
  @ApiProperty()
  @Expose()
  @IsString()
  fullname: string;

  @ApiProperty()
  @Expose()
  @IsString()
  username: string;

  @ApiProperty()
  @Expose()
  @IsEnum(WineRoleEnum)
  wineRole: WineRoleEnum;

  @Expose()
  @Transform(() => true)
  available: boolean;
}
