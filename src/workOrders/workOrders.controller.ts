import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

@ApiTags(WorkOrdersRoutesEnum.workOrders)
@Controller(WorkOrdersRoutesEnum.workOrders)
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get(WorkOrdersRoutesEnum.workOrderCurrent)
  async getCurrentWorkOrder() {
    // TODO: Map the response to a DTO
    return this.workOrdersService.getCurrentWorkOrder();
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Get(WorkOrdersRoutesEnum.workOrderById)
  async getWorkOrderById(@Param('id') workOrderId: string) {
    // TODO: Map the response to a DTO
    return this.workOrdersService.getWorkOrderById(workOrderId);
  }

  @UseGuards(JwtGuard)
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
}
