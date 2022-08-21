import { HttpException } from './HttpException';

export class TokenNotProvidedException extends HttpException{
    constructor(){
        super(`Route is authorized, Token is missing`, 400)
    }
}