import * as mongoose from 'mongoose';
import { Post } from '../interfaces';

const postSchema = new mongoose.Schema({
    author: {
        ref : 'User',
        type : mongoose.Schema.Types.ObjectId
    },
    content: String,
    title: String
})

export const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

