import { Transaction } from "sequelize";

// models
import WorkshopItem from "@/models/workshopItem.model";

// exceptions
import { WrongFormat, DataNotFound } from "@/utils/exceptions";

// constants
import { WEAPON_CATEGORIES, ARMOR_CATEGORIES, GEAR_CATEGORIES } from "@/constants/item";

// utils
import { EquipSlotEnum, ItemTypeEnum } from "@/utils/enums";

// interfaces
import { CreateItemDTO, UpdateItemDTO, WorkshopItemDataReturn } from "@/interfaces/IItem";
export interface IWorkshopItemService {
    getItems(accountId: string): Promise<WorkshopItemDataReturn[]>;
    getOneItem(workshopItemId: number, accountId: string): Promise<WorkshopItemDataReturn>;
    createItem(data: CreateItemDTO, accountId: string, transaction?: Transaction): Promise<WorkshopItemDataReturn>;
    editItem(data: UpdateItemDTO, accountId: string): Promise<WorkshopItemDataReturn>;
    deleteItem(workshopItemId: number, accountId: string): Promise<void>;
    updateItemImage(workshopItemId: number, accountId: string, image: string): Promise<void>;
}



export class WorkshopItemService implements IWorkshopItemService {
    constructor() { }

    async getItems(accountId: string): Promise<WorkshopItemDataReturn[]> {
        const items = await WorkshopItem.findAll({
            where: { account_id: accountId },
            order: [['created_at', 'DESC']]
        });

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return items.map(item => ({
            workshopItemId: item.workshop_item_id,
            accountId: item.account_id,
            image: item.image ? `${imageBaseUrl}/${item.image}` : "",
            name: item.name,
            type: item.type,
            description: item.description,
            appearance: item.appearance,
            category: item.category,
            rarity: item.rarity,
            isMagicItem: item.is_magic_item,
            weight: item.weight,
            cost: item.cost,
            currencyUnit: item.currency_unit,
            equipSlot: item.equip_slot,
            weaponProperties: item.weapon_properties,
            armorProperties: item.armor_properties,
            additionalProperties: item.additional_properties,
            flatBonus: item.flat_bonus,
            overrideBonus: item.override_bonus,
            modifierBonus: item.modifier_bonus,
            createdAt: item.createdAt,
        }));
    }

    async getOneItem(workshopItemId: number, accountId: string): Promise<WorkshopItemDataReturn> {
        const item = await WorkshopItem.findOne({
            where: {
                workshop_item_id: workshopItemId,
                account_id: accountId
            }
        });

        if (!item) {
            throw new DataNotFound("ITEM001");
        }

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return {
            workshopItemId: item.workshop_item_id,
            accountId: item.account_id,
            image: item.image ? `${imageBaseUrl}/${item.image}` : "",
            name: item.name,
            type: item.type,
            description: item.description,
            appearance: item.appearance,
            category: item.category,
            rarity: item.rarity,
            isMagicItem: item.is_magic_item,
            weight: item.weight,
            cost: item.cost,
            currencyUnit: item.currency_unit,
            equipSlot: item.equip_slot,
            weaponProperties: item.weapon_properties,
            armorProperties: item.armor_properties,
            additionalProperties: item.additional_properties,
            flatBonus: item.flat_bonus,
            overrideBonus: item.override_bonus,
            modifierBonus: item.modifier_bonus,
            createdAt: item.createdAt,
        };
    }

    async createItem(data: CreateItemDTO, accountId: string, transaction?: Transaction): Promise<WorkshopItemDataReturn> {

        if (data.type === ItemTypeEnum.WEAPON) {
            if (!data.weaponProperties) {
                throw new WrongFormat("weaponProperties must not be null when type is Weapon");
            }

            if (data.weaponProperties.damageRoll.length < 1) {
                throw new WrongFormat("damageRoll must have at least 1 item when type is Weapon");
            }

            if (!WEAPON_CATEGORIES.includes(data.category as any)) {
                throw new WrongFormat("category must be a valid weapon category");
            }
        }

        if (data.type === ItemTypeEnum.ARMOR) {
            if (!data.armorProperties) {
                throw new WrongFormat("armorProperties must not be null when type is Armor");
            }

            if (data.armorProperties.baseAc === 0) {
                throw new WrongFormat("baseAc cannot be 0 when type is Armor");
            }

            if (!ARMOR_CATEGORIES.includes(data.category as any)) {
                throw new WrongFormat("category must be a valid armor category");
            }
        }

        if (data.type === ItemTypeEnum.GEAR) {
            if (data.weaponProperties !== null && data.weaponProperties !== undefined) {
                throw new WrongFormat("weaponProperties must be null when type is Gear");
            }

            if (data.armorProperties !== null && data.armorProperties !== undefined) {
                throw new WrongFormat("armorProperties must be null when type is Gear");
            }

            if (!GEAR_CATEGORIES.includes(data.category as any)) {
                throw new WrongFormat("category must be a valid gear category");
            }
        }

        let equipSlot = data.equipSlot || null;

        if (data.type === ItemTypeEnum.ARMOR) {
            equipSlot = EquipSlotEnum.ARMOR;
        }

        if (data.type === ItemTypeEnum.WEAPON) {
            equipSlot = data.weaponProperties?.twoHanded ? EquipSlotEnum.TWO_HAND : EquipSlotEnum.HAND;
        }

        const newItem = await WorkshopItem.create({
            account_id: accountId,
            image: "",
            name: data.name,
            type: data.type,
            description: data.description,
            appearance: data.appearance,
            category: data.category,
            rarity: data.rarity,
            is_magic_item: data.isMagicItem,
            weight: data.weight,
            cost: data.cost,
            currency_unit: data.currencyUnit,
            equip_slot: equipSlot,
            weapon_properties: data.weaponProperties || null,
            armor_properties: data.armorProperties || null,
            additional_properties: data.additionalProperties || {
                immunities: [],
                resistances: [],
                vulnerabilities: [],
                conditionImmunities: [],
            },
            flat_bonus: data.flatBonus || null,
            override_bonus: data.overrideBonus || null,
            modifier_bonus: data.modifierBonus || null,
        }, { transaction: transaction ?? null });

        return {
            workshopItemId: newItem.workshop_item_id,
            accountId: newItem.account_id,
            image: newItem.image,
            name: newItem.name,
            type: newItem.type,
            description: newItem.description,
            appearance: newItem.appearance,
            category: newItem.category,
            rarity: newItem.rarity,
            isMagicItem: newItem.is_magic_item,
            weight: newItem.weight,
            cost: newItem.cost,
            currencyUnit: newItem.currency_unit,
            equipSlot: newItem.equip_slot,
            weaponProperties: newItem.weapon_properties,
            armorProperties: newItem.armor_properties,
            additionalProperties: newItem.additional_properties,
            flatBonus: newItem.flat_bonus,
            overrideBonus: newItem.override_bonus,
            modifierBonus: newItem.modifier_bonus,
            createdAt: newItem.createdAt,
        }
    }

