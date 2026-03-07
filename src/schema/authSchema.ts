import { z } from 'zod';



export const GenerateOtpSchema = z.object({
    email: z.string().max(50).min(1),
});

export const VerifyOtpSchema = z.object({
    token: z.string().min(1),
    code: z.number().min(1),
});

export const LoginSchema = z.object({
    identifier: z.string().max(50).min(1),
    password: z.string().min(1),
});