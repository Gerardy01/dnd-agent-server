import sequelize from '@/config/database';

// interfaces
import { CreateRacePayload, UpdateRacePayload, WorkshopRaceDataReturn, WorkshopRaceDetailDataReturn, AddTraitsPayload, EditTraitsPayload, DeleteTraitsPayload } from "@/interfaces/IRace";
import { IFileService } from "@/services/fileService";
import { IWorkshopRaceService } from "@/services/workshopRaceService";
import { IWorkshopSpellService } from "@/services/workshopSpellService";

export interface IWorkshopRaceOrchestration {
    getRaces(accountId: string): Promise<WorkshopRaceDataReturn[]>;
    getOneRace(workshopRaceId: number, accountId: string): Promise<WorkshopRaceDataReturn>;
    getDetailedRace(workshopRaceId: number, accountId: string): Promise<WorkshopRaceDetailDataReturn>;
    createRace(data: CreateRacePayload, accountId: string): Promise<WorkshopRaceDataReturn>;
    editRace(data: UpdateRacePayload, accountId: string): Promise<WorkshopRaceDataReturn>;
    deleteRace(workshopRaceId: number, accountId: string): Promise<void>;
    addTrait(data: AddTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn>;
    editTrait(data: EditTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn>;
    deleteTrait(data: DeleteTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn>;
}

export class WorkshopRaceOrchestration implements IWorkshopRaceOrchestration {
    constructor(
        private raceService: IWorkshopRaceService,
        private spellService: IWorkshopSpellService,
        private fileService: IFileService,
    ) { }

    async getRaces(accountId: string): Promise<WorkshopRaceDataReturn[]> {
        return await this.raceService.getRaces(accountId);
    }

    async getOneRace(workshopRaceId: number, accountId: string): Promise<WorkshopRaceDataReturn> {
        return await this.raceService.getOneRace(workshopRaceId, accountId);
    }

    async getDetailedRace(workshopRaceId: number, accountId: string): Promise<WorkshopRaceDetailDataReturn> {
        const raceData = await this.raceService.getOneRace(workshopRaceId, accountId);
        const spellIds = await this.raceService.getRaceSpellIds(workshopRaceId);

        const spells = await this.spellService.getSpellsByIds(spellIds, accountId);

        return {
            ...raceData,
            spells
        };
    }

    async createRace(data: CreateRacePayload, accountId: string): Promise<WorkshopRaceDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            // 1. Create the base race
            const newRace = await this.raceService.createRace(data, accountId, transaction);

            // 2. Process spells if any exist
            if (data.spellIds && data.spellIds.length > 0) {
                // Validate spells (throws error if not found)
                await this.spellService.getSpellsByIds(data.spellIds, accountId);

                // Create race-spell relationship
                await this.raceService.createRaceSpell(data.spellIds, newRace.workshopRaceId, transaction);
            }

            // 3. Move race image (if exists)
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image ?? "",
                `user/uploads/workshop/race/${newRace.workshopRaceId}-${accountId}-${Date.now()}`
            );

            await transaction.commit();

            await this.raceService.updateRaceImage(newRace.workshopRaceId, accountId, imageKey);

            return newRace;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async editRace(data: UpdateRacePayload, accountId: string): Promise<WorkshopRaceDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const targetRace = await this.raceService.getOneRace(data.workshopRaceId, accountId, true);

            const updatedRace = await this.raceService.editRace(data, accountId, transaction);

            // Spells
            await this.raceService.deleteRaceSpells(updatedRace.workshopRaceId, transaction);
            if (data.spellIds && data.spellIds.length > 0) {
                await this.spellService.getSpellsByIds(data.spellIds, accountId);
                await this.raceService.createRaceSpell(data.spellIds, updatedRace.workshopRaceId, transaction);
            }

            // Image handling for base race
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image && data.isImageUpdated ? data.image : "",
                `user/uploads/workshop/race/${updatedRace.workshopRaceId}-${accountId}-${Date.now()}`
            );
            await this.fileService.deleteFile(targetRace.image && data.isImageUpdated ? targetRace.image : "");

            await transaction.commit();

            if (data.isImageUpdated) {
                await this.raceService.updateRaceImage(updatedRace.workshopRaceId, accountId, imageKey);
            }

            return await this.getOneRace(updatedRace.workshopRaceId, accountId);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteRace(workshopRaceId: number, accountId: string): Promise<void> {
        const targetRace = await this.raceService.getOneRace(workshopRaceId, accountId, true);

        // Delete race image
        await this.fileService.deleteFile(targetRace.image ?? "");

        await this.raceService.deleteRace(workshopRaceId, accountId);
    }

    async addTrait(data: AddTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn> {
        return await this.raceService.addTrait(data, accountId);
    }

    async editTrait(data: EditTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn> {
        return await this.raceService.editTrait(data, accountId);
    }

    async deleteTrait(data: DeleteTraitsPayload, accountId: string): Promise<WorkshopRaceDataReturn> {
        return await this.raceService.deleteTrait(data, accountId);
    }


}
