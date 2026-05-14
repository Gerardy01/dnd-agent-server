import { Transaction } from "sequelize";

// models
import { WorkshopRace, WorkshopRaceSpell } from "@/models";

// exceptions
import { DataNotFound } from "@/utils/exceptions";

// interfaces
import { CreateRaceDTO, UpdateRaceDTO, WorkshopRaceDataReturn, AddTraitsPayload, EditTraitsPayload, DeleteTraitsPayload } from "@/interfaces/IRace";

export interface IWorkshopRaceService {
    getRaces(accountId: string): Promise<WorkshopRaceDataReturn[]>;
    getOneRace(workshopRaceId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopRaceDataReturn>;

    getRaceSpellIds(workshopRaceId: number): Promise<number[]>;
    createRace(data: CreateRaceDTO, accountId: string, transaction?: Transaction): Promise<WorkshopRaceDataReturn>;

    createRaceSpell(spellIds: number[], workshopRaceId: number, transaction?: Transaction): Promise<void>;
    editRace(data: UpdateRaceDTO, accountId: string, transaction?: Transaction): Promise<WorkshopRaceDataReturn>;

    deleteRaceSpells(workshopRaceId: number, transaction?: Transaction): Promise<void>;
    deleteRace(workshopRaceId: number, accountId: string, transaction?: Transaction): Promise<void>;
    updateRaceImage(workshopRaceId: number, accountId: string, image: string): Promise<void>;

    addTrait(data: AddTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn>;
    editTrait(data: EditTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn>;
    deleteTrait(data: DeleteTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn>;

}

export class WorkshopRaceService implements IWorkshopRaceService {
    constructor() { }

    async getRaces(accountId: string): Promise<WorkshopRaceDataReturn[]> {
        const races = await WorkshopRace.findAll({
            where: { account_id: accountId },
            order: [['created_at', 'DESC']]
        });

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return races.map(r => ({
            workshopRaceId: r.workshop_race_id,
            accountId: r.account_id,
            image: r.image ? `${imageBaseUrl}/${r.image}` : "",
            name: r.name,
            description: r.description,
            speed: r.speed,
            language: r.language,
            spellcastingProperties: r.spellcasting_properties,
            traits: r.traits,
            createdAt: r.createdAt,
        }));
    }

    async getOneRace(workshopRaceId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopRaceDataReturn> {
        const r = await WorkshopRace.findOne({
            where: {
                workshop_race_id: workshopRaceId,
                account_id: accountId
            }
        });

        if (!r) {
            throw new DataNotFound("RACE001");
        }

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";
        const image = imageKeyOnly ? r.image : r.image ? `${imageBaseUrl}/${r.image}` : "";

        return {
            workshopRaceId: r.workshop_race_id,
            accountId: r.account_id,
            image: image,
            name: r.name,
            description: r.description,
            speed: r.speed,
            language: r.language,
            spellcastingProperties: r.spellcasting_properties,
            traits: r.traits,
            createdAt: r.createdAt,
        };
    }


    async getRaceSpellIds(workshopRaceId: number): Promise<number[]> {
        const spells = await WorkshopRaceSpell.findAll({
            where: { workshop_race_id: workshopRaceId }
        });

        return spells.map(s => s.workshop_spell_id);
    }

    async createRace(data: CreateRaceDTO, accountId: string, transaction?: Transaction): Promise<WorkshopRaceDataReturn> {
        const newRace = await WorkshopRace.create({
            account_id: accountId,
            image: "",
            name: data.name,
            description: data.description,
            speed: data.speed,
            language: data.language,
            spellcasting_properties: data.spellcastingProperties,
            traits: data.traits || [],
        }, { transaction: transaction ?? null });

        return {
            workshopRaceId: newRace.workshop_race_id,
            accountId: newRace.account_id,
            image: newRace.image,
            name: newRace.name,
            description: newRace.description,
            speed: newRace.speed,
            language: newRace.language,
            spellcastingProperties: newRace.spellcasting_properties,
            traits: newRace.traits,
            createdAt: newRace.createdAt,
        };
    }


    async createRaceSpell(spellIds: number[], workshopRaceId: number, transaction?: Transaction): Promise<void> {
        const uniqueSpellIds = [...new Set(spellIds)];
        const spellsToCreate = uniqueSpellIds.map(spellId => ({
            workshop_race_id: workshopRaceId,
            workshop_spell_id: spellId,
        }));

        await WorkshopRaceSpell.bulkCreate(spellsToCreate, { transaction: transaction ?? null });
    }

    async editRace(data: UpdateRaceDTO, accountId: string, transaction?: Transaction): Promise<WorkshopRaceDataReturn> {
        const workshopRace = await WorkshopRace.findOne({
            where: {
                workshop_race_id: data.workshopRaceId,
                account_id: accountId,
            }
        });

        if (!workshopRace) {
            throw new DataNotFound("RACE001");
        }

        await workshopRace.update({
            image: data.isImageUpdated ? data.image : workshopRace.image,
            name: data.name,
            description: data.description,
            speed: data.speed,
            language: data.language,
            spellcasting_properties: data.spellcastingProperties,
            traits: data.traits || [],
        }, { transaction: transaction ?? null });

        return {
            workshopRaceId: workshopRace.workshop_race_id,
            accountId: workshopRace.account_id,
            image: workshopRace.image,
            name: workshopRace.name,
            description: workshopRace.description,
            speed: workshopRace.speed,
            language: workshopRace.language,
            spellcastingProperties: workshopRace.spellcasting_properties,
            traits: workshopRace.traits,
            createdAt: workshopRace.createdAt,
        };
    }


    async deleteRaceSpells(workshopRaceId: number, transaction?: Transaction): Promise<void> {
        await WorkshopRaceSpell.destroy({
            where: { workshop_race_id: workshopRaceId },
            transaction: transaction ?? null
        });
    }

    async deleteRace(workshopRaceId: number, accountId: string, transaction?: Transaction): Promise<void> {
        const workshopRace = await WorkshopRace.findOne({
            where: {
                workshop_race_id: workshopRaceId,
                account_id: accountId,
            }
        });

        if (!workshopRace) {
            throw new DataNotFound("RACE001");
        }

        await workshopRace.destroy({ transaction: transaction ?? null });
    }

    async updateRaceImage(workshopRaceId: number, accountId: string, image: string): Promise<void> {
        if (!image) return;

        const workshopRace = await WorkshopRace.findOne({
            where: {
                workshop_race_id: workshopRaceId,
                account_id: accountId,
            }
        });

        if (!workshopRace) {
            throw new DataNotFound("RACE001");
        }

        await workshopRace.update({ image });
    }


    async addTrait(data: AddTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn> {
        const workshopRace = await WorkshopRace.findOne({
            where: {
                workshop_race_id: data.workshopRaceId,
                account_id: accountId,
            }
        });

        if (!workshopRace) {
            throw new DataNotFound("RACE001");
        }

        const traits = [...workshopRace.traits, data.trait];

        const updated = await workshopRace.update({ traits });

        return {
            workshopRaceId: updated.workshop_race_id,
            accountId: updated.account_id,
            image: updated.image,
            name: updated.name,
            description: updated.description,
            speed: updated.speed,
            language: updated.language,
            spellcastingProperties: updated.spellcasting_properties,
            traits: updated.traits,
            createdAt: updated.createdAt,
        };
    }

    async editTrait(data: EditTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn> {
        const workshopRace = await WorkshopRace.findOne({
            where: {
                workshop_race_id: data.workshopRaceId,
                account_id: accountId,
            }
        });

        if (!workshopRace) {
            throw new DataNotFound("RACE001");
        }

        const traits = [...workshopRace.traits];
        const index = traits.findIndex(t =>
            t.name === data.currentTrait.name &&
            t.description === data.currentTrait.description &&
            t.type === data.currentTrait.type
        );

        if (index !== -1) {
            traits[index] = data.newTrait;
        }

        const updated = await workshopRace.update({ traits });

        return {
            workshopRaceId: updated.workshop_race_id,
            accountId: updated.account_id,
            image: updated.image,
            name: updated.name,
            description: updated.description,
            speed: updated.speed,
            language: updated.language,
            spellcastingProperties: updated.spellcasting_properties,
            traits: updated.traits,
            createdAt: updated.createdAt,
        };
    }

    async deleteTrait(data: DeleteTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn> {
        const workshopRace = await WorkshopRace.findOne({
            where: {
                workshop_race_id: data.workshopRaceId,
                account_id: accountId,
            }
        });

        if (!workshopRace) {
            throw new DataNotFound("RACE001");
        }

        const traits = [...workshopRace.traits];
        const index = traits.findIndex(t =>
            t.name === data.trait.name &&
            t.description === data.trait.description &&
            t.type === data.trait.type
        );

        if (index !== -1) {
            traits.splice(index, 1);
        }

        const updated = await workshopRace.update({ traits });

        return {
            workshopRaceId: updated.workshop_race_id,
            accountId: updated.account_id,
            image: updated.image,
            name: updated.name,
            description: updated.description,
            speed: updated.speed,
            language: updated.language,
            spellcastingProperties: updated.spellcasting_properties,
            traits: updated.traits,
            createdAt: updated.createdAt,
        };
    }


}
