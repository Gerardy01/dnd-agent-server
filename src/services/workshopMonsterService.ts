import { Transaction } from "sequelize";

// models
import { WorkshopMonster } from "@/models";

// exceptions
import { DataNotFound } from "@/utils/exceptions";

// interfaces
import { CreateMonsterDTO, UpdateMonsterDTO, WorkshopMonsterDataReturn } from "@/interfaces/IMonster";

export interface IWorkshopMonsterService {
    getMonsters(accountId: string): Promise<WorkshopMonsterDataReturn[]>;
    getOneMonster(workshopMonsterId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopMonsterDataReturn>;
    createMonster(data: CreateMonsterDTO, accountId: string, transaction?: Transaction): Promise<WorkshopMonsterDataReturn>;
    editMonster(data: UpdateMonsterDTO, accountId: string, transaction?: Transaction): Promise<WorkshopMonsterDataReturn>;
    deleteMonster(workshopMonsterId: number, accountId: string): Promise<void>;
    updateMonsterImage(workshopMonsterId: number, accountId: string, image: string): Promise<void>;
}

export class WorkshopMonsterService implements IWorkshopMonsterService {
    constructor() { }

    async getMonsters(accountId: string): Promise<WorkshopMonsterDataReturn[]> {
        const monsters = await WorkshopMonster.findAll({
            where: { account_id: accountId },
            order: [['created_at', 'DESC']]
        });

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return monsters.map(monster => ({
            workshopMonsterId: monster.workshop_monster_id,
            accountId: monster.account_id,
            image: monster.image ? `${imageBaseUrl}/${monster.image}` : "",
            name: monster.name,
            alignment: monster.alignment,
            size: monster.size,
            type: monster.type,
            description: monster.description,
            appearance: monster.appearance,
            languages: monster.languages,
            speed: monster.speed,
            senses: monster.senses,
            stats: monster.stats,
            additionalProperties: monster.additional_properties,
            actions: monster.actions,
            createdAt: monster.createdAt,
        }));
    }

    async getOneMonster(workshopMonsterId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopMonsterDataReturn> {
        const monster = await WorkshopMonster.findOne({
            where: {
                workshop_monster_id: workshopMonsterId,
                account_id: accountId
            }
        });

        if (!monster) {
            throw new DataNotFound("MONSTER001");
        }

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";
        const image = imageKeyOnly ? monster.image : monster.image ? `${imageBaseUrl}/${monster.image}` : "";

        return {
            workshopMonsterId: monster.workshop_monster_id,
            accountId: monster.account_id,
            image: image,
            name: monster.name,
            alignment: monster.alignment,
            size: monster.size,
            type: monster.type,
            description: monster.description,
            appearance: monster.appearance,
            languages: monster.languages,
            speed: monster.speed,
            senses: monster.senses,
            stats: monster.stats,
            additionalProperties: monster.additional_properties,
            actions: monster.actions,
            createdAt: monster.createdAt,
        };
    }

    async createMonster(data: CreateMonsterDTO, accountId: string, transaction?: Transaction): Promise<WorkshopMonsterDataReturn> {
        const newMonster = await WorkshopMonster.create({
            account_id: accountId,
            image: "",
            name: data.name,
            alignment: data.alignment,
            size: data.size,
            type: data.type,
            description: data.description,
            appearance: data.appearance,
            languages: data.languages || null,
            speed: data.speed,
            senses: data.senses,
            stats: {
                minHp: data.stats.minHp,
                maxHp: data.stats.maxHp,
                ac: data.stats.ac,
                cr: data.stats.cr,
                str: data.stats.str,
                dex: data.stats.dex,
                con: data.stats.con,
                int: data.stats.int,
                wis: data.stats.wis,
                cha: data.stats.cha,
            },
            additional_properties: data.additionalProperties || {
                immunities: [],
                resistances: [],
                vulnerabilities: [],
                conditionImmunities: [],
            },
            actions: data.actions || [],
        }, { transaction: transaction ?? null });

        return {
            workshopMonsterId: newMonster.workshop_monster_id,
            accountId: newMonster.account_id,
            image: newMonster.image,
            name: newMonster.name,
            alignment: newMonster.alignment,
            size: newMonster.size,
            type: newMonster.type,
            description: newMonster.description,
            appearance: newMonster.appearance,
            languages: newMonster.languages,
            speed: newMonster.speed,
            senses: newMonster.senses,
            stats: newMonster.stats,
            additionalProperties: newMonster.additional_properties,
            actions: newMonster.actions,
            createdAt: newMonster.createdAt,
        };
    }

    async editMonster(data: UpdateMonsterDTO, accountId: string, transaction?: Transaction): Promise<WorkshopMonsterDataReturn> {
        const monster = await WorkshopMonster.findOne({
            where: {
                workshop_monster_id: data.workshopMonsterId,
                account_id: accountId,
            }
        });

        if (!monster) {
            throw new DataNotFound("MONSTER001");
        }

        await monster.update({
            image: data.isImageUpdated ? data.image : monster.image,
            name: data.name,
            alignment: data.alignment,
            size: data.size,
            type: data.type,
            description: data.description,
            appearance: data.appearance,
            languages: data.languages || null,
            speed: data.speed,
            senses: data.senses,
            stats: {
                minHp: data.stats.minHp,
                maxHp: data.stats.maxHp,
                ac: data.stats.ac,
                cr: data.stats.cr,
                str: data.stats.str,
                dex: data.stats.dex,
                con: data.stats.con,
                int: data.stats.int,
                wis: data.stats.wis,
                cha: data.stats.cha,
            },
            additional_properties: data.additionalProperties || {
                immunities: [],
                resistances: [],
                vulnerabilities: [],
                conditionImmunities: [],
            },
            actions: data.actions || [],
        }, { transaction: transaction ?? null });

        return {
            workshopMonsterId: monster.workshop_monster_id,
            accountId: monster.account_id,
            image: monster.image,
            name: monster.name,
            alignment: monster.alignment,
            size: monster.size,
            type: monster.type,
            description: monster.description,
            appearance: monster.appearance,
            languages: monster.languages,
            speed: monster.speed,
            senses: monster.senses,
            stats: monster.stats,
            additionalProperties: monster.additional_properties,
            actions: monster.actions,
            createdAt: monster.createdAt,
        };
    }

    async deleteMonster(workshopMonsterId: number, accountId: string): Promise<void> {
        const monster = await WorkshopMonster.findOne({
            where: {
                workshop_monster_id: workshopMonsterId,
                account_id: accountId,
            }
        });

        if (!monster) {
            throw new DataNotFound("MONSTER001");
        }

        await monster.destroy();
    }

    async updateMonsterImage(workshopMonsterId: number, accountId: string, image: string): Promise<void> {
        if (!image) return;

        const monster = await WorkshopMonster.findOne({
            where: {
                workshop_monster_id: workshopMonsterId,
                account_id: accountId,
            }
        });

        if (!monster) {
            throw new DataNotFound("MONSTER001");
        }

        await monster.update({
            image: image,
        });
    }
}
