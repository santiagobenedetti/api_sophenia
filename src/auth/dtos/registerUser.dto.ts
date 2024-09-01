import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dtos';
import { WineRoleEnum } from 'src/user/enums';
import { RolesEnum } from '../enums';
import { UserStatusEnum } from '../enums/userStatus.enum';

export class RegisterDto implements CreateUserDto {
  @ApiProperty()
  @Expose()
  @IsString()
  fullname: string;

  @ApiProperty()
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: WineRoleEnum, examples: Object.keys(WineRoleEnum) })
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
