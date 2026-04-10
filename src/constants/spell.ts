

export const SPELL_SCHOOL = [
    "abjuration",
    "conjuration",
    "divination",
    "enchantment",
    "evocation",
    "illusion",
    "necromancy",
    "transmutation",
] as const;
export type SpellSchool = typeof SPELL_SCHOOL[number];

export const SAVING_THROW_STAT = [
    "str",
    "dex",
    "con",
    "int",
    "wis",
    "cha",
] as const;
export type SavingThrowStat = typeof SAVING_THROW_STAT[number];