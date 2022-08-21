import { HttpException } from './HttpException';

export class InvalidTokenException extends HttpException{
    constructor(){
        super(`Token is invalid or expired`, 401)
    }
}