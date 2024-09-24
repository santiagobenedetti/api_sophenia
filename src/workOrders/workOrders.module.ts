import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkOrdersController } from './workOrders.controller';
import { WorkOrdersService } from './workOrders.service';
import { WorkOrder, WorkOrderSchema } from './schemas/workOrder.schema';
import { TasksModule } from 'src/tasks/tasks.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkOrder.name, schema: WorkOrderSchema },
    ]),
    TasksModule,
    UserModule,
  ],
  controllers: [WorkOrdersController],
  providers: [WorkOrdersService],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
