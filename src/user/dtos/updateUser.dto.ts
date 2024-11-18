import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { RolesEnum } from 'src/auth/enums';
import { UserStatusEnum } from 'src/auth/enums/userStatus.enum';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsString()
  fullname?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsEnum(RolesEnum)
  role?: RolesEnum;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsEnum(RolesEnum, { each: true })
  roles?: RolesEnum[];
}
