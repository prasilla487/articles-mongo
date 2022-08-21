import * as express from 'express';
import { Post, controllerInterface , RequestWithUser } from '../interfaces';
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

    getAllPosts = async (request : express.Request , response : express.Response) => {
        let posts = await postModel.find().populate('author', '-password')
        response.send(posts);
    }

    createPost = async (request : RequestWithUser , response : express.Response) => {
        let post : Post = request.body;
        let createdPost = new postModel({ ...post, author : request.user._id}) ;
        let savedPost = await createdPost.save()
        await savedPost.populate('author', '-password')
        response.send(savedPost);   
    }

    public async getPostById(request : express.Request , response : express.Response , next : express.NextFunction){
        let id = request.params.id;
        let post = await postModel.findOne({_id : id}).populate('author', '-password')
        if(post){
            response.send(post);
        }
        else{
            next(new PostNotFoundException(id))
        }
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