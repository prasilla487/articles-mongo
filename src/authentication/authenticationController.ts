import { controllerInterface } from '../interfaces';
import * as express from 'express';
import { userModel } from '../models';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { validationMiddleware , Logger } from '../middlewares';
import { CredentialsInCorrect, UserExistsException } from '../exceptions'

export default class AuthenticationController implements controllerInterface{
    public path = '/auth'
    public router = express.Router();
    private userModel = userModel;
    private log = new Logger();
    constructor(){
        this.initializeRoutes()
    }

    initializeRoutes(){
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.register);
        this.router.post(`${this.path}/login`, validationMiddleware(CreateUserDto), this.login)
    }

    private register = async (request : express.Request, response : express.Response , next : express.NextFunction) =>{
        const userData : CreateUserDto = request.body;
        let isUserExists = await this.userModel.findOne({ email : userData.email});
        if(isUserExists){
            next(new UserExistsException(userData.email))
        }else{
            console.log(userData.password)
            let hashedPassword = await bcrypt.hash(userData.password, 10)
            await this.userModel.create({...userData, password : hashedPassword})
            userData.password = undefined;
            response.send(userData);
        }
    }

    private login = async (request : express.Request , response : express.Response , next : express.NextFunction) => {
        const userData : CreateUserDto = request.body;
        this.log.info(`request received to login the user with mail ${userData.email}`)
        let userExists = await this.userModel.findOne ({ email : userData.email });
        if(userExists){
            const isPasswordMatched = await bcrypt.compare(userData.password, userExists.password);
            if(isPasswordMatched){
                response.send("sucess")
            }else{
                next(new CredentialsInCorrect())
            }
        }else{
            next(new CredentialsInCorrect())
        }
    }
}