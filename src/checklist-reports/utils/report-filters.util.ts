import { StaffAPI } from "./staffAPI";
import { FiltersDto } from "../dto/filters.dto";
import { BadRequestException } from "@nestjs/common";
import type { Request } from "express";

export class ReportFiltersUtil {
    static async filterByTypeAndStatus(
        queryFilters: FiltersDto, 
        userDocuments: string[], 
        result: any,
        req: Request
    ){
        let addToUrl = '';
        let results: any[] = [];
        
        addToUrl += `${addToUrl ? '&' : '?'}collaboratorType=${queryFilters.collaboratorType}`;
        addToUrl += `${addToUrl ? '&' : '?'}collaboratorsStatus=${queryFilters.collaboratorsStatus}`;
        addToUrl += `${addToUrl ? '&' : '?'}collaborators=${userDocuments.map(c => c).join(',')}`;

        const reqUsers = await StaffAPI.getUsersToReport(
            req.headers.authorization?.split(' ')[1] || '', addToUrl
        );

        if(!reqUsers.success) throw new BadRequestException(reqUsers.message)
        
        result?.recordset.forEach((item: { cc_empleado: string }) => {
            const user = reqUsers.data.users.find((u: { f200_nit: string }) => u.f200_nit === item.cc_empleado);
            
            if (!user) return;

            const matchState = 
                String(user.ESTADO).toLowerCase() === String(queryFilters.collaboratorsStatus).toLowerCase();

            const matchCompany = 
                String(user.Empresa).toLowerCase() === String(queryFilters.collaboratorType).toLowerCase();

            if (matchState && matchCompany) 
                results.push(item);
        });

        return results;
        
    }
}