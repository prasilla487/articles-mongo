import * as mongoose from 'mongoose';
import { Post } from '../interfaces';

const postSchema = new mongoose.Schema({
    author: String,
    content: String,
    title: String
})

export const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

