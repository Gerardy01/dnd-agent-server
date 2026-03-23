// interfaces
import { CreateWorkshopItemDTO, UpdateWorkshopItemDTO, WorkshopItemDataReturn } from "@/interfaces/IItem";
import { IWorkshopItemService } from "@/services/workshopItemService";

export interface IWorkshopItemOrchestration {
    getItems(accountId: string): Promise<WorkshopItemDataReturn[]>;
    getOneItem(workshopItemId: number, accountId: string): Promise<WorkshopItemDataReturn>;
    createItem(data: CreateWorkshopItemDTO): Promise<WorkshopItemDataReturn>;
    editItem(data: UpdateWorkshopItemDTO): Promise<WorkshopItemDataReturn>;
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

    async createItem(data: CreateWorkshopItemDTO): Promise<WorkshopItemDataReturn> {
        return await this.itemService.createItem(data);
    }

    async editItem(data: UpdateWorkshopItemDTO): Promise<WorkshopItemDataReturn> {
        return await this.itemService.editItem(data);
    }

    async deleteItem(workshopItemId: number, accountId: string): Promise<void> {
        return await this.itemService.deleteItem(workshopItemId, accountId);
    }
}
