import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from 'src/tasks/schemas/task.schema';
import { User } from 'src/user/schemas/user.schema';
import { stringify } from 'csv';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
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
      estimatedHours: task.estimatedHoursToComplete,
      actualHours: task.realHoursToComplete,
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
}
