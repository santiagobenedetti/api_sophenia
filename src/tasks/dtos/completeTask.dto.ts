import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CompleteTaskDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  detail?: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsOptional()
  photoUrl?: string;
}
