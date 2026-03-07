import { z } from 'zod';



export const RegisterSchema = z.object({
    email: z.string().max(50).min(1),
    password: z.string().min(1),
});