


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