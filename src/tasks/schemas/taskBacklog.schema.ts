import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Task } from './task.schema';

export type TaskBacklogDocument = HydratedDocument<TaskBacklog>;

@Schema()
export class TaskBacklog {
  _id: Types.ObjectId;

  @Prop({ required: true })
  tasks: Task[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const TaskBacklogSchema = SchemaFactory.createForClass(TaskBacklog);
