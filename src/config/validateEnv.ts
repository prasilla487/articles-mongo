import { cleanEnv , port, str } from 'envalid';

export function validateEnv(){
    cleanEnv(process.env, {
        MONGO_USER : str(),
        MONGO_PASSWORD : str(),
        MONGO_PATH : str(),
        PORT : port()
    })
}