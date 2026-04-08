import { Transaction } from "sequelize";

// models
import { WorkshopFeat } from "@/models";

// exceptions
import { DataNotFound } from "@/utils/exceptions";

// interfaces
import { CreateFeatDTO, UpdateFeatDTO, WorkshopFeatDataReturn } from "@/interfaces/IFeat";

export interface IWorkshopFeatService {
    getFeats(accountId: string): Promise<WorkshopFeatDataReturn[]>;
    getOneFeat(workshopFeatId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopFeatDataReturn>;
    createFeat(data: CreateFeatDTO, accountId: string, transaction?: Transaction): Promise<WorkshopFeatDataReturn>;
    editFeat(data: UpdateFeatDTO, accountId: string, transaction?: Transaction): Promise<WorkshopFeatDataReturn>;
    deleteFeat(workshopFeatId: number, accountId: string): Promise<void>;
    updateFeatImage(workshopFeatId: number, accountId: string, image: string): Promise<void>;
}

export class WorkshopFeatService implements IWorkshopFeatService {
    constructor() { }

    async getFeats(accountId: string): Promise<WorkshopFeatDataReturn[]> {
        const feats = await WorkshopFeat.findAll({
            where: { account_id: accountId },
            order: [['created_at', 'DESC']]
        });

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return feats.map(feat => ({
            workshopFeatId: feat.workshop_feat_id,
            accountId: feat.account_id,
            image: feat.image ? `${imageBaseUrl}/${feat.image}` : "",
            name: feat.name,
            description: feat.description,
            category: feat.category,
            minLevel: feat.min_level,
            createdAt: feat.createdAt,
        }));
    }

    async getOneFeat(workshopFeatId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopFeatDataReturn> {
        const feat = await WorkshopFeat.findOne({
            where: {
                workshop_feat_id: workshopFeatId,
                account_id: accountId
            }
        });

        if (!feat) {
            throw new DataNotFound("FEAT001");
        }

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";
        const image = imageKeyOnly ? feat.image : feat.image ? `${imageBaseUrl}/${feat.image}` : "";

        return {
            workshopFeatId: feat.workshop_feat_id,
            accountId: feat.account_id,
            image: image,
            name: feat.name,
            description: feat.description,
            category: feat.category,
            minLevel: feat.min_level,
            createdAt: feat.createdAt,
        };
    }

    async createFeat(data: CreateFeatDTO, accountId: string, transaction?: Transaction): Promise<WorkshopFeatDataReturn> {
        const newFeat = await WorkshopFeat.create({
            account_id: accountId,
            image: "",
            name: data.name,
            description: data.description,
            category: data.category,
            min_level: data.minLevel,
        }, { transaction: transaction ?? null });

        return {
            workshopFeatId: newFeat.workshop_feat_id,
            accountId: newFeat.account_id,
            image: newFeat.image,
            name: newFeat.name,
            description: newFeat.description,
            category: newFeat.category,
            minLevel: newFeat.min_level,
            createdAt: newFeat.createdAt,
        };
    }

    async editFeat(data: UpdateFeatDTO, accountId: string, transaction?: Transaction): Promise<WorkshopFeatDataReturn> {
        const feat = await WorkshopFeat.findOne({
            where: {
                workshop_feat_id: data.workshopFeatId,
                account_id: accountId,
            }
        });

        if (!feat) {
            throw new DataNotFound("FEAT001");
        }

        await feat.update({
            image: data.isImageUpdated ? data.image : feat.image,
            name: data.name,
            description: data.description,
            category: data.category,
            min_level: data.minLevel,
        }, { transaction: transaction ?? null });

        return {
            workshopFeatId: feat.workshop_feat_id,
            accountId: feat.account_id,
            image: feat.image,
            name: feat.name,
            description: feat.description,
            category: feat.category,
            minLevel: feat.min_level,
            createdAt: feat.createdAt,
        };
    }

    async deleteFeat(workshopFeatId: number, accountId: string): Promise<void> {
        const feat = await WorkshopFeat.findOne({
            where: {
                workshop_feat_id: workshopFeatId,
                account_id: accountId,
            }
        });

        if (!feat) {
            throw new DataNotFound("FEAT001");
        }

        await feat.destroy();
    }

    async updateFeatImage(workshopFeatId: number, accountId: string, image: string): Promise<void> {
        if (!image) return;

        const feat = await WorkshopFeat.findOne({
            where: {
                workshop_feat_id: workshopFeatId,
                account_id: accountId,
            }
        });

        if (!feat) {
            throw new DataNotFound("FEAT001");
        }

        await feat.update({
            image: image,
        });
    }
}
