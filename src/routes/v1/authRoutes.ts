import { Router } from 'express';

// middlewares
import { validateRequest } from '@/utils/middleware';

// schema
import { GenerateOtpSchema } from '@/schema/authSchema';

// controller
import AuthController from '@/controller/authController';

const authRoutes = Router();

authRoutes.post('/login', AuthController.login);
authRoutes.post(
    '/generate-otp',
    validateRequest(GenerateOtpSchema),
    AuthController.generateOtp
);

export default authRoutes;
