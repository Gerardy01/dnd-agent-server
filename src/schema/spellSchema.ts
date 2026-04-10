import { z } from 'zod';

const DamageRollSchema = z.object({
    count: z.number().int().min(1),
    dice: z.number().int().min(1),
    bonus: z.number().int(),
    damageType: z.string().min(1),
});

const AttackPropertiesSchema = z.object({
    requiresRangedAttackRoll: z.boolean(),
    damageRoll: z.array(DamageRollSchema),
});

const SpellSavePropertiesSchema = z.object({
    stat: z.string().min(1),
    onSuccessDamagePercentage: z.number().min(0).max(100),
    onFailDamagePercentage: z.number().min(0).max(100),
});

export const CreateWorkshopSpellSchema = z.object({
    image: z.string().optional(),
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    level: z.number().int().min(0).max(20),
    range: z.number().int().min(0),
    school: z.string(),
    attackProperties: AttackPropertiesSchema.optional().nullable(),
    spellSaveProperties: SpellSavePropertiesSchema.optional().nullable(),
});

export const UpdateWorkshopSpellSchema = z.object({
    workshopSpellId: z.number().int().positive(),
    image: z.string().optional(),
    isImageUpdated: z.boolean(),
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    level: z.number().int().min(0).max(20),
    range: z.number().int().min(0),
    school: z.string(),
    attackProperties: AttackPropertiesSchema.optional().nullable(),
    spellSaveProperties: SpellSavePropertiesSchema.optional().nullable(),
});
