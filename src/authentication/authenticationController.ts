import { controllerInterface } from '../interfaces';
import * as express from 'express';
import { userModel } from '../models';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { validationMiddleware } from '../middlewares';
import { UserExistsException } from '../exceptions'

export default class AuthenticationController implements controllerInterface{
    public path = '/auth'
    public router = express.Router();
    private userModel = userModel;
    constructor(){
        this.initializeRoutes()
    }

    initializeRoutes(){
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.register)
    }

    public register = async (request : express.Request, response : express.Response , next : express.NextFunction) =>{
        const userData : CreateUserDto = request.body;
        let isUserExists = await this.userModel.findOne({ email : userData.email});
        if(isUserExists){
            next(new UserExistsException(userData.email))
        }else{
            let hashedPassword = await bcrypt.hash(userData.password, 10)
            await this.userModel.create({...userData, password : hashedPassword})
            userData.password = undefined;
            response.send(userData);
        }
    }
}