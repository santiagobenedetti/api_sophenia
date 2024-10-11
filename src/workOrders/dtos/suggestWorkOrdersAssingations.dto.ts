import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';

export class SuggestWorkOrdersAssingationsDto {
  @ApiProperty()
  @Expose()
  @IsArray()
  taskIds: string[];

  @ApiProperty()
  @Expose()
  @IsArray()
  workersIds: string[];
}
