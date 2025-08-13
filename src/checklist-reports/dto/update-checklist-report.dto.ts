import { PartialType } from '@nestjs/mapped-types';
import { CreateChecklistReportDto } from './create-checklist-report.dto';

export class UpdateChecklistReportDto extends PartialType(CreateChecklistReportDto) {}
