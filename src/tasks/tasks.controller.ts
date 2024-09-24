import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TasksRoutesEnum } from './enums/taskRoutes.enum';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { TasksService } from './tasks.service';
import { PaginationPipe } from 'src/shared/pipes/pagination.pipe';
import { GetBacklogTasksQueryParams } from 'src/shared/types/tasks';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { RolesEnum } from 'src/auth/enums';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateTasksDto } from './dtos/createTasks.dto';

@ApiTags(TasksRoutesEnum.tasks)
@Controller(TasksRoutesEnum.tasks)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @UsePipes(new PaginationPipe())
  @Get(TasksRoutesEnum.backlog)
  async getBacklogTasks(
    @Query() getBacklogTasksQueryParams: GetBacklogTasksQueryParams,
  ) {
    // TODO: Map the response to a DTO
    return this.taskService.getBacklogTasks(getBacklogTasksQueryParams);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get(TasksRoutesEnum.taskById)
  async getTaskById(@Param('id') taskId: string) {
    // TODO: Map the response to a DTO
    return this.taskService.getTaskById(taskId);
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
    return this.taskService.createTasks(createTasks);
  }
}
