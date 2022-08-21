import { TokenNotProvidedException } from '../exceptions';
import { Router , Response, NextFunction } from 'express';
import { controllerInterface, RequestWithUser } from '../interfaces';
import { authMiddleware, Logger } from '../middlewares';
import { postModel } from '../models';

export default class UserController implements controllerInterface{
    public path = '/user';
    private log = new Logger();
    public router = Router();
    constructor(){
        this.initilizeRoutes()
    }

    public initilizeRoutes(){
        this.router.get(`${this.path}/:id`, authMiddleware, this.getPostsOfUser)
    }

    getPostsOfUser = async(request : RequestWithUser, response : Response , next : NextFunction) => {
        let userId = request.params.id;
        this.log.info(`Getting posts of user ${userId}`);
        console.log(request.user._id)
        if(userId == request.user._id){
            let posts = await postModel.find({ author : userId });
            response.send(posts);
        }else{
            next(new TokenNotProvidedException())
        }
    }
}

