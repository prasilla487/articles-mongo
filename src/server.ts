import App from './app';
import PostController from './post/postController';
import './config/path';
import { validateEnv } from './config/validateEnv';
import AuthenticationController from './authentication/authenticationController';
import UserController from './user/userController';

validateEnv()
let post = new PostController()


const app = new App(process.env.PORT, [ post , new AuthenticationController() , new UserController()])

app.listen();