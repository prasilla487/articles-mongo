import App from './app';
import PostController from './post/postController';
import './config/path';
import { validateEnv } from './config/validateEnv';

validateEnv()
let post = new PostController()

const app = new App(process.env.PORT, [ post ])

app.listen();