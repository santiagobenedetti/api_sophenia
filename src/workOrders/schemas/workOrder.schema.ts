import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WorkOrderDocument = HydratedDocument<WorkOrder>;

@Schema()
export class WorkOrder {
  _id: Types.ObjectId;

  @Prop({ required: true })
  tasksIds: string[];

  @Prop({ required: true })
  date: Date;
}

export const WorkOrderSchema = SchemaFactory.createForClass(WorkOrder);
