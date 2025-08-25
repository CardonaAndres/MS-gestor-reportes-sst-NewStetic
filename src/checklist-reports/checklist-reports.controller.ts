import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ChecklistReportsService } from './checklist-reports.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { errorHandler } from 'src/app/utils/error.handler';
import { FiltersDto } from './dto/filters.dto';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('checklist-exams')
export class ChecklistReportsController {
  constructor(private readonly checklistReportsService: ChecklistReportsService) {}

  @Get('/')
  @ApiOperation({ summary: 'Generates a checklist report' })
  async generateReport(@Req() req: Request, @Query() filters: FiltersDto){
    try {
      return await this.checklistReportsService.generateReport(filters, req);
    } catch (err) {
      errorHandler(err);
    }
  }

}
