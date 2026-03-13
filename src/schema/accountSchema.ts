import { z } from 'zod';



export const RegisterSchema = z.object({
    email: z.string().max(50).min(1),
    password: z.string().min(1),
});

export const ForgotPasswordRequestSchema = z.object({
    email: z.string().max(50).min(1),
});

export const ResetPasswordRequestSchema = z.object({
    token: z.string().min(1),
    newPassword: z.string().min(1),
});

export const ChangeUsernameSchema = z.object({
    username: z.string().min(4).max(20),
});