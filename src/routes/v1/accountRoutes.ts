import { Router } from 'express';

// middlewares
import { validateRequest } from '@/utils/middleware';

// schema
import { ForgotPasswordRequestSchema, RegisterSchema } from '@/schema/accountSchema';

// controller
import AccountController from '@/controller/accountController';


const accountRoutes = Router();

accountRoutes.post(
    '/action/register',
    validateRequest(RegisterSchema),
    AccountController.register,
);
accountRoutes.post(
    '/action/forgot-password',
    validateRequest(ForgotPasswordRequestSchema),
    AccountController.forgotPasswordRequest,
);

export default accountRoutes;
