import { IsString } from 'class-validator';

export class CreatePostDto{
    
    @IsString()
    public author : string;

    @IsString()
    public title : string;

    @IsString()
    public content : string;
}