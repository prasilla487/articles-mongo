import { User } from '../interfaces';
import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})

export const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);
