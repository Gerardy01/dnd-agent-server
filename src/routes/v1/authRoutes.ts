import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { GenerateOtpSchema, LoginSchema, VerifyOtpSchema } from '@/schema/authSchema';

// controller
import AuthController from '@/controller/authController';

const authRoutes = Router();

authRoutes.get(
    '/token',
    AuthController.getNewAccessToken,
);
authRoutes.post(
    '/login',
    validateRequest(LoginSchema),
    AuthController.login
);
authRoutes.post(
    '/generate-otp',
    validateRequest(GenerateOtpSchema),
    AuthController.generateOtp
);
authRoutes.post(
    '/verify-otp',
    validateRequest(VerifyOtpSchema),
    AuthController.otpVerification
);
authRoutes.post(
    '/logout',
    authenticate,
    AuthController.logout
);

export default authRoutes;
