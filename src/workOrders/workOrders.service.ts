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
import { GetWorkOrdersQueryParams } from 'src/shared/types/workOrders';
import { mapPagination } from 'src/shared/mappers/pagination.mapper';
import { OpenAIService } from 'src/openai/openai.service';
import { SuggestWorkOrdersAssingationsDto } from './dtos/suggestWorkOrdersAssingations.dto';

@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectModel(WorkOrder.name)
    private readonly workOrderModel: Model<WorkOrder>,
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly openAIService: OpenAIService,
  ) {}

  async getWorkOrderById(workOrderId: string) {
    const workOrder = await this.workOrderModel.findById(workOrderId).exec();
    if (!workOrder) {
      throw new NotFoundException('Task not found');
    }

    const tasks = await this.taskModel
      .find({ _id: { $in: workOrder.tasksIds } })
      .exec();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tasksIds, ...filteredWorkOrder } = workOrder.toObject();

    return { ...filteredWorkOrder, tasks };
  }

  async createWorkOrder({ workOrderTasks, name }: CreateWorkOrderDto) {
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
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      name: name,
    });
  }

  async getCurrentWorkOrder() {
    const currentWorkOrder = await this.workOrderModel
      .findOne()
      .sort({ startDate: -1 })
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

  async getCurrentWorkOrderForWorker(workerId: string) {
    const currentWorkOrder = await this.workOrderModel
      .findOne()
      .sort({ startDate: -1 })
      .exec();

    const tasks = await this.taskModel
      .find({
        _id: { $in: currentWorkOrder.tasksIds },
        'workerAssigned._id': workerId,
      })
      .exec();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tasksIds, ...workOrderData } = currentWorkOrder.toObject();

    return {
      ...workOrderData,
      tasks,
    };
  }

  async getWorkOrders({ limit, offset }: GetWorkOrdersQueryParams) {
    const workOrders = await this.workOrderModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec();
    const total = await this.workOrderModel.countDocuments();
    return {
      data: workOrders,
      pagination: mapPagination(limit, offset, total),
    };
  }

  async suggestWorkOrderAssignations({
    taskIds,
    workersIds,
  }: SuggestWorkOrdersAssingationsDto) {
    const tasks = await this.taskModel.find({
      _id: { $in: taskIds },
    });

    const workers = await this.userModel.find({
      _id: { $in: workersIds },
    });

    const workOrderTasks =
      await this.openAIService.suggestWorkOrderTasksAssignations({
        tasks: tasks.map((task) => ({
          id: task._id.toString(),
          title: task.title,
          description: task.description,
          requiresTaskReport: task.requiresTaskReport,
          estimatedHoursToComplete: task.estimatedHoursToComplete,
        })),
        workers: workers.map((worker) => ({
          id: worker._id.toString(),
          fullname: worker.fullname,
        })),
      });

    return workOrderTasks;
  }
}
