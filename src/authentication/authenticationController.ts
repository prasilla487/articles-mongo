import { controllerInterface , TokenData, DataStoredInToken, User} from '../interfaces';
import * as express from 'express';
import { userModel } from '../models';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { validationMiddleware , Logger } from '../middlewares';
import { CredentialsInCorrect, UserExistsException } from '../exceptions';
import * as jwt from 'jsonwebtoken';


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
            this.log.info(`registering the user with mail ${userData.email}`);
            let hashedPassword = await bcrypt.hash(userData.password, 10)
            let user = await this.userModel.create({...userData, password : hashedPassword})
            this.log.info(`Getting token`);
            let token = await this.createToken(user);
            userData.password = undefined;
            response.send({ ...userData, ...token});
        }
    }

    private login = async (request : express.Request , response : express.Response , next : express.NextFunction) => {
        const userData : CreateUserDto = request.body;
        this.log.info(`request received to login the user with mail ${userData.email}`)
        let userExists = await this.userModel.findOne ({ email : userData.email });
        if(userExists){
            const isPasswordMatched = await bcrypt.compare(userData.password, userExists.password);
            if(isPasswordMatched){
                let tokenResponse : TokenData = await this.createToken(userExists);
                response.send(tokenResponse)
            }else{
                next(new CredentialsInCorrect())
            }
        }else{
            next(new CredentialsInCorrect())
        }
    }

    private async createToken(user : User):Promise<TokenData>{
        const dataToStoreToken : DataStoredInToken = {
            _id : user._id
        }
        const secret = 'secretToSign'
        let token = await jwt.sign(dataToStoreToken, secret);
        return { token : token , expiresIn : 60 * 60 }
    }
}