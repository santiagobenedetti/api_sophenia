import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  // If additional validations are required (min 8 characters, one capital letter, etc) add them here
  @ApiProperty()
  @Expose()
  @IsString()
  newPassword: string;
}
