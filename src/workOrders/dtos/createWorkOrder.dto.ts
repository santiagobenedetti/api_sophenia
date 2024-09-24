import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class WorkOrderAssignedTaskDto {
  @ApiProperty()
  @Expose()
  @IsString()
  taskId: string;

  @ApiProperty()
  @Expose()
  @IsString()
  workerAssignedId: string;
}

export class CreateWorkOrderDto {
  @ApiProperty({ type: WorkOrderAssignedTaskDto })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => WorkOrderAssignedTaskDto)
  @IsArray()
  workOrderTasks: WorkOrderAssignedTaskDto[];
}
