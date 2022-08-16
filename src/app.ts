import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import { errorMiddleware  } from './middlewares'

export default class App{
    private app : express.Application;
    public port : number;
    constructor(port, controllers){
        this.app = express()
        this.port = port;
        this.intializaMiddlewares();
        this.initializeControllers(controllers);
        this.connectToDatabase();
    }

    private intializaMiddlewares() {
        this.app.use(bodyParser.json())
        this.app.use(errorMiddleware);
    }

    private initializeControllers(contollers : any[]){
        contollers.forEach((controller) => {
            this.app.use('/api', controller.router)
        })
    }

    public listen(){
        this.app.listen(this.port, ()=>{
            console.log('Listening at', this.port)
        })
    }

    private connectToDatabase(){
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH 
        } = process.env;
        mongoose.connect(MONGO_PATH);
    }

}