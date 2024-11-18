import { Controller, Get, Param, Res, Query, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportRoutesEnum } from './enums/reports-routes.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesEnum } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';

@ApiTags(ReportRoutesEnum.REPORTS)
@Controller(ReportRoutesEnum.REPORTS)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Get(ReportRoutesEnum.WORKER_BY_ID)
  async generateWorkerReport(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const csvContent = await this.reportsService.generateWorkerReport(id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=worker_${id}_report.csv`,
    );
    res.send(csvContent);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiBearerAuth('access-token')
  @Get(ReportRoutesEnum.WORK_ORDER)
  async generateWorkOrdersReport(
    @Query('dateFrom') dateFrom: Date,
    @Query('dateTo') dateTo: Date,
    @Res() res: Response,
  ): Promise<void> {
    const csvContent = await this.reportsService.generateWorkOrdersReport(
      dateFrom,
      dateTo,
    );
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=workorder_report_${new Date().toDateString()}.csv`,
    );
    res.send(csvContent);
  }
}
