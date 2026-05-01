import sequelize from '@/config/database';

// interfaces
import { CreateMonsterDTO, UpdateMonsterDTO, WorkshopMonsterDataReturn } from "@/interfaces/IMonster";
import { IFileService } from "@/services/fileService";
import { IWorkshopMonsterService } from "@/services/workshopMonsterService";

export interface IWorkshopMonsterOrchestration {
    getMonsters(accountId: string): Promise<WorkshopMonsterDataReturn[]>;
    getOneMonster(workshopMonsterId: number, accountId: string): Promise<WorkshopMonsterDataReturn>;
    createMonster(data: CreateMonsterDTO, accountId: string): Promise<WorkshopMonsterDataReturn>;
    editMonster(data: UpdateMonsterDTO, accountId: string): Promise<WorkshopMonsterDataReturn>;
    deleteMonster(workshopMonsterId: number, accountId: string): Promise<void>;
}

export class WorkshopMonsterOrchestration implements IWorkshopMonsterOrchestration {
    constructor(
        private monsterService: IWorkshopMonsterService,
        private fileService: IFileService,
    ) { }

    async getMonsters(accountId: string): Promise<WorkshopMonsterDataReturn[]> {
        return await this.monsterService.getMonsters(accountId);
    }

    async getOneMonster(workshopMonsterId: number, accountId: string): Promise<WorkshopMonsterDataReturn> {
        return await this.monsterService.getOneMonster(workshopMonsterId, accountId);
    }

    async createMonster(data: CreateMonsterDTO, accountId: string): Promise<WorkshopMonsterDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const newItem = await this.monsterService.createMonster(data, accountId, transaction);
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image ?? "",
                `user/uploads/workshop/monster/${newItem.workshopMonsterId}-${accountId}-${Date.now()}`
            );

            await transaction.commit();

            await this.monsterService.updateMonsterImage(newItem.workshopMonsterId, accountId, imageKey);

            return newItem;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async editMonster(data: UpdateMonsterDTO, accountId: string): Promise<WorkshopMonsterDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const targetMonster = await this.monsterService.getOneMonster(data.workshopMonsterId, accountId, true);
            const updatedMonster = await this.monsterService.editMonster(data, accountId, transaction);

            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image && data.isImageUpdated ? data.image : "",
                `user/uploads/workshop/monster/${updatedMonster.workshopMonsterId}-${accountId}-${Date.now()}`
            );
            await this.fileService.deleteFile(targetMonster.image && data.isImageUpdated ? targetMonster.image : "");

            await transaction.commit();

            await this.monsterService.updateMonsterImage(updatedMonster.workshopMonsterId, accountId, imageKey);

            return updatedMonster;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteMonster(workshopMonsterId: number, accountId: string): Promise<void> {
        const monster = await this.monsterService.getOneMonster(workshopMonsterId, accountId, true);
        await this.fileService.deleteFile(monster.image ?? "");
        await this.monsterService.deleteMonster(workshopMonsterId, accountId);
    }
}
