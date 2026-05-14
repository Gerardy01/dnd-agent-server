import { z } from 'zod';

const MaxKnownSchema = z.object({
    level: z.number().int().min(1),
    amount: z.number().int().min(0),
});


const SpellcastingPropertiesSchema = z.object({
    spellcastingAbility: z.string(),
});

const TraitsSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1),
    level: z.number().int().min(1),
    type: z.string(),
});


export const CreateWorkshopRaceSchema = z.object({
    image: z.string().nullable().optional(),
    name: z.string().min(1).max(100),
    description: z.string().min(1),
    speed: z.number().int().min(0),
    language: z.string().min(1),
    spellcastingProperties: SpellcastingPropertiesSchema.nullable(),
    traits: z.array(TraitsSchema),
    spellIds: z.array(z.number().int()),
});

export const UpdateWorkshopRaceSchema = z.object({
    workshopRaceId: z.number().int().positive(),
    isImageUpdated: z.boolean(),
    image: z.string().nullable().optional(),
    name: z.string().min(1).max(100),
    description: z.string().min(1),
    speed: z.number().int().min(0),
    language: z.string().min(1),
    spellcastingProperties: SpellcastingPropertiesSchema.nullable(),
    traits: z.array(TraitsSchema),
    spellIds: z.array(z.number().int()),
});

export const AddTraitsSchema = z.object({
    workshopRaceId: z.number().int().positive(),
    trait: TraitsSchema,
});

export const EditTraitsSchema = z.object({
    workshopRaceId: z.number().int().positive(),
    currentTrait: TraitsSchema,
    newTrait: TraitsSchema,
});

export const DeleteTraitsSchema = z.object({
    workshopRaceId: z.number().int().positive(),
    trait: TraitsSchema,
});

