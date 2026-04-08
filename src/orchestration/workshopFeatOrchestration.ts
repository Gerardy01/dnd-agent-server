import sequelize from '@/config/database';

// interfaces
import { CreateFeatDTO, UpdateFeatDTO, WorkshopFeatDataReturn } from "@/interfaces/IFeat";
import { IFileService } from "@/services/fileService";
import { IWorkshopFeatService } from "@/services/workshopFeatService";

export interface IWorkshopFeatOrchestration {
    getFeats(accountId: string): Promise<WorkshopFeatDataReturn[]>;
    getOneFeat(workshopFeatId: number, accountId: string): Promise<WorkshopFeatDataReturn>;
    createFeat(data: CreateFeatDTO, accountId: string): Promise<WorkshopFeatDataReturn>;
    editFeat(data: UpdateFeatDTO, accountId: string): Promise<WorkshopFeatDataReturn>;
    deleteFeat(workshopFeatId: number, accountId: string): Promise<void>;
}

export class WorkshopFeatOrchestration implements IWorkshopFeatOrchestration {
    constructor(
        private featService: IWorkshopFeatService,
        private fileService: IFileService,
    ) { }

    async getFeats(accountId: string): Promise<WorkshopFeatDataReturn[]> {
        return await this.featService.getFeats(accountId);
    }

    async getOneFeat(workshopFeatId: number, accountId: string): Promise<WorkshopFeatDataReturn> {
        return await this.featService.getOneFeat(workshopFeatId, accountId);
    }

    async createFeat(data: CreateFeatDTO, accountId: string): Promise<WorkshopFeatDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const newFeat = await this.featService.createFeat(data, accountId, transaction);
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image ?? "",
                `user/uploads/workshop/feat/${newFeat.workshopFeatId}-${accountId}-${Date.now()}`
            );

            await transaction.commit();

            await this.featService.updateFeatImage(newFeat.workshopFeatId, accountId, imageKey);

            return newFeat;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async editFeat(data: UpdateFeatDTO, accountId: string): Promise<WorkshopFeatDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const targetFeat = await this.featService.getOneFeat(data.workshopFeatId, accountId, true);
            const updatedFeat = await this.featService.editFeat(data, accountId, transaction);

            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image && data.isImageUpdated ? data.image : "",
                `user/uploads/workshop/feat/${updatedFeat.workshopFeatId}-${accountId}-${Date.now()}`
            );
            await this.fileService.deleteFile(targetFeat.image && data.isImageUpdated ? targetFeat.image : "");

            await transaction.commit();

            await this.featService.updateFeatImage(updatedFeat.workshopFeatId, accountId, imageKey);

            return updatedFeat;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteFeat(workshopFeatId: number, accountId: string): Promise<void> {
        const feat = await this.featService.getOneFeat(workshopFeatId, accountId, true);
        await this.fileService.deleteFile(feat.image ?? "");
        await this.featService.deleteFeat(workshopFeatId, accountId);
    }
}
