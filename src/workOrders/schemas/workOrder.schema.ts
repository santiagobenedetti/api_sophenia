import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WorkOrderDocument = HydratedDocument<WorkOrder>;

@Schema()
export class WorkOrder {
  _id: Types.ObjectId;

  @Prop({ required: true })
  tasksIds: string[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  name: string;
}

export const WorkOrderSchema = SchemaFactory.createForClass(WorkOrder);
