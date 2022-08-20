import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { userModel } from '../models';
import { Logger } from './Logger';
import { InvalidTokenException, TokenNotProvidedException } from '../exceptions';

const log = new Logger();

export function authMiddleware(request : express.Request, response : express.Response, next : express.NextFunction){
    const authHeader = request.headers.authorization;
    if(authHeader){
        try{
            let token = authHeader.split(' ')[1];
            let verifiedData : any = jwt.verify(token , process.env.JWTSECRET)
            const userExists = userModel.findOne({ _id : verifiedData._id });
            log.info(`Response of user with _id ${verifiedData._id} : ${userExists}`);
            if(userExists){
                next();
            }else{
                next(new InvalidTokenException());
            }
        }catch(error){
            log.info(`Error while verifying token ${error}`);
            next(new InvalidTokenException());
        }

    }else{
        next(new TokenNotProvidedException());
    }
}