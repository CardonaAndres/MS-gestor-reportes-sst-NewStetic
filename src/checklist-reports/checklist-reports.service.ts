import * as mssql from 'mssql';
import * as queries from './utils/queries';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/app/database/database.service';
import { FiltersDto } from './dto/filters.dto';
import type { Request } from 'express';
import { ReportFiltersUtil } from './utils/report-filters.util';

@Injectable()
export class ChecklistReportsService {
    constructor(private readonly dbService: DatabaseService){}

    async generateReport(filters: FiltersDto, req: Request){
        let addToQuery = '';
        let totalRegisters: number = 0;
        let resultsWithFilters: any[] = [];
        const { page = 1, limit = 10, ...queryFilters } = filters;

        const allEmpty = Object.values(queryFilters).every(value => {
            if (value === undefined || value === null) return true;
            if (typeof value === 'string' && value.trim() === '') return true;
            if (Array.isArray(value) && value.length === 0) return true;
            return false;
        });

        if(allEmpty) throw new BadRequestException('No se han proporcionado filtros para generar el reporte.');

        if(queryFilters.collaborators && queryFilters.collaborators.length >= 1)
            addToQuery += ` AND chem.cc_empleado IN (${queryFilters.collaborators.map(c => `'${c}'`).join(', ')})`;
        
        if(queryFilters.examTypeID) addToQuery += ` AND tpem.tipo_examen_id = ${queryFilters.examTypeID}`;

        if(queryFilters.examStatus) addToQuery += ` AND chit.estado = '${queryFilters.examStatus}'`;

        if(queryFilters.startDate) addToQuery += ` AND chit.fecha_realizado >= '${queryFilters.startDate}'`;

        if(queryFilters.endDate) addToQuery += ` AND chit.fecha_realizado <= '${queryFilters.endDate}'`;

        const conn = await this.dbService.connect(process.env.DB_SST_NAME || 'localhost');
        const result = await conn?.request() 
         .input('page', mssql.Int, page)
         .input('limit', mssql.Int, limit)
         .query(`
            ${queries.baseQueryReport} 
            ${addToQuery} 
            ${queryFilters.collaboratorType || queryFilters.collaboratorsStatus 
                ? '' 
                : `ORDER BY chit.checklist_item_id OFFSET (@page - 1) * @limit ROWS FETCH NEXT @limit ROWS ONLY`
            }
        `);

        resultsWithFilters = result?.recordset || [];

        const docsSource = !queryFilters.collaborators
         ? result?.recordset.map(item => item.cc_empleado) 
         : queryFilters.collaborators || [];

        const userDocuments = [...new Set(docsSource)];

        if(queryFilters.collaboratorType && queryFilters.collaboratorsStatus)
            resultsWithFilters = await ReportFiltersUtil.filterByTypeAndStatus(filters, userDocuments, result, req)
        
        if (!queryFilters.collaboratorType && !queryFilters.collaboratorsStatus) {
            const totalCount = await conn?.request().query(`
                ${queries.totalRegisters}
                ${addToQuery}
            `);

            totalRegisters = totalCount?.recordset[0]?.totalRegisters || 0;
        } else {
            totalRegisters = resultsWithFilters.length;
        }
        
        return {
            message: 'Reporte generado correctamente',
            results: resultsWithFilters,
            meta: {
                page,
                limit,
                totalRegisters,
                totalPages: Math.ceil((totalRegisters || 0) / limit)
            }
        }
    }
}
