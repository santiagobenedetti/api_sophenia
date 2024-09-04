import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkOrdersRoutesEnum } from './enums/workOrdersRoutes.enum';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { WorkOrdersService } from './workOrders.service';

@ApiTags(WorkOrdersRoutesEnum.workOrders)
@Controller(WorkOrdersRoutesEnum.workOrders)
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get(WorkOrdersRoutesEnum.workOrderById)
  async getWorkOrderById(@Param('id') workOrderId: string) {
    return this.workOrdersService.getWorkOrderById(workOrderId);
  }
}
