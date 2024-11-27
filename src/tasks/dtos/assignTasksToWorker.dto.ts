import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class AssignTasksToWorkerDto {
  @ApiProperty()
  @Expose()
  @IsString({ each: true })
  @IsNotEmpty()
  @IsArray()
  taskIds: string[];

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  workerId: string;
}
