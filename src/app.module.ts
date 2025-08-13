import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChecklistReportsModule } from './checklist-reports/checklist-reports.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './app/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    DatabaseModule,
    ChecklistReportsModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
