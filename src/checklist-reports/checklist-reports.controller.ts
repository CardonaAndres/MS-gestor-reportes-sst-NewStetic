import { Controller, UseGuards } from '@nestjs/common';
import { ChecklistReportsService } from './checklist-reports.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('checklist-reports')
export class ChecklistReportsController {
  constructor(private readonly checklistReportsService: ChecklistReportsService) {}


}
