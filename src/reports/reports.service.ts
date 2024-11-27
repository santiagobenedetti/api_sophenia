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
      // description: task.description,
      rating: task.rating,
      estimatedHoursToComplete: task.estimatedHoursToComplete || 0,
      actualHours: task.realHoursToComplete || 0,
    }));

    return new Promise((resolve, reject) => {
      stringify(
        records,
        {
          header: true,
          columns: [
            { key: 'title', header: 'Tarea' },
            // { key: 'description', header: 'Description' },
            { key: 'rating', header: 'Puntaje obtenido' },
            {
              key: 'estimatedHoursToComplete',
              header: 'Horas estimadas',
            },
            { key: 'actualHours', header: 'Horas consumidas' },
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
        startDate: { $gte: dateFrom, $lte: dateTo },
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
      date: workOrder.startDate.toDateString(),
      totalTasks: workOrder.tasks.length,
      completedTasks: workOrder.tasks.filter(
        (task) => task.status === TaskStatusEnum.DONE,
      ).length,
      totalEstimatedHours: workOrder.tasks
        .reduce(
          (acc, task) =>
            task.estimatedHoursToComplete
              ? acc + task.estimatedHoursToComplete
              : 0,
          0,
        )
        .toFixed(1),
      totalActualHours: workOrder.tasks
        .reduce(
          (acc, task) =>
            task.realHoursToComplete ? acc + task.realHoursToComplete : 0,
          0,
        )
        .toFixed(1),
    }));

    return new Promise((resolve, reject) => {
      stringify(
        records,
        {
          header: true,
          columns: [
            { key: 'date', header: 'Fecha' },
            { key: 'totalTasks', header: 'Cantidad de tareas' },
            { key: 'completedTasks', header: 'Tareas completadas' },
            { key: 'totalEstimatedHours', header: 'Total de horas estimadas' },
            { key: 'totalActualHours', header: 'Total de horas consumidas' },
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
