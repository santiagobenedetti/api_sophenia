import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Task } from '../schemas/task.schema';

export class CreateTaskDto
  implements Omit<Task, '_id' | 'workerAssigned' | 'taskReport' | 'status'>
{
  @ApiProperty()
  @Expose()
  @IsString()
  title: string;

  @ApiProperty()
  @Expose()
  @IsString()
  description: string;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  requiresTaskReport: boolean;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsNumber()
  estimatedHours?: number;
}
