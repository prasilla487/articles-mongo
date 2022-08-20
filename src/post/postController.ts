import * as express from 'express';
import { Post, controllerInterface } from '../interfaces';
import { postModel } from '../models';
import { PostNotFoundException } from '../exceptions';
import { validationMiddleware , authMiddleware } from '../middlewares';
import { CreatePostDto } from './post.dto'

export default class PostController implements controllerInterface{
    public path = '/posts';
    public router = express.Router();

    constructor(){
        this.initilizeRoutes()
    }

    public initilizeRoutes(){
        this.router.get(this.path, authMiddleware ,this.getAllPosts);
        this.router.post(this.path, authMiddleware ,validationMiddleware(CreatePostDto), this.createPost);
        this.router.get(`${this.path}/:id`,authMiddleware ,this.getPostById);
        this.router.patch(`${this.path}/:id`, authMiddleware , validationMiddleware(CreatePostDto, true), this.updatePost);
        this.router.delete(`${this.path}/:id`,authMiddleware , this.deletePost);
    }

    getAllPosts = (request : express.Request , response : express.Response) => {
        postModel.find().then((posts) => {
            response.send(posts);
        })
    }

    createPost = (request : express.Request , response : express.Response) => {
        let post : Post = request.body;
        let createdPost = new postModel(post);
        createdPost.save()
        .then((postResponse) => {
            response.send(postResponse)
        })
    }

    public getPostById(request : express.Request , response : express.Response , next : express.NextFunction){
        let id = request.params.id;
        postModel.findOne({_id : id}).then((post) => {
            if(post){
                response.send(post);
            }
            else{
                next(new PostNotFoundException(id))
            }
        })
    }

    public updatePost(request : express.Request, response : express.Response){
        let id = request.params.id;
        let post = request.body;
        postModel.findByIdAndUpdate(id, post, { new : true}).then((post) => {
            response.send(post);
        })
    }

    public deletePost(request : express.Request, response : express.Response){
        let id = request.params.id;
        postModel.findByIdAndDelete(id).then((message) => {
            if(message){
                response.send(200)
            }else{
                response.send(404)
            }
        })
    }
}