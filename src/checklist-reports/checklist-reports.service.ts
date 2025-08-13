import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/app/database/database.service';

@Injectable()
export class ChecklistReportsService {
    constructor(private readonly dbService: DatabaseService){}
}
