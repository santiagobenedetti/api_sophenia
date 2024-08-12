import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dtos';
import { WineRoleEnum } from 'src/user/enums';
import { RolesEnum } from '../enums';

export class RegisterDto implements CreateUserDto {
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

  @ApiProperty({ enum: WineRoleEnum, examples: Object.keys(WineRoleEnum) })
  @Expose()
  @IsEnum(WineRoleEnum)
  wineRole: WineRoleEnum;

  @ApiProperty()
  @Expose()
  @IsEnum(RolesEnum)
  role: RolesEnum;

  @Expose()
  @Transform(() => true)
  available: boolean;
}
