// interfaces
import { CreateItemDTO, ItemDataReturn } from "@/interfaces/IItem";
import { IItemService } from "@/services/itemService";

export interface IItemOrchestration {
    getItems(accountId: string): Promise<ItemDataReturn[]>;
    getOneItem(workshopItemId: number, accountId: string): Promise<ItemDataReturn>;
    createItem(data: CreateItemDTO): Promise<ItemDataReturn>;
}

export class ItemOrchestration implements IItemOrchestration {
    constructor(
        private itemService: IItemService,
    ) { }

    async getItems(accountId: string): Promise<ItemDataReturn[]> {
        return await this.itemService.getItems(accountId);
    }

    async getOneItem(workshopItemId: number, accountId: string): Promise<ItemDataReturn> {
        return await this.itemService.getOneItem(workshopItemId, accountId);
    }

    async createItem(data: CreateItemDTO): Promise<ItemDataReturn> {
        return await this.itemService.createItem(data);
    }
}
