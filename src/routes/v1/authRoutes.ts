import { Router } from 'express';

// middlewares


// schema


// controller
import AuthController from '@/controller/authController';

const authRoutes = Router();

authRoutes.post('/login', AuthController.login);
authRoutes.post('/generate-otp', AuthController.generateOtp);

export default authRoutes;
