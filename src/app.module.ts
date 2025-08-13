import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChecklistReportsModule } from './checklist-reports/checklist-reports.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    ChecklistReportsModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
