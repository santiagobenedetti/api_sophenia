import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { RolesEnum } from '../enums';

export class LoginDto {
  @ApiProperty()
  @Expose()
  @IsString()
  username: string;

  @ApiProperty()
  @Expose()
  @IsString()
  password: string;

  @ApiProperty()
  @Expose()
  @IsEnum(RolesEnum, { message: 'Provide a valid role' })
  role: RolesEnum;
}
