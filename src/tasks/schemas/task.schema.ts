import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TaskStatusEnum } from '../enums/taskStatus.enum';
import { TaskReport } from './taskReport.schema';
import { User } from 'src/user/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  status: TaskStatusEnum;

  @Prop({ required: true })
  requiresTaskReport: boolean;

  @Prop()
  workerAssigned?: User;

  @Prop()
  estimatedTimeToComplete?: number;

  @Prop()
  taskReport?: TaskReport;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
