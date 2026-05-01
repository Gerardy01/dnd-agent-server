


export type ItemOptionsReturn = {
    itemType: readonly string[];
    gearCategories: readonly string[];
    weaponCategories: readonly string[];
    armorCategories: readonly string[];
    itemRarity: readonly string[];
    currencyUnit: readonly string[];
    equipSlot: readonly string[];
    itemBonusSelection: readonly string[];
}

export type EffectOptionsReturn = {
    damageTypes: readonly string[];
    immunities: readonly string[];
}

export type FeatOptionsReturn = {
    featCategories: readonly string[];
}

export type SpellOptionsReturn = {
    spellSchools: readonly string[];
    savingThrowStats: readonly string[];
}
export type MonsterOptionsReturn = {
    monsterSize: readonly string[];
    monsterType: readonly string[];
    alignment: readonly string[];
    movementSelection: readonly string[];
    sensesSelection: readonly string[];
}
