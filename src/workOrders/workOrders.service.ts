import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkOrder } from './schemas/workOrder.schema';
import { CreateWorkOrderDto } from './dtos/createWorkOrder.dto';
import { Task } from 'src/tasks/schemas/task.schema';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectModel(WorkOrder.name)
    private readonly workOrderModel: Model<WorkOrder>,
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getWorkOrderById(workOrderId: string) {
    const workOrder = await this.workOrderModel.findById(workOrderId).exec();
    if (!workOrder) {
      throw new NotFoundException('Task not found');
    }

    return workOrder;
  }

  async createWorkOrder({ workOrderTasks }: CreateWorkOrderDto) {
    const tasks = [];
    for (const { taskId, workerAssignedId } of workOrderTasks) {
      const foundTask = await this.taskModel.findById(taskId).exec();
      if (!foundTask) {
        throw new NotFoundException('Task not found');
      }
      if (tasks.some((task) => task._id === taskId)) {
        throw new BadRequestException('Task already assigned to work order');
      }
      const foundWorker = await this.userModel
        .findById(workerAssignedId)
        .exec();
      if (!foundWorker) {
        throw new NotFoundException('User not found');
      }
      foundTask.workerAssigned = foundWorker;
      await foundTask.save();
    }
    return this.workOrderModel.create({
      tasksIds: workOrderTasks.map(({ taskId }) => taskId),
      date: new Date(),
    });
  }

  async getCurrentWorkOrder() {
    const currentWorkOrder = await this.workOrderModel
      .findOne()
      .sort({ date: -1 })
      .exec();

    const tasks = await this.taskModel
      .find({ _id: { $in: currentWorkOrder.tasksIds } })
      .exec();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tasksIds, ...workOrderData } = currentWorkOrder.toObject();

    return {
      ...workOrderData,
      tasks,
    };
  }
}
