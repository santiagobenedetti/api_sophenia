import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskReport, TaskReportSchema } from './schemas/taskReport.schema';
import { ImagesController } from './controllers/images.controller';
import { ImagesService } from './services/images.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: TaskReport.name, schema: TaskReportSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TasksController, ImagesController],
  providers: [TasksService, ImagesService],
  exports: [TasksService, MongooseModule],
})
export class TasksModule {}
