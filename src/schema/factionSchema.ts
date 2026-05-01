import { z } from "zod";

export const CreateFactionSchema = z.object({
    image: z.string().optional(),
    name: z.string().min(1).max(100),
    description: z.string().min(1),
    color: z.string().min(1).max(50),
});

export const UpdateFactionSchema = z.object({
    workshopFactionId: z.number(),
    image: z.string().optional(),
    isImageUpdated: z.boolean(),
    name: z.string().min(1).max(100),
    description: z.string().min(1),
    color: z.string().min(1).max(50),
});
