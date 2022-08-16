import { HttpException } from './HttpException';

export class PostNotFoundException extends HttpException{
    constructor(id : string){
        console.log('---------------- postNotFound Exception');
        super(`Post with id ${id} not found`, 404)
    }
}