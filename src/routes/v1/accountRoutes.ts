import { Router } from 'express';

// middlewares


// schema


// controller
import AccountController from '@/controller/accountController';


const accountRoutes = Router();

accountRoutes.post('/register', AccountController.register);

export default accountRoutes;
