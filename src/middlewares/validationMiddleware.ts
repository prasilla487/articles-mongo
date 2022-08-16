import { validate , ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as express from 'express';
import { HttpException } from '../exceptions';

export function validationMiddleware<T>(type : any, skipMissingProperties : boolean = false) : express.RequestHandler{
    return (req, res , next) => {
        validate(plainToInstance(type, req.body) , { skipMissingProperties })
        .then((errors : any)=> {
            if(errors.length){
                const message = errors.map((error : ValidationError) => 
                    Object.values(error.constraints)).join(', ');
                next(new HttpException(message, 400))
            }else{
                next()
            }
        })
    }

}
