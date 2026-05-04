


export const DICE_SELECTION = [
    "d2",
    "d4",
    "d6",
    "d8",
    "d10",
    "d12",
    "d14",
    "d16",
    "d18",
    "d20",
] as const;
export type DiceSelection = typeof DICE_SELECTION[number];