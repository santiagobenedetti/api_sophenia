import { ApiProperty } from '@nestjs/swagger';
import { CreateTaskDto } from './createTask.dto';
import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class CreateTasksDto {
  @ApiProperty({ type: CreateTaskDto })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  @IsArray()
  tasks: CreateTaskDto[];
}
