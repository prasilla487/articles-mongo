import { User } from '../interfaces';
import * as mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    city : String,
    street : String
})

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    address : addressSchema
})

export const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);
