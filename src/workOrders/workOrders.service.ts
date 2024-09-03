import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkOrder } from './schemas/workOrder.schema';

@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectModel(WorkOrder.name)
    private readonly workOrderModel: Model<WorkOrder>,
  ) {}

  async getWorkOrderById(workOrderId: string) {
    const workOrder = await this.workOrderModel.findById(workOrderId).exec();
    if (!workOrder) {
      throw new NotFoundException('Task not found');
    }

    return workOrder;
  }
}
