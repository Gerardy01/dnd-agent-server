import { Transaction } from "sequelize";

// models
import { WorkshopSpell } from "@/models";

// exceptions
import { DataNotFound } from "@/utils/exceptions";

// interfaces
import { AttackProperties, CreateSpellDTO, SpellSaveProperties, UpdateSpellDTO, WorkshopSpellDataReturn } from "@/interfaces/ISpell";

export interface IWorkshopSpellService {
    getSpells(accountId: string): Promise<WorkshopSpellDataReturn[]>;
    getOneSpell(workshopSpellId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopSpellDataReturn>;
    createSpell(data: CreateSpellDTO, accountId: string, transaction?: Transaction): Promise<WorkshopSpellDataReturn>;
    editSpell(data: UpdateSpellDTO, accountId: string, transaction?: Transaction): Promise<WorkshopSpellDataReturn>;
    deleteSpell(workshopSpellId: number, accountId: string): Promise<void>;
    updateSpellImage(workshopSpellId: number, accountId: string, image: string): Promise<void>;
}

export class WorkshopSpellService implements IWorkshopSpellService {
    constructor() { }

    async getSpells(accountId: string): Promise<WorkshopSpellDataReturn[]> {
        const spells = await WorkshopSpell.findAll({
            where: { account_id: accountId },
            order: [['created_at', 'DESC']],
        });

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return spells.map(spell => ({
            workshopSpellId: spell.workshop_spell_id,
            accountId: spell.account_id,
            image: spell.image ? `${imageBaseUrl}/${spell.image}` : "",
            name: spell.name,
            description: spell.description,
            level: spell.level,
            range: spell.range,
            school: spell.school,
            attackProperties: spell.attack_properties as AttackProperties | null,
            spellSaveProperties: spell.spell_save_properties as SpellSaveProperties | null,
            createdAt: spell.createdAt,
        }));
    }

    async getOneSpell(workshopSpellId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopSpellDataReturn> {
        const spell = await WorkshopSpell.findOne({
            where: {
                workshop_spell_id: workshopSpellId,
                account_id: accountId,
            },
        });

        if (!spell) {
            throw new DataNotFound("SPELL001");
        }

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";
        const image = imageKeyOnly ? spell.image : spell.image ? `${imageBaseUrl}/${spell.image}` : "";

        return {
            workshopSpellId: spell.workshop_spell_id,
            accountId: spell.account_id,
            image: image,
            name: spell.name,
            description: spell.description,
            level: spell.level,
            range: spell.range,
            school: spell.school,
            attackProperties: spell.attack_properties as AttackProperties | null,
            spellSaveProperties: spell.spell_save_properties as SpellSaveProperties | null,
            createdAt: spell.createdAt,
        };
    }

    async createSpell(data: CreateSpellDTO, accountId: string, transaction?: Transaction): Promise<WorkshopSpellDataReturn> {
        const newSpell = await WorkshopSpell.create({
            account_id: accountId,
            image: "",
            name: data.name,
            description: data.description,
            level: data.level,
            range: data.range,
            school: data.school,
            attack_properties: data.attackProperties || null,
            spell_save_properties: data.spellSaveProperties || null,
        }, { transaction: transaction ?? null });

        return {
            workshopSpellId: newSpell.workshop_spell_id,
            accountId: newSpell.account_id,
            image: newSpell.image,
            name: newSpell.name,
            description: newSpell.description,
            level: newSpell.level,
            range: newSpell.range,
            school: newSpell.school,
            attackProperties: newSpell.attack_properties as AttackProperties | null,
            spellSaveProperties: newSpell.spell_save_properties as SpellSaveProperties | null,
            createdAt: newSpell.createdAt,
        };
    }

    async editSpell(data: UpdateSpellDTO, accountId: string, transaction?: Transaction): Promise<WorkshopSpellDataReturn> {
        const spell = await WorkshopSpell.findOne({
            where: {
                workshop_spell_id: data.workshopSpellId,
                account_id: accountId,
            },
        });

        if (!spell) {
            throw new DataNotFound("SPELL001");
        }

        await spell.update({
            image: data.isImageUpdated ? data.image : spell.image,
            name: data.name,
            description: data.description,
            level: data.level,
            range: data.range,
            school: data.school,
            attack_properties: data.attackProperties ?? null,
            spell_save_properties: data.spellSaveProperties ?? null,
        }, { transaction: transaction ?? null });

        return {
            workshopSpellId: spell.workshop_spell_id,
            accountId: spell.account_id,
            image: spell.image,
            name: spell.name,
            description: spell.description,
            level: spell.level,
            range: spell.range,
            school: spell.school,
            attackProperties: spell.attack_properties as AttackProperties | null,
            spellSaveProperties: spell.spell_save_properties as SpellSaveProperties | null,
            createdAt: spell.createdAt,
        };
    }

    async deleteSpell(workshopSpellId: number, accountId: string): Promise<void> {
        const spell = await WorkshopSpell.findOne({
            where: {
                workshop_spell_id: workshopSpellId,
                account_id: accountId,
            },
        });

        if (!spell) {
            throw new DataNotFound("SPELL001");
        }

        await spell.destroy();
    }

    async updateSpellImage(workshopSpellId: number, accountId: string, image: string): Promise<void> {
        if (!image) return;

        const spell = await WorkshopSpell.findOne({
            where: {
                workshop_spell_id: workshopSpellId,
                account_id: accountId,
            },
        });

        if (!spell) {
            throw new DataNotFound("SPELL001");
        }

        await spell.update({ image });
    }
}
