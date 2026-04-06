


export const FEAT_CATEGORY = [
    "combat",
    "skill",
    "magic",
    "social",
    "movement",
    "defense",
    "general",
    "origin",
    "epic_boon",
    "fighting_style",
] as const;
export type ItemType = typeof FEAT_CATEGORY[number];