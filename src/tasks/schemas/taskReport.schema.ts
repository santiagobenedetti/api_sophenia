import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskReportDocument = HydratedDocument<TaskReport>;

@Schema()
export class TaskReport {
  _id: Types.ObjectId;

  @Prop({ required: true })
  detail: string;

  @Prop()
  photoUrl?: string;
}

export const TaskReportSchema = SchemaFactory.createForClass(TaskReport);
