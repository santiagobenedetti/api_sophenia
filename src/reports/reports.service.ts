import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from 'src/tasks/schemas/task.schema';
import { User } from 'src/user/schemas/user.schema';
import { stringify } from 'csv';
import { WorkOrder } from 'src/workOrders/schemas/workOrder.schema';
import { TaskStatusEnum } from 'src/tasks/enums/taskStatus.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(WorkOrder.name) private workOrderModel: Model<WorkOrder>,
  ) {}

  async generateWorkerReport(workerId: string): Promise<string> {
    const user = await this.userModel.findById(workerId).exec();
    if (!user) {
      throw new NotFoundException(`Worker with ID ${workerId} not found`);
    }

    const workerObjectId = new Types.ObjectId(workerId);
    const tasks = await this.taskModel
      .find({ 'workerAssigned._id': workerObjectId })
      .exec();

    const records = tasks.map((task) => ({
      title: task.title,
      description: task.description,
      rating: task.rating,
      estimatedHours: task.estimatedHoursToComplete || 0,
      actualHours: task.realHoursToComplete || 0,
    }));

    return new Promise((resolve, reject) => {
      stringify(
        records,
        {
          header: true,
          columns: [
            { key: 'title', header: 'Title' },
            { key: 'description', header: 'Description' },
            { key: 'rating', header: 'Rating' },
            { key: 'estimatedHours', header: 'Estimated Hours' },
            { key: 'actualHours', header: 'Actual Hours' },
          ],
        },
        (err, output) => {
          if (err) {
            return reject(err);
          }
          resolve(output);
        },
      );
    });
  }

  async generateWorkOrdersReport(dateFrom: Date, dateTo: Date) {
    // Find all the workorders between the given dates and include the tasks
    const workOrders = await this.workOrderModel
      .find({
        date: { $gte: dateFrom, $lte: dateTo },
      })
      .exec();

    const populatedWorkOrders = await Promise.all(
      workOrders.map(async (workOrder) => {
        const tasks = await this.taskModel
          .find({ _id: { $in: workOrder.tasksIds } })
          .exec();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tasksIds, ...filteredWorkOrder } = workOrder.toObject();

        return { ...filteredWorkOrder, tasks };
      }),
    );

    const records = populatedWorkOrders.map((workOrder) => ({
      date: workOrder.date.toDateString(),
      totalTasks: workOrder.tasks.length,
      completedTasks: workOrder.tasks.filter(
        (task) => task.status === TaskStatusEnum.DONE,
      ).length,
      totalEstimatedHours: workOrder.tasks.reduce(
        (acc, task) =>
          acc + task.estimatedHoursToComplete
            ? task.estimatedHoursToComplete
            : 0,
        0,
      ),
      totalActualHours: workOrder.tasks.reduce(
        (acc, task) =>
          acc + task.realHoursToComplete ? task.realHoursToComplete : 0,
        0,
      ),
    }));

    return new Promise((resolve, reject) => {
      stringify(
        records,
        {
          header: true,
          columns: [
            { key: 'date', header: 'Date' },
            { key: 'totalTasks', header: 'Total Tasks' },
            { key: 'completedTasks', header: 'Completed Tasks' },
            { key: 'totalEstimatedHours', header: 'Total Estimated Hours' },
            { key: 'totalActualHours', header: 'Total Actual Hours' },
          ],
        },
        (err, output) => {
          if (err) {
            return reject(err);
          }
          resolve(output);
        },
      );
    });
  }
}
