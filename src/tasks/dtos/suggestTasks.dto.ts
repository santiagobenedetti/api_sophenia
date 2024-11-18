import { ApiProperty } from '@nestjs/swagger';
import {} from './createTask.dto';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class SuggestTasksDto {
  @ApiProperty()
  @Expose()
  @IsString()
  seasonMoment: string;
}
