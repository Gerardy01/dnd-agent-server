import sequelize from '@/config/database';

// interfaces
import { CreateFactionDTO, UpdateFactionDTO, WorkshopFactionDataReturn } from "@/interfaces/IFaction";
import { IFileService } from "@/services/fileService";
import { IWorkshopFactionService } from "@/services/workshopFactionService";

export interface IWorkshopFactionOrchestration {
    getFactions(accountId: string): Promise<WorkshopFactionDataReturn[]>;
    getOneFaction(workshopFactionId: number, accountId: string): Promise<WorkshopFactionDataReturn>;
    createFaction(data: CreateFactionDTO, accountId: string): Promise<WorkshopFactionDataReturn>;
    editFaction(data: UpdateFactionDTO, accountId: string): Promise<WorkshopFactionDataReturn>;
    deleteFaction(workshopFactionId: number, accountId: string): Promise<void>;
}

export class WorkshopFactionOrchestration implements IWorkshopFactionOrchestration {
    constructor(
        private factionService: IWorkshopFactionService,
        private fileService: IFileService,
    ) { }

    async getFactions(accountId: string): Promise<WorkshopFactionDataReturn[]> {
        return await this.factionService.getFactions(accountId);
    }

    async getOneFaction(workshopFactionId: number, accountId: string): Promise<WorkshopFactionDataReturn> {
        return await this.factionService.getOneFaction(workshopFactionId, accountId);
    }

    async createFaction(data: CreateFactionDTO, accountId: string): Promise<WorkshopFactionDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const newFaction = await this.factionService.createFaction(data, accountId, transaction);
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image ?? "",
                `user/uploads/workshop/faction/${newFaction.workshopFactionId}-${accountId}-${Date.now()}`
            );

            await transaction.commit();

            await this.factionService.updateFactionImage(newFaction.workshopFactionId, accountId, imageKey);

            return await this.factionService.getOneFaction(newFaction.workshopFactionId, accountId);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async editFaction(data: UpdateFactionDTO, accountId: string): Promise<WorkshopFactionDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const existingFaction = await this.factionService.getOneFaction(data.workshopFactionId, accountId, true);

            let imageKey = existingFaction.image ?? "";

            if (data.isImageUpdated) {
                imageKey = await this.fileService.moveTempFileToFinalLocation(
                    data.image ?? "",
                    `user/uploads/workshop/faction/${data.workshopFactionId}-${accountId}-${Date.now()}`
                );

                if (existingFaction.image) {
                    await this.fileService.deleteFile(existingFaction.image);
                }
            }

            const updatedData = { ...data, image: imageKey };
            const updatedFaction = await this.factionService.editFaction(updatedData, accountId, transaction);

            await transaction.commit();

            return await this.factionService.getOneFaction(updatedFaction.workshopFactionId, accountId);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteFaction(workshopFactionId: number, accountId: string): Promise<void> {
        const faction = await this.factionService.getOneFaction(workshopFactionId, accountId, true);

        if (faction.image) {
            await this.fileService.deleteFile(faction.image);
        }

        await this.factionService.deleteFaction(workshopFactionId, accountId);
    }
}
