import { z } from "zod";



export const GetUploadUrlSchema = z.object({
    fileType: z.string().min(1),
    fileSize: z.number().min(1),
});