import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TasksRoutesEnum } from '../enums/taskRoutes.enum';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { TasksService } from '../services/tasks.service';
import { PaginationPipe } from 'src/shared/pipes/pagination.pipe';
import { GetBacklogTasksQueryParams } from 'src/shared/types/tasks';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { RolesEnum } from 'src/auth/enums';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateTasksDto } from '../dtos/createTasks.dto';
import { UpdateTaskStatusDto } from '../dtos/updateTaskStatus.dto';
import { CompleteTaskDto } from '../dtos/completeTask.dto';
import { RateTaskDto } from '../dtos/taskRate.dto';

@ApiTags(TasksRoutesEnum.tasks)
@Controller(TasksRoutesEnum.tasks)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @UsePipes(new PaginationPipe())
  @Get(TasksRoutesEnum.backlog)
  async getBacklogTasks(
    @Query() getBacklogTasksQueryParams: GetBacklogTasksQueryParams,
  ) {
    // TODO: Map the response to a DTO
    return this.tasksService.getBacklogTasks(getBacklogTasksQueryParams);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get(TasksRoutesEnum.taskById)
  async getTaskById(@Param('id') taskId: string) {
    // TODO: Map the response to a DTO
    return this.tasksService.getTaskById(taskId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Post()
  async createTasks(
    @Body(
      new ValidationPipe({
        expectedType: CreateTasksDto,
        transformOptions: {
          excludeExtraneousValues: true,
        },
      }),
    )
    createTasks: CreateTasksDto,
  ) {
    return this.tasksService.createTasks(createTasks);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Patch(TasksRoutesEnum.taskStatus)
  async updateTaskStatus(
    @Param('id') taskId: string,
    @Body(
      new ValidationPipe({
        expectedType: UpdateTaskStatusDto,
        transformOptions: {
          excludeExtraneousValues: true,
        },
      }),
    )
    { status }: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateTaskStatus(taskId, status);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Post(TasksRoutesEnum.completeTask)
  async completeTask(
    @Param('id') taskId: string,
    @Body(
      new ValidationPipe({
        expectedType: CompleteTaskDto,
        transformOptions: {
          excludeExtraneousValues: true,
        },
      }),
    )
    completeTaskDto: CompleteTaskDto,
  ) {
    return this.tasksService.completeTask(taskId, completeTaskDto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Delete(TasksRoutesEnum.taskById)
  async deleteTask(@Param('id') taskId: string) {
    return this.tasksService.deleteTask(taskId);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Patch(':id/rate')
  async rateTask(
    @Param('id') taskId: string,
    @Body(
      new ValidationPipe({
        expectedType: RateTaskDto,
        transformOptions: {
          excludeExtraneousValues: true,
        },
      }),
    )
    rateTaskDto: RateTaskDto,
  ) {
    return this.tasksService.rateTask(taskId, rateTaskDto.rating);
  }
}
