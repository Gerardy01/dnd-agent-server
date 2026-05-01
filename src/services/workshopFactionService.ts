import { Transaction } from "sequelize";

// models
import { WorkshopFaction } from "@/models";

// exceptions
import { DataNotFound } from "@/utils/exceptions";

// interfaces
import { CreateFactionDTO, UpdateFactionDTO, WorkshopFactionDataReturn } from "@/interfaces/IFaction";

export interface IWorkshopFactionService {
    getFactions(accountId: string): Promise<WorkshopFactionDataReturn[]>;
    getOneFaction(workshopFactionId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopFactionDataReturn>;
    createFaction(data: CreateFactionDTO, accountId: string, transaction?: Transaction): Promise<WorkshopFactionDataReturn>;
    editFaction(data: UpdateFactionDTO, accountId: string, transaction?: Transaction): Promise<WorkshopFactionDataReturn>;
    deleteFaction(workshopFactionId: number, accountId: string): Promise<void>;
    updateFactionImage(workshopFactionId: number, accountId: string, image: string): Promise<void>;
}

export class WorkshopFactionService implements IWorkshopFactionService {
    constructor() { }

    async getFactions(accountId: string): Promise<WorkshopFactionDataReturn[]> {
        const factions = await WorkshopFaction.findAll({
            where: { account_id: accountId },
            order: [['created_at', 'DESC']]
        });

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return factions.map(faction => ({
            workshopFactionId: faction.workshop_faction_id,
            accountId: faction.account_id,
            image: faction.image ? `${imageBaseUrl}/${faction.image}` : "",
            name: faction.name,
            description: faction.description,
            color: faction.color,
            createdAt: faction.createdAt,
        }));
    }

    async getOneFaction(workshopFactionId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopFactionDataReturn> {
        const faction = await WorkshopFaction.findOne({
            where: {
                workshop_faction_id: workshopFactionId,
                account_id: accountId
            }
        });

        if (!faction) {
            throw new DataNotFound("FACTION001");
        }

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";
        const image = imageKeyOnly ? faction.image : faction.image ? `${imageBaseUrl}/${faction.image}` : "";

        return {
            workshopFactionId: faction.workshop_faction_id,
            accountId: faction.account_id,
            image: image,
            name: faction.name,
            description: faction.description,
            color: faction.color,
            createdAt: faction.createdAt,
        };
    }

    async createFaction(data: CreateFactionDTO, accountId: string, transaction?: Transaction): Promise<WorkshopFactionDataReturn> {
        const newFaction = await WorkshopFaction.create({
            account_id: accountId,
            image: "",
            name: data.name,
            description: data.description,
            color: data.color,
        }, { transaction: transaction ?? null });

        return {
            workshopFactionId: newFaction.workshop_faction_id,
            accountId: newFaction.account_id,
            image: newFaction.image,
            name: newFaction.name,
            description: newFaction.description,
            color: newFaction.color,
            createdAt: newFaction.createdAt,
        };
    }

    async editFaction(data: UpdateFactionDTO, accountId: string, transaction?: Transaction): Promise<WorkshopFactionDataReturn> {
        const faction = await WorkshopFaction.findOne({
            where: {
                workshop_faction_id: data.workshopFactionId,
                account_id: accountId,
            }
        });

        if (!faction) {
            throw new DataNotFound("FACTION001");
        }

        await faction.update({
            image: data.isImageUpdated ? data.image : faction.image,
            name: data.name,
            description: data.description,
            color: data.color,
        }, { transaction: transaction ?? null });

        return {
            workshopFactionId: faction.workshop_faction_id,
            accountId: faction.account_id,
            image: faction.image,
            name: faction.name,
            description: faction.description,
            color: faction.color,
            createdAt: faction.createdAt,
        };
    }

    async deleteFaction(workshopFactionId: number, accountId: string): Promise<void> {
        const faction = await WorkshopFaction.findOne({
            where: {
                workshop_faction_id: workshopFactionId,
                account_id: accountId,
            }
        });

        if (!faction) {
            throw new DataNotFound("FACTION001");
        }

        await faction.destroy();
    }

    async updateFactionImage(workshopFactionId: number, accountId: string, image: string): Promise<void> {
        if (!image) return;

        const faction = await WorkshopFaction.findOne({
            where: {
                workshop_faction_id: workshopFactionId,
                account_id: accountId,
            }
        });

        if (!faction) {
            throw new DataNotFound("FACTION001");
        }

        await faction.update({
            image: image,
        });
    }
}
