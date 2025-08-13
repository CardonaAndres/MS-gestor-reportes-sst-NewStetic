import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChecklistReportsService } from './checklist-reports.service';
import { CreateChecklistReportDto } from './dto/create-checklist-report.dto';
import { UpdateChecklistReportDto } from './dto/update-checklist-report.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('checklist-reports')
export class ChecklistReportsController {
  constructor(private readonly checklistReportsService: ChecklistReportsService) {}

  @Post()
  create(@Body() createChecklistReportDto: CreateChecklistReportDto) {
    return this.checklistReportsService.create(createChecklistReportDto);
  }

  @Get()
  findAll() {
    return this.checklistReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checklistReportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChecklistReportDto: UpdateChecklistReportDto) {
    return this.checklistReportsService.update(+id, updateChecklistReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checklistReportsService.remove(+id);
  }
}
