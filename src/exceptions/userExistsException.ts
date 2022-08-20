import { HttpException } from './HttpException';

export class UserExistsException extends HttpException{
    constructor(email : string){
        super(`User already exists with the mail ${email}`, 500);
    }
}