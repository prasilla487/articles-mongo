import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions';

export function errorMiddleware(error : HttpException, request : Request, response : Response, next : NextFunction){
    const message = error.message || 'Something went wrong';
    const status = error.status || 500;
    response.status(status).send({
        status , message
    })

}
