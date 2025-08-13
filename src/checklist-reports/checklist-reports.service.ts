import { Injectable } from '@nestjs/common';
import { CreateChecklistReportDto } from './dto/create-checklist-report.dto';
import { UpdateChecklistReportDto } from './dto/update-checklist-report.dto';

@Injectable()
export class ChecklistReportsService {
  create(createChecklistReportDto: CreateChecklistReportDto) {
    return 'This action adds a new checklistReport';
  }

  findAll() {
    return `This action returns all checklistReports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checklistReport`;
  }

  update(id: number, updateChecklistReportDto: UpdateChecklistReportDto) {
    return `This action updates a #${id} checklistReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} checklistReport`;
  }
}
