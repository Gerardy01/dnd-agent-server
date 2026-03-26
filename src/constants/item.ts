


export const ITEM_TYPE = [
    "gear",
    "weapon",
    "armor",
] as const;
export type ItemType = typeof ITEM_TYPE[number];

export const GEAR_CATEGORIES = [
    "ammunition",
    "consumable",
    "adventuring_gear",
    "arcane_foci",
    "artisan_tools",
    "druidic_foci",
    "equipment_packs",
    "gaming_sets",
    "holy_symbols",
    "shield",
    "kits",
    "mounts_and_vehicles",
    "musical_instruments",
    "other_tools",
    "potion",
    "ring",
    "rod",
    "scroll",
    "staff",
    "standard_gear",
    "wand",
    "wondrous_items",
    "container",
    "jewelry",
    "food",
    "clothing",
    "accessory",
    "map",
    "miscellaneous"
] as const;
export type GearCategory = typeof GEAR_CATEGORIES[number];

export const WEAPON_CATEGORIES = [
    "simple_melee_weapons",
    "martial_melee_weapons",
    "simple_ranged_weapons",
    "martial_ranged_weapons",
] as const;
export type WeaponCategory = typeof WEAPON_CATEGORIES[number];

export const ARMOR_CATEGORIES = [
    "light_armor",
    "medium_armor",
    "heavy_armor",
] as const;
export type ArmorCategory = typeof ARMOR_CATEGORIES[number];

export const ITEM_RARITY = [
    "common",
    "uncommon",
    "rare",
    "very_rare",
    "legendary",
    "artifact",
] as const;
export type ItemRarity = typeof ITEM_RARITY[number];

export const CURRENCY_UNIT = [
    "copper",
    "silver",
    "electrum",
    "gold",
    "platinum",
] as const;
export type CurrencyUnit = typeof CURRENCY_UNIT[number];

export const EQUIP_SLOT = [
    "armor",
    "hand",
    "head",
    "neck",
    "back",
    "legs",
    "belt",
    "ring",
    "feet",
    "gloves",
    "ammunition",
    "left_hand",
    "right_hand",
    "two_handed",
] as const;
export type EquipSlot = typeof EQUIP_SLOT[number];


export const ITEM_BONUS_SELECTION = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
    "armor_class",
    "speed",
    "max_hp",
] as const;
export type ItemBonusSelection = typeof ITEM_BONUS_SELECTION[number];


