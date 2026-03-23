import { z } from 'zod';
import { ITEM_TYPE } from '@/constants/item';

const DamageRollSchema = z.object({
    count: z.number().int().min(1),
    dice: z.number().int().min(1),
    bonus: z.number().int(),
    damageType: z.string().min(1),
});

const WeaponPropertiesSchema = z.object({
    damageRoll: z.array(DamageRollSchema),
    light: z.boolean(),
    heavy: z.boolean(),
    finesse: z.boolean(),
    thrown: z.boolean(),
    twoHanded: z.boolean(),
    range: z.object({
        normal: z.number().int(),
        long: z.number().int(),
    }).nullable(),
    versatileDamageRoll: DamageRollSchema.nullable(),
    ammunition: z.boolean(),
    loading: z.boolean(),
    reach: z.boolean(),
});

const ArmorPropertiesSchema = z.object({
    baseAc: z.number().int(),
    strengthReq: z.number().int(),
    modifier: z.object({
        dexMod: z.boolean(),
        conMod: z.boolean(),
        wisMod: z.boolean(),
    }),
    flatAcBonus: z.number().int(),
    maxModifier: z.number().int(),
    other: z.object({
        stealthDisadvantage: z.boolean(),
    }),
});

const AdditionalPropertiesSchema = z.object({
    immunities: z.array(z.string()),
    resistances: z.array(z.string()),
    vulnerabilities: z.array(z.string()),
    conditionImmunities: z.array(z.string()),
});

const ItemBonusSchema = z.object({
    str: z.number().int(),
    dex: z.number().int(),
    con: z.number().int(),
    int: z.number().int(),
    wis: z.number().int(),
    cha: z.number().int(),
    ac: z.number().int(),
    speed: z.number().int(),
    hp: z.number().int(),
});

const ModifierBonusSchema = z.object({
    from: z.string(),
    to: z.string(),
    value: z.number().int(),
});

export const CreateItemSchema = z.object({
    image: z.string().optional(),
    name: z.string().min(1).max(100),
    type: z.enum(ITEM_TYPE as any),
    description: z.string().max(500),
    appearance: z.string().max(500),
    category: z.string(),
    rarity: z.string(),
    isMagicItem: z.boolean(),
    weight: z.number().min(0),
    cost: z.number().min(0),
    currencyUnit: z.string(),
    equipSlot: z.string().optional().nullable(),
    weaponProperties: WeaponPropertiesSchema.optional().nullable(),
    armorProperties: ArmorPropertiesSchema.optional().nullable(),
    additionalProperties: AdditionalPropertiesSchema.optional().nullable(),
    flatBonus: ItemBonusSchema.optional().nullable(),
    overrideBonus: ItemBonusSchema.optional().nullable(),
    modifierBonus: z.array(ModifierBonusSchema).optional().nullable(),
});
