


export const SPELLCASTING_ABILITY_SELECTION = [
    "str",
    "dex",
    "con",
    "int",
    "wis",
    "cha",
] as const;
export type SpellcastingAbilitySelection = typeof SPELLCASTING_ABILITY_SELECTION[number];

export const SPELL_PREPARATION_TYPE = [
    "prepared",
    "known",
    "pact_magic",
] as const;
export type SpellPreparationType = typeof SPELL_PREPARATION_TYPE[number];

export const SPELLCASTING_TYPE = [
    "full",
    "half",
    "third",
    "pact_magic",
] as const;
export type SpellcastingType = typeof SPELLCASTING_TYPE[number];

export const CLASS_FEATURE_TYPE = [
    "active",
    "passive"
] as const;
export type ClassFeatureType = typeof CLASS_FEATURE_TYPE[number];

export const RESOURCE_RECOVERY_TYPE = [
    "flat",
    "percentage",
] as const;
export type ResourceRecoveryType = typeof RESOURCE_RECOVERY_TYPE[number];

export const PRESET_MAX_KNOWN = [
    {
        name: "cleric",
        maxCantripKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        maxSpellKnown: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
        name: "bard",
        maxCantripKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        maxSpellKnown: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    },
    {
        name: "druid",
        maxCantripKnown: [2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        maxSpellKnown: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
    },
    {
        name: "ranger",
        maxCantripKnown: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        maxSpellKnown: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
    },
    {
        name: "sorcerer",
        maxCantripKnown: [4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        maxSpellKnown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
    },
    {
        name: "warlock",
        maxCantripKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        maxSpellKnown: [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6],
    },
    {
        name: "wizard",
        maxCantripKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        maxSpellKnown: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44],
    }
]
