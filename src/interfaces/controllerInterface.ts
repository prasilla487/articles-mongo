import { Router } from 'express';

export interface controllerInterface {
    path : string;
    router : Router;
}