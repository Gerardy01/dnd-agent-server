import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { ChangeUsernameSchema, ForgotPasswordRequestSchema, RegisterSchema, ResetPasswordRequestSchema } from '@/schema/accountSchema';

// controller
import AccountController from '@/controller/accountController';


const accountRoutes = Router();

accountRoutes.get(
    '/action/user',
    authenticate,
    AccountController.getUserAccount,
);
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
accountRoutes.put(
    '/action/reset-password',
    validateRequest(ResetPasswordRequestSchema),
    AccountController.resetPassword,
);
accountRoutes.put(
    '/action/change-username',
    authenticate,
    validateRequest(ChangeUsernameSchema),
    AccountController.changeUsername,
);

export default accountRoutes;
