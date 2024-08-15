import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { WineRoleEnum } from '../enums';
import { User } from '../schemas/user.schema';
import { RolesEnum } from 'src/auth/enums';
import { UserStatusEnum } from 'src/auth/enums/userStatus.enum';

export class CreateUserDto implements Omit<User, '_id' | 'password' | 'roles'> {
  @ApiProperty()
  @Expose()
  @IsString()
  fullname: string;

  @ApiProperty()
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Expose()
  @IsString()
  username: string;

  @ApiProperty()
  @Expose()
  @IsEnum(WineRoleEnum)
  wineRole: WineRoleEnum;

  @ApiProperty()
  @Expose()
  @IsEnum(RolesEnum)
  role: RolesEnum;

  @ApiProperty()
  @Expose()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
}
