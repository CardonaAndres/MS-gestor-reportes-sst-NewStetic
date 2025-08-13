import { Module } from '@nestjs/common';
import { ChecklistReportsService } from './checklist-reports.service';
import { ChecklistReportsController } from './checklist-reports.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ChecklistReportsController],
  providers: [ChecklistReportsService],
})
export class ChecklistReportsModule {}
