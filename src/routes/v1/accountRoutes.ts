import { Router } from 'express';

// middlewares
import { validateRequest } from '@/utils/middleware';

// schema
import { RegisterSchema } from '@/schema/accountSchema';

// controller
import AccountController from '@/controller/accountController';


const accountRoutes = Router();

accountRoutes.post(
    '/register',
    validateRequest(RegisterSchema),
    AccountController.register
);

export default accountRoutes;
