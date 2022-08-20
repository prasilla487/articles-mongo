import * as express from 'express';

export class Logger{
    constructor(){}

    public info(message : string){
        console.log(message);
    }
} 