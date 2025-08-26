import * as mssql from 'mssql';
import * as queries from './utils/queries';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/app/database/database.service';
import { FiltersDto } from './dto/filters.dto';
import type { Request } from 'express';

@Injectable()
export class ChecklistReportsService {
    constructor(private readonly dbService: DatabaseService){}

    async generateReport(filters: FiltersDto, req: Request){
        let AddToQuery = '';
        let collaborators = [];
        const { page = 1, limit = 10, ...queryFilters } = filters;

        const allEmpty = Object.values(queryFilters).every(value => {
            if (value === undefined || value === null) return true;
            if (typeof value === 'string' && value.trim() === '') return true;
            if (Array.isArray(value) && value.length === 0) return true;
            return false;
        });

        if(allEmpty) throw new BadRequestException('No se han proporcionado filtros para generar el reporte.');

        if(queryFilters.collaboratorType || queryFilters.collaboratorsStatus){
            let addToURL = ''

            if (queryFilters.collaboratorType) 
                addToURL += `${addToURL ? '&' : '?'}collaboratorType=${queryFilters.collaboratorType}`;

            if (queryFilters.collaboratorsStatus) 
                addToURL += `${addToURL ? '&' : '?'}collaboratorsStatus=${queryFilters.collaboratorsStatus}`;


            const reqToUsers = await fetch(`${process.env.STAFF_SERVICE}/staff/to-reports${addToURL}`, {
                credentials: 'include',
                headers: { 
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${req.headers.authorization?.split(' ')[1] || ''}` 
                }
            });

            const dataFromUsers = await reqToUsers.json();
            if(!reqToUsers.ok) 
                throw new BadRequestException(dataFromUsers.message || 'Error al obtener datos de usuarios');

            collaborators = dataFromUsers.users;

        }

        if(queryFilters.collaborators && queryFilters.collaborators.length >= 1)
            AddToQuery += ` AND chem.cc_empleado IN (${queryFilters.collaborators.map(c => `'${c}'`).join(', ')})`;
        
        if(queryFilters.examTypeID) AddToQuery += ` AND tpem.tipo_examen_id = ${queryFilters.examTypeID}`;

        if(queryFilters.examStatus) AddToQuery += ` AND chit.estado = '${queryFilters.examStatus}'`;

        if(queryFilters.startDate) AddToQuery += ` AND chit.fecha_realizado >= '${queryFilters.startDate}'`;

        if(queryFilters.endDate) AddToQuery += ` AND chit.fecha_realizado <= '${queryFilters.endDate}'`;

        const conn = await this.dbService.connect(process.env.DB_SST_NAME || 'localhost');
        const result = await conn?.request() 
         .input('page', mssql.Int, page)
         .input('limit', mssql.Int, limit)
         .query(`
            ${queries.baseQueryReport} 
            ${AddToQuery} 
            ORDER BY chit.checklist_item_id OFFSET (@page - 1) * @limit ROWS FETCH NEXT @limit ROWS ONLY;
        `);

        const totalCount = await conn?.request().query(`            
            ${queries.totalRegisters}
            ${AddToQuery}`
        );

        return {
            message: 'Reporte generado correctamente',
            results: result?.recordset,
            meta: {
                page,
                limit,
                totalRegisters: totalCount?.recordset[0]?.totalRegisters || 0,
                totalPages: Math.ceil((totalCount?.recordset[0]?.totalRegisters || 0) / limit)
            }
        }
    }
}
