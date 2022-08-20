import { HttpException } from './HttpException';

export class CredentialsInCorrect extends HttpException{
    constructor(){
        super(`Invalida credentials provided , Please try again`, 401)
    }
}
