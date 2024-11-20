import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SuggestTasksDto {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsOptional()
  seasonMoment: string;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsOptional()
  objective: string;
}
