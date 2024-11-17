import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkOrdersRoutesEnum } from './enums/workOrdersRoutes.enum';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { WorkOrdersService } from './workOrders.service';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { RolesEnum } from 'src/auth/enums';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateWorkOrderDto } from './dtos/createWorkOrder.dto';
import { GetWorkOrdersQueryParams } from 'src/shared/types/workOrders';
import { SuggestWorkOrdersAssingationsDto } from './dtos/suggestWorkOrdersAssingations.dto';

@ApiTags(WorkOrdersRoutesEnum.workOrders)
@Controller(WorkOrdersRoutesEnum.workOrders)
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Post(WorkOrdersRoutesEnum.workOrderTasksSuggest)
  async suggestWorkOrderAssignations(
    @Body(
      new ValidationPipe({
        expectedType: SuggestWorkOrdersAssingationsDto,
        transformOptions: {
          excludeExtraneousValues: true,
        },
      }),
    )
    suggestWorkOrdersAssingationsDto: SuggestWorkOrdersAssingationsDto,
  ) {
    return this.workOrdersService.suggestWorkOrderAssignations(
      suggestWorkOrdersAssingationsDto,
    );
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get(WorkOrdersRoutesEnum.workOrderCurrent)
  async getCurrentWorkOrder() {
    // TODO: Map the response to a DTO
    return this.workOrdersService.getCurrentWorkOrder();
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get(WorkOrdersRoutesEnum.workOrderCurrentByWorker)
  async getCurrentWorkOrderForWorker(@Param('workerId') workerId: string) {
    // TODO: Map the response to a DTO
    return this.workOrdersService.getCurrentWorkOrderForWorker(workerId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Get(WorkOrdersRoutesEnum.workOrderById)
  async getWorkOrderById(@Param('id') workOrderId: string) {
    // TODO: Map the response to a DTO
    return this.workOrdersService.getWorkOrderById(workOrderId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Post()
  async createWorkOrder(
    @Body(
      new ValidationPipe({
        expectedType: CreateWorkOrderDto,
        transformOptions: {
          excludeExtraneousValues: true,
        },
      }),
    )
    createWorkOrderDto: CreateWorkOrderDto,
  ) {
    return this.workOrdersService.createWorkOrder(createWorkOrderDto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Get()
  async getWorkOrders(
    @Query() getWorkOrdersQueryParams: GetWorkOrdersQueryParams,
  ) {
    return this.workOrdersService.getWorkOrders(getWorkOrdersQueryParams);
  }
}
