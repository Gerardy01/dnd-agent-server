
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
import {
    FEAT_CATEGORY
} from '@/constants/feat';
import {
    SPELL_SCHOOL,
    SAVING_THROW_STAT
} from '@/constants/spell';
import {
    MONSTER_SIZE,
    MONSTER_TYPE,
    ALIGNMENT,
    MOVEMENT_SELECTION,
    SENSES_SELECTION
} from '@/constants/monster';
import {
    SPELLCASTING_ABILITY_SELECTION,
    SPELL_PREPARATION_TYPE,
    SPELLCASTING_TYPE,
    CLASS_FEATURE_TYPE,
    RESOURCE_RECOVERY_TYPE,
} from '@/constants/class';
import {
    DICE_SELECTION
} from '@/constants/dice';

// interfaces
import {
    ItemOptionsReturn,
    EffectOptionsReturn,
    FeatOptionsReturn,
    SpellOptionsReturn,
    MonsterOptionsReturn,
    ClassOptionsReturn
} from '@/interfaces/IReference';
export interface IReferenceService {
    getItemOptions(): Promise<ItemOptionsReturn>;
    getEffectOptions(): Promise<EffectOptionsReturn>;
    getFeatOptions(): Promise<FeatOptionsReturn>;
    getSpellOptions(): Promise<SpellOptionsReturn>;
    getMonsterOptions(): Promise<MonsterOptionsReturn>;
    getClassOptions(): Promise<ClassOptionsReturn>;
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

    async getFeatOptions(): Promise<FeatOptionsReturn> {
        return {
            featCategories: FEAT_CATEGORY,
        };
    }

    async getSpellOptions(): Promise<SpellOptionsReturn> {
        return {
            spellSchools: SPELL_SCHOOL,
            savingThrowStats: SAVING_THROW_STAT,
        };
    }

    async getMonsterOptions(): Promise<MonsterOptionsReturn> {
        return {
            monsterSize: MONSTER_SIZE,
            monsterType: MONSTER_TYPE,
            alignment: ALIGNMENT,
            movementSelection: MOVEMENT_SELECTION,
            sensesSelection: SENSES_SELECTION,
        };
    }

    async getClassOptions(): Promise<ClassOptionsReturn> {
        return {
            spellcastingAbility: SPELLCASTING_ABILITY_SELECTION,
            spellPreparationType: SPELL_PREPARATION_TYPE,
            spellcastingType: SPELLCASTING_TYPE,
            diceSelection: DICE_SELECTION,
            classFeatureType: CLASS_FEATURE_TYPE,
            resourceRecoveryType: RESOURCE_RECOVERY_TYPE,
        };
    }
}
