import sequelize from '@/config/database';

// interfaces
import { CreateItemDTO, UpdateItemDTO, WorkshopItemDataReturn } from "@/interfaces/IItem";
import { IFileService } from "@/services/fileService";
import { IWorkshopItemService } from "@/services/workshopItemService";
export interface IWorkshopItemOrchestration {
    getItems(accountId: string): Promise<WorkshopItemDataReturn[]>;
    getOneItem(workshopItemId: number, accountId: string): Promise<WorkshopItemDataReturn>;
    createItem(data: CreateItemDTO, accountId: string): Promise<WorkshopItemDataReturn>;
    editItem(data: UpdateItemDTO, accountId: string): Promise<WorkshopItemDataReturn>;
    deleteItem(workshopItemId: number, accountId: string): Promise<void>;
}

export class WorkshopItemOrchestration implements IWorkshopItemOrchestration {
    constructor(
        private itemService: IWorkshopItemService,
        private fileService: IFileService,
    ) { }

    async getItems(accountId: string): Promise<WorkshopItemDataReturn[]> {
        return await this.itemService.getItems(accountId);
    }

    async getOneItem(workshopItemId: number, accountId: string): Promise<WorkshopItemDataReturn> {
        return await this.itemService.getOneItem(workshopItemId, accountId);
    }

    async createItem(data: CreateItemDTO, accountId: string): Promise<WorkshopItemDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const newItem = await this.itemService.createItem(data, accountId, transaction);
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image ?? "",
                `user/uploads/workshop/item/${newItem.workshopItemId}-${accountId}-${Date.now()}`
            );

            await transaction.commit();

            await this.itemService.updateItemImage(newItem.workshopItemId, accountId, imageKey);

            return newItem;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async editItem(data: UpdateItemDTO, accountId: string): Promise<WorkshopItemDataReturn> {
        const transaction = await sequelize.transaction();

        try {

            const targetItem = await this.itemService.getOneItem(data.workshopItemId, accountId, true);
            const updatedItem = await this.itemService.editItem(data, accountId, transaction);

            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image && data.isImageUpdated ? data.image : "",
                `user/uploads/workshop/item/${updatedItem.workshopItemId}-${accountId}-${Date.now()}`
            );
            await this.fileService.deleteFile(targetItem.image && data.isImageUpdated ? targetItem.image : "");

            await transaction.commit();

            await this.itemService.updateItemImage(updatedItem.workshopItemId, accountId, imageKey);

            return updatedItem;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteItem(workshopItemId: number, accountId: string): Promise<void> {
        const item = await this.itemService.getOneItem(workshopItemId, accountId, true);
        await this.fileService.deleteFile(item.image ?? "");
        await this.itemService.deleteItem(workshopItemId, accountId);
    }
}
