


export const MONSTER_SIZE = [
    "tiny",
    "small",
    "medium",
    "large",
    "huge",
    "gargantuan",
] as const;
export type MonsterSize = typeof MONSTER_SIZE[number];

export const MONSTER_TYPE = [
    "aberration",
    "beast",
    "celestial",
    "construct",
    "dragon",
    "elemental",
    "fey",
    "fiend",
    "giant",
    "humanoid",
    "monstrosity",
    "ooze",
    "plant",
    "undead",
    "other",
] as const;
export type MonsterType = typeof MONSTER_TYPE[number];

export const ALIGNMENT = [
    "unaligned",
    "lawful_good",
    "neutral_good",
    "chaotic_good",
    "lawful_neutral",
    "true_neutral",
    "chaotic_neutral",
    "lawful_evil",
    "neutral_evil",
    "chaotic_evil",
] as const;
export type Alignment = typeof ALIGNMENT[number];

export const MOVEMENT_SELECTION = [
    "walk",
    "burrow",
    "climb",
    "fly",
    "swim",
] as const;
export type MovementSelection = typeof MOVEMENT_SELECTION[number];

export const SENSES_SELECTION = [
    "darkvision",
    "truesight",
    "blindsight",
    "tremorsense",
] as const;
export type SensesSelection = typeof SENSES_SELECTION[number];