import { z } from 'zod';



export const GenerateOtpSchema = z.object({
    email: z.string().max(50).min(1),
});