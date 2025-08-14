import { HttpException } from "@nestjs/common"

export type error = {
    message? : string,
    status? : number
}

export const errorHandler = (err : error) : never =>{
    const message = err.message || 'Internal Server Error';
    const status = err.status || 500;
    throw new HttpException(message, status);
}