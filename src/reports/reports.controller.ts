import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ApiTags } from '@nestjs/swagger';
import { ReportRoutesEnum } from './enums/reports-routes.enum';

@ApiTags(ReportRoutesEnum.REPORTS)
@Controller(ReportRoutesEnum.REPORTS)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

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
}
