import { z } from 'zod';

export const CreateWorkshopFeatSchema = z.object({
    image: z.string().optional(),
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    category: z.string(),
    minLevel: z.number().int().min(1).nullable(),
});

export const UpdateWorkshopFeatSchema = z.object({
    workshopFeatId: z.number().int().positive(),
    image: z.string().optional(),
    isImageUpdated: z.boolean(),
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    category: z.string(),
    minLevel: z.number().int().min(1).nullable(),
});
