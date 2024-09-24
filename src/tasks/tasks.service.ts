import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskStatusEnum } from './enums/taskStatus.enum';
import { GetBacklogTasksQueryParams } from 'src/shared/types/tasks';
import { mapPagination } from 'src/shared/mappers/pagination.mapper';
import { CreateTasksDto } from './dtos/createTasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async getTaskById(taskId: string) {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async getBacklogTasks({ limit, offset }: GetBacklogTasksQueryParams) {
    const backlogCondition = {
      workerAssigned: null,
      status: TaskStatusEnum.PENDING,
    };
    const backlogTasks = await this.taskModel
      .find(backlogCondition)
      .skip(offset)
      .limit(limit)
      .exec();
    const total = await this.taskModel.countDocuments(backlogCondition);
    return {
      data: backlogTasks,
      pagination: mapPagination(limit, offset, total),
    };
  }

  async createTasks({ tasks }: CreateTasksDto) {
    return this.taskModel.create(tasks);
  }

  async updateTaskStatus(taskId: string, status: TaskStatusEnum) {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(taskId: string) {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.status !== TaskStatusEnum.PENDING) {
      throw new Error('Cannot delete a task that is not pending');
    }

    await task.deleteOne();
  }
}
