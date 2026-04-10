import sequelize from '@/config/database';

// interfaces
import { CreateSpellDTO, UpdateSpellDTO, WorkshopSpellDataReturn } from "@/interfaces/ISpell";
import { IFileService } from "@/services/fileService";
import { IWorkshopSpellService } from "@/services/workshopSpellService";

export interface IWorkshopSpellOrchestration {
    getSpells(accountId: string): Promise<WorkshopSpellDataReturn[]>;
    getOneSpell(workshopSpellId: number, accountId: string): Promise<WorkshopSpellDataReturn>;
    createSpell(data: CreateSpellDTO, accountId: string): Promise<WorkshopSpellDataReturn>;
    editSpell(data: UpdateSpellDTO, accountId: string): Promise<WorkshopSpellDataReturn>;
    deleteSpell(workshopSpellId: number, accountId: string): Promise<void>;
}

export class WorkshopSpellOrchestration implements IWorkshopSpellOrchestration {
    constructor(
        private spellService: IWorkshopSpellService,
        private fileService: IFileService,
    ) { }

    async getSpells(accountId: string): Promise<WorkshopSpellDataReturn[]> {
        return await this.spellService.getSpells(accountId);
    }

    async getOneSpell(workshopSpellId: number, accountId: string): Promise<WorkshopSpellDataReturn> {
        return await this.spellService.getOneSpell(workshopSpellId, accountId);
    }

    async createSpell(data: CreateSpellDTO, accountId: string): Promise<WorkshopSpellDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const newSpell = await this.spellService.createSpell(data, accountId, transaction);
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image ?? "",
                `user/uploads/workshop/spell/${newSpell.workshopSpellId}-${accountId}-${Date.now()}`
            );

            await transaction.commit();

            await this.spellService.updateSpellImage(newSpell.workshopSpellId, accountId, imageKey);

            return newSpell;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async editSpell(data: UpdateSpellDTO, accountId: string): Promise<WorkshopSpellDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const targetSpell = await this.spellService.getOneSpell(data.workshopSpellId, accountId, true);
            const updatedSpell = await this.spellService.editSpell(data, accountId, transaction);

            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image && data.isImageUpdated ? data.image : "",
                `user/uploads/workshop/spell/${updatedSpell.workshopSpellId}-${accountId}-${Date.now()}`
            );
            await this.fileService.deleteFile(targetSpell.image && data.isImageUpdated ? targetSpell.image : "");

            await transaction.commit();

            await this.spellService.updateSpellImage(updatedSpell.workshopSpellId, accountId, imageKey);

            return updatedSpell;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteSpell(workshopSpellId: number, accountId: string): Promise<void> {
        const spell = await this.spellService.getOneSpell(workshopSpellId, accountId, true);
        await this.fileService.deleteFile(spell.image ?? "");
        await this.spellService.deleteSpell(workshopSpellId, accountId);
    }
}
