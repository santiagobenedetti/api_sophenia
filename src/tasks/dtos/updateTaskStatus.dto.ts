import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { TaskStatusEnum } from '../enums/taskStatus.enum';

export class UpdateTaskStatusDto {
  @ApiProperty()
  @Expose()
  @IsEnum(TaskStatusEnum)
  status: TaskStatusEnum;
}
