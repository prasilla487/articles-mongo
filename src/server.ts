import App from './app';
import PostController from './post/postController';
import './config/path';
import { validateEnv } from './config/validateEnv';
import AuthenticationController from './authentication/authenticationController';

validateEnv()
let post = new PostController()


const app = new App(process.env.PORT, [ post , new AuthenticationController()])

app.listen();