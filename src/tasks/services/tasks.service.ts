import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskStatusEnum } from '../enums/taskStatus.enum';
import { GetBacklogTasksQueryParams } from 'src/shared/types/tasks';
import { mapPagination } from 'src/shared/mappers/pagination.mapper';
import { CreateTasksDto } from '../dtos/createTasks.dto';
import { CompleteTaskDto } from '../dtos/completeTask.dto';
import { TaskReport } from '../schemas/taskReport.schema';
import { OpenAIService } from 'src/openai/openai.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(TaskReport.name)
    private readonly taskReportModel: Model<TaskReport>,
    private readonly openAIService: OpenAIService,
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

  async getTasksAssignedToWorker(workerId: string) {
    const tasks = await this.taskModel
      .find({ 'workerAssigned._id': workerId })
      .exec();
    return tasks;
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

  async completeTask(taskId: string, completeTaskDto: CompleteTaskDto) {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (
      task.status == TaskStatusEnum.DONE ||
      task.status == TaskStatusEnum.IN_REVIEW
    ) {
      throw new Error('Cannot complete a task that is done or in review');
    }

    if (task.requiresTaskReport && !completeTaskDto.detail) {
      throw new Error('Task report is required');
    }

    // Asumo que todas las tasks van a review, si no es así, podemos cambiar esto
    task.status = TaskStatusEnum.IN_REVIEW;
    task.taskReport = await this.taskReportModel.create({
      detail: completeTaskDto.detail,
      photoUrl: completeTaskDto.photoUrl,
    });
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

  async rateTask(
    taskId: string,
    rating: number,
    ratingComment?: string,
  ): Promise<Task> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    task.rating = rating;
    if (ratingComment) {
      task.ratingComment = ratingComment;
    }
    return task.save();
  }

  async suggestTasks() {
    const tasks = await this.openAIService.suggestTasksToBeCreated();
    return tasks.map((task) => ({
      title: task.title,
      description: task.description,
      requiresTaskReport: task.requiresTaskReport,
      estimatedHours: task.estimatedHours,
    }));
  }
}
