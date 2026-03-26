
// constants
import {
    ITEM_TYPE,
    GEAR_CATEGORIES,
    WEAPON_CATEGORIES,
    ARMOR_CATEGORIES,
    ITEM_RARITY,
    CURRENCY_UNIT,
    EQUIP_SLOT,
    ITEM_BONUS_SELECTION
} from '@/constants/item';
import {
    DAMAGE_TYPES,
    IMMUNITIES
} from '@/constants/effect';

// interfaces
import { ItemOptionsReturn, EffectOptionsReturn } from '@/interfaces/IReference';
export interface IReferenceService {
    getItemOptions(): Promise<ItemOptionsReturn>;
    getEffectOptions(): Promise<EffectOptionsReturn>;
}

export class ReferenceService implements IReferenceService {
    constructor() { }

    async getItemOptions(): Promise<ItemOptionsReturn> {
        return {
            itemType: ITEM_TYPE,
            gearCategories: GEAR_CATEGORIES,
            weaponCategories: WEAPON_CATEGORIES,
            armorCategories: ARMOR_CATEGORIES,
            itemRarity: ITEM_RARITY,
            currencyUnit: CURRENCY_UNIT,
            equipSlot: EQUIP_SLOT,
            itemBonusSelection: ITEM_BONUS_SELECTION,
        };
    }

    async getEffectOptions(): Promise<EffectOptionsReturn> {
        return {
            damageTypes: DAMAGE_TYPES,
            immunities: IMMUNITIES,
        };
    }
}
