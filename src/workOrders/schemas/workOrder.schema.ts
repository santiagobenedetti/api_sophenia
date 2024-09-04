import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Task } from 'src/tasks/schemas/task.schema';

export type WorkOrderDocument = HydratedDocument<WorkOrder>;

@Schema()
export class WorkOrder {
  _id: Types.ObjectId;

  @Prop({ required: true })
  tasks: Task[];

  @Prop({ required: true })
  date: Date;
}

export const WorkOrderSchema = SchemaFactory.createForClass(WorkOrder);
