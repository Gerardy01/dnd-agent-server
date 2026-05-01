import { z } from 'zod';

const SpeedSchema = z.object({
    walk: z.number().int().min(0),
    burrow: z.number().int().min(0),
    climb: z.number().int().min(0),
    fly: z.number().int().min(0),
    swim: z.number().int().min(0),
});

const SensesSchema = z.object({
    blindsight: z.number().int().min(0),
    darkvision: z.number().int().min(0),
    tremorsense: z.number().int().min(0),
    truesight: z.number().int().min(0),
});

const StatsSchema = z.object({
    minHp: z.number().int().min(0),
    maxHp: z.number().int().min(0),
    ac: z.number().int().min(0),
    cr: z.number().min(0),
    str: z.number().int().min(0),
    dex: z.number().int().min(0),
    con: z.number().int().min(0),
    int: z.number().int().min(0),
    wis: z.number().int().min(0),
    cha: z.number().int().min(0),
});

const AdditionalPropertiesSchema = z.object({
    immunities: z.array(z.string()),
    resistances: z.array(z.string()),
    vulnerabilities: z.array(z.string()),
    conditionImmunities: z.array(z.string()),
});

const ActionSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});

export const CreateWorkshopMonsterSchema = z.object({
    image: z.string().optional().nullable(),
    name: z.string().min(1).max(100),
    alignment: z.string().min(1).max(50),
    size: z.string().min(1).max(50),
    type: z.string().min(1).max(50),
    description: z.string().min(1).max(500),
    appearance: z.string().min(1).max(500),
    languages: z.string().max(200).optional().nullable(),
    speed: SpeedSchema,
    senses: SensesSchema,
    stats: StatsSchema,
    additionalProperties: AdditionalPropertiesSchema.optional().nullable(),
    actions: z.array(ActionSchema).optional().nullable(),
});

export const UpdateWorkshopMonsterSchema = z.object({
    workshopMonsterId: z.number().int().positive(),
    image: z.string().optional().nullable(),
    isImageUpdated: z.boolean(),
    name: z.string().min(1).max(100),
    alignment: z.string().min(1).max(50),
    size: z.string().min(1).max(50),
    type: z.string().min(1).max(50),
    description: z.string().min(1).max(500),
    appearance: z.string().min(1).max(500),
    languages: z.string().max(200).optional().nullable(),
    speed: SpeedSchema,
    senses: SensesSchema,
    stats: StatsSchema,
    additionalProperties: AdditionalPropertiesSchema.optional().nullable(),
    actions: z.array(ActionSchema).optional().nullable(),
});
