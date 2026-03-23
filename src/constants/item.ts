


export const ITEM_TYPE = [
    "Gear",
    "Weapon",
    "Armor",
] as const;
export type ItemType = typeof ITEM_TYPE[number];

export const GEAR_CATEGORIES = [
    "Ammunition",
    "Consumable",
    "Adventuring Gear",
    "Arcane Foci",
    "Artisan's Tools",
    "Druidic Foci",
    "Equipment Packs",
    "Gaming Sets",
    "Holy Symbols",
    "Shield",
    "Kits",
    "Mounts and Vehicles",
    "Musical Instruments",
    "Other Tools",
    "Potion",
    "Ring",
    "Rod",
    "Scroll",
    "Staff",
    "Standard Gear",
    "Wand",
    "Wondrous Items",
    "Container",
    "Jewelry",
    "Food",
    "Clothing",
    "Accessory",
    "Map",
    "Miscellaneous"
] as const;
export type GearCategory = typeof GEAR_CATEGORIES[number];

export const WEAPON_CATEGORIES = [
    "Simple Melee Weapons",
    "Martial Melee Weapons",
    "Simple Ranged Weapons",
    "Martial Ranged Weapons",
] as const;
export type WeaponCategory = typeof WEAPON_CATEGORIES[number];

export const ARMOR_CATEGORIES = [
    "Light Armor",
    "Medium Armor",
    "Heavy Armor",
] as const;
export type ArmorCategory = typeof ARMOR_CATEGORIES[number];

export const ITEM_RARITY = [
    "Common",
    "Uncommon",
    "Rare",
    "Very Rare",
    "Legendary",
    "Artifact",
] as const;
export type ItemRarity = typeof ITEM_RARITY[number];

export const CURRENCY_UNIT = [
    "Copper",
    "Silver",
    "Electrum",
    "Gold",
    "Platinum",
] as const;
export type CurrencyUnit = typeof CURRENCY_UNIT[number];

export const EQUIP_SLOT = [
    "Armor",
    "Hand",
    "Head",
    "Neck",
    "Back",
    "Legs",
    "Belt",
    "Ring",
    "Feet",
    "Gloves",
    "Ammunition",
    "Left Hand",
    "Right Hand",
] as const;
export type EquipSlot = typeof EQUIP_SLOT[number];


export const ITEM_BONUS_SELECTION = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
    "Armor Class",
    "Speed",
    "Max HP",
] as const;
export type ItemBonusSelection = typeof ITEM_BONUS_SELECTION[number];


