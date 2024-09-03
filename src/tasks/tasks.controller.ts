import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TasksRoutesEnum } from './enums/taskRoutes.enum';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { TasksService } from './tasks.service';

@ApiTags(TasksRoutesEnum.tasks)
@Controller(TasksRoutesEnum.tasks)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get(TasksRoutesEnum.taskById)
  async getTaskById(@Param('id') taskId: string) {
    return this.taskService.getTaskById(taskId);
  }
}
