// interfaces
import { CreateItemDTO, UpdateItemDTO, WorkshopItemDataReturn } from "@/interfaces/IItem";
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
    ) { }

    async getItems(accountId: string): Promise<WorkshopItemDataReturn[]> {
        return await this.itemService.getItems(accountId);
    }

    async getOneItem(workshopItemId: number, accountId: string): Promise<WorkshopItemDataReturn> {
        return await this.itemService.getOneItem(workshopItemId, accountId);
    }

    async createItem(data: CreateItemDTO, accountId: string): Promise<WorkshopItemDataReturn> {
        return await this.itemService.createItem(data, accountId);
    }

    async editItem(data: UpdateItemDTO, accountId: string): Promise<WorkshopItemDataReturn> {
        return await this.itemService.editItem(data, accountId);
    }

    async deleteItem(workshopItemId: number, accountId: string): Promise<void> {
        return await this.itemService.deleteItem(workshopItemId, accountId);
    }
}