    async editItem(data: UpdateItemDTO, accountId: string): Promise<WorkshopItemDataReturn> {
        const item = await WorkshopItem.findOne({
            where: {
                workshop_item_id: data.workshopItemId,
                account_id: accountId,
            }
        });

        if (!item) {
            throw new DataNotFound("ITEM001");
        }

        if (data.type === 'Weapon') {
            if (!data.weaponProperties) {
                throw new WrongFormat("weaponProperties must not be null when type is Weapon");
            }
            if (data.weaponProperties.damageRoll.length < 1) {
                throw new WrongFormat("damageRoll must have at least 1 item when type is Weapon");
            }
            if (!WEAPON_CATEGORIES.includes(data.category as any)) {
                throw new WrongFormat("category must be a valid weapon category");
            }
        }

        if (data.type === 'Armor') {
            if (!data.armorProperties) {
                throw new WrongFormat("armorProperties must not be null when type is Armor");
            }
            if (data.armorProperties.baseAc === 0) {
                throw new WrongFormat("baseAc cannot be 0 when type is Armor");
            }
            if (!ARMOR_CATEGORIES.includes(data.category as any)) {
                throw new WrongFormat("category must be a valid armor category");
            }
        }

        if (data.type === 'Gear') {
            if (data.weaponProperties !== null && data.weaponProperties !== undefined) {
                throw new WrongFormat("weaponProperties must be null when type is Gear");
            }
            if (data.armorProperties !== null && data.armorProperties !== undefined) {
                throw new WrongFormat("armorProperties must be null when type is Gear");
            }
            if (!GEAR_CATEGORIES.includes(data.category as any)) {
                throw new WrongFormat("category must be a valid gear category");
            }
        }

        let equipSlot = data.equipSlot || null;

        if (data.type === ItemTypeEnum.ARMOR) {
            equipSlot = EquipSlotEnum.ARMOR;
        }

        if (data.type === ItemTypeEnum.WEAPON) {
            equipSlot = data.weaponProperties?.twoHanded ? EquipSlotEnum.TWO_HAND : EquipSlotEnum.HAND;
        }

        await item.update({
            image: data.image ?? item.image,
            name: data.name,
            type: data.type,
            description: data.description,
            appearance: data.appearance,
            category: data.category,
            rarity: data.rarity,
            is_magic_item: data.isMagicItem,
            weight: data.weight,
            cost: data.cost,
            currency_unit: data.currencyUnit,
            equip_slot: equipSlot,
            weapon_properties: data.weaponProperties ?? null,
            armor_properties: data.armorProperties ?? null,
            additional_properties: data.additionalProperties ?? {
                immunities: [],
                resistances: [],
                vulnerabilities: [],
                conditionImmunities: [],
            },
            flat_bonus: data.flatBonus ?? null,
            override_bonus: data.overrideBonus ?? null,
            modifier_bonus: data.modifierBonus ?? null,
        });

        return {
            workshopItemId: item.workshop_item_id,
            accountId: item.account_id,
            image: item.image,
            name: item.name,
            type: item.type,
            description: item.description,
            appearance: item.appearance,
            category: item.category,
            rarity: item.rarity,
            isMagicItem: item.is_magic_item,
            weight: item.weight,
            cost: item.cost,
            currencyUnit: item.currency_unit,
            equipSlot: item.equip_slot,
            weaponProperties: item.weapon_properties,
            armorProperties: item.armor_properties,
            additionalProperties: item.additional_properties,
            flatBonus: item.flat_bonus,
            overrideBonus: item.override_bonus,
            modifierBonus: item.modifier_bonus,
            createdAt: item.createdAt,
        };
    }

    async deleteItem(workshopItemId: number, accountId: string): Promise<void> {
        const item = await WorkshopItem.findOne({
            where: {
                workshop_item_id: workshopItemId,
                account_id: accountId,
            }
        });

        if (!item) {
            throw new DataNotFound("ITEM001");
        }

        await item.destroy();
    }

    async updateItemImage(workshopItemId: number, accountId: string, image: string): Promise<void> {
        if (!image) return;

        console.log("accountId", accountId, "workshopItemId", workshopItemId, "image", image);

        const item = await WorkshopItem.findOne({
            where: {
                workshop_item_id: workshopItemId,
                account_id: accountId,
            }
        });

        if (!item) {
            throw new DataNotFound("ITEM001");
        }

        await item.update({
            image: image,
        });
    }
}
