import { z } from 'zod';

const MaxKnownSchema = z.object({
    level: z.number().int().min(1),
    amount: z.number().int().min(0),
});

const ResourceRecoveryPropsSchema = z.object({
    value: z.number().int().min(0),
    type: z.string(),
});

const ResourceRecoverySchema = z.object({
    shortRest: ResourceRecoveryPropsSchema,
    longRest: ResourceRecoveryPropsSchema,
});

const SpellcastingPropertiesSchema = z.object({
    spellcastingAbility: z.string(),
    preparationType: z.string(),
    spellcastingType: z.string(),
    maxCantripKnown: z.array(MaxKnownSchema),
    maxSpellKnown: z.array(MaxKnownSchema),
    preparedLvlBonus: z.number().int(),
    preparedModBonus: z.boolean(),
});

const FeaturesSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1),
    level: z.number().int().min(1),
    type: z.string(),
});

const CreateClassResourceSchema = z.object({
    image: z.string().nullable().optional(),
    name: z.string().min(1).max(100),
    description: z.string().min(1),
    color: z.string().max(50),
    maxPerLevel: z.array(MaxKnownSchema),
    resourceRecovery: ResourceRecoverySchema,
});

export const CreateWorkshopClassSchema = z.object({
    image: z.string().nullable().optional(),
    name: z.string().min(1).max(100),
    description: z.string().min(1),
    hitDie: z.string().max(10),
    subclassLevel: z.number().int().min(1),
    spellcastingProperties: SpellcastingPropertiesSchema.nullable(),
    features: z.array(FeaturesSchema),
    resources: z.array(CreateClassResourceSchema),
    spellIds: z.array(z.number().int()),
});

export const UpdateWorkshopClassSchema = z.object({
    workshopClassId: z.number().int().positive(),
    isImageUpdated: z.boolean(),
    image: z.string().nullable().optional(),
    name: z.string().min(1).max(100),
    description: z.string().min(1),
    hitDie: z.string().max(10),
    subclassLevel: z.number().int().min(1),
    spellcastingProperties: SpellcastingPropertiesSchema.nullable(),
    features: z.array(FeaturesSchema),
    resources: z.array(CreateClassResourceSchema),
    spellIds: z.array(z.number().int()),
});

export const AddFeatureSchema = z.object({
    workshopClassId: z.number().int().positive(),
    feature: FeaturesSchema,
});

export const EditFeatureSchema = z.object({
    workshopClassId: z.number().int().positive(),
    currentFeature: FeaturesSchema,
    newFeature: FeaturesSchema,
});

export const DeleteFeatureSchema = z.object({
    workshopClassId: z.number().int().positive(),
    feature: FeaturesSchema,
});

export const AddResourceSchema = z.object({
    workshopClassId: z.number().int().positive(),
    resource: CreateClassResourceSchema,
});

export const EditResourceSchema = z.object({
    workshopClassId: z.number().int().positive(),
    classResourceId: z.number().int().positive(),
    resource: CreateClassResourceSchema,
});

export const DeleteResourceSchema = z.object({
    workshopClassId: z.number().int().positive(),
    classResourceId: z.number().int().positive(),
});
