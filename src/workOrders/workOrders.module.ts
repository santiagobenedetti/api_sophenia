import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkOrdersController } from './workOrders.controller';
import { WorkOrdersService } from './workOrders.service';
import { WorkOrder } from './schemas/workOrder.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WorkOrder.name, schema: WorkOrder }]),
  ],
  controllers: [WorkOrdersController],
  providers: [WorkOrdersService],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
