export class HttpException extends Error{
    status : number;
    message : string;

    constructor(message : string, status : number){
        super(message);
        this.message = message;
        this.status = status;
        console.log('********* in httpException', this.message, this.status)
    }
}