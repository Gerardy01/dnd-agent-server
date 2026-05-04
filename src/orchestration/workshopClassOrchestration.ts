import sequelize from '@/config/database';

// interfaces
import { CreateClassPayload, UpdateClassPayload, WorkshopClassDataReturn, WorkshopClassDetailDataReturn } from "@/interfaces/IClass";
import { IFileService } from "@/services/fileService";
import { IWorkshopClassService } from "@/services/workshopClassService";
import { IWorkshopSpellService } from "@/services/workshopSpellService";

export interface IWorkshopClassOrchestration {
    getClasses(accountId: string): Promise<WorkshopClassDataReturn[]>;
    getOneClass(workshopClassId: number, accountId: string): Promise<WorkshopClassDetailDataReturn>;
    createClass(data: CreateClassPayload, accountId: string): Promise<WorkshopClassDataReturn>;
    editClass(data: UpdateClassPayload, accountId: string): Promise<WorkshopClassDetailDataReturn>;
}

export class WorkshopClassOrchestration implements IWorkshopClassOrchestration {
    constructor(
        private classService: IWorkshopClassService,
        private spellService: IWorkshopSpellService,
        private fileService: IFileService,
    ) { }

    async getClasses(accountId: string): Promise<WorkshopClassDataReturn[]> {
        return await this.classService.getClasses(accountId);
    }

    async getOneClass(workshopClassId: number, accountId: string): Promise<WorkshopClassDetailDataReturn> {
        const classData = await this.classService.getOneClass(workshopClassId, accountId);
        const resources = await this.classService.getClassResources(workshopClassId);
        const spellIds = await this.classService.getClassSpellIds(workshopClassId);

        const spells = await this.spellService.getSpellsByIds(spellIds, accountId);

        return {
            ...classData,
            resources,
            spells
        };
    }

    async createClass(data: CreateClassPayload, accountId: string): Promise<WorkshopClassDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            // 1. Create the base class
            const newClass = await this.classService.createClass(data, accountId, transaction);

            // 2. Process spells if any exist and class has spellcasting_properties
            if (data.spellIds && data.spellIds.length > 0 && data.spellcastingProperties) {
                // Validate spells (throws error if not found)
                await this.spellService.getSpellsByIds(data.spellIds, accountId);

                // Create class-spell relationship
                await this.classService.createClassSpell(data.spellIds, newClass.workshopClassId, transaction);
            }

            // 3. Process resources if any
            let resourceImagesToUpdate: { id: number, image: string }[] = [];
            if (data.resources && data.resources.length > 0) {
                const createdResources = await this.classService.createClassResources(data.resources, accountId, newClass.workshopClassId, transaction);

                // Formulate bulk image move payload
                const filesToMove: { sourceKey: string, destinationKey: string, resourceId: number }[] = [];

                for (let i = 0; i < data.resources.length; i++) {
                    const reqResource = data.resources[i]!;
                    const newResource = createdResources[i]!;

                    if (reqResource.image) {
                        const destKey = `user/uploads/workshop/class_resources/${newResource.id}-${accountId}-${Date.now()}-${i}`;
                        filesToMove.push({
                            sourceKey: reqResource.image,
                            destinationKey: destKey,
                            resourceId: newResource.id,
                        });
                    }
                }
                if (filesToMove.length > 0) {
                    const destKeys = await this.fileService.moveTempFileToFinalLocationBulk(
                        filesToMove.map(f => ({ sourceKey: f.sourceKey, destinationKey: f.destinationKey }))
                    );

                    resourceImagesToUpdate = filesToMove.map((f, idx) => ({
                        id: f.resourceId,
                        image: destKeys[idx]!,
                    }));
                }
            }

            // 4. Move class image (if exists)
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image ?? "",
                `user/uploads/workshop/class/${newClass.workshopClassId}-${accountId}-${Date.now()}`
            );

            await transaction.commit();

            await this.classService.updateClassImage(newClass.workshopClassId, accountId, imageKey);
            await this.classService.updateClassResourcesImageBulk(resourceImagesToUpdate);

            return newClass;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async editClass(data: UpdateClassPayload, accountId: string): Promise<WorkshopClassDetailDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const targetClass = await this.classService.getOneClass(data.workshopClassId, accountId, true);
            const targetResources = await this.classService.getClassResources(data.workshopClassId, true);

            const updatedClass = await this.classService.editClass(data, accountId, transaction);

            // Spells
            await this.classService.deleteClassSpells(updatedClass.workshopClassId, transaction);
            if (data.spellIds && data.spellIds.length > 0 && data.spellcastingProperties) {
                await this.spellService.getSpellsByIds(data.spellIds, accountId);
                await this.classService.createClassSpell(data.spellIds, updatedClass.workshopClassId, transaction);
            }

            // Resources
            await this.classService.deleteClassResources(updatedClass.workshopClassId, transaction);

            let resourceImagesToUpdate: { id: number, image: string }[] = [];
            const currentResourceImages: string[] = [];

            if (data.resources && data.resources.length > 0) {
                const createdResources = await this.classService.createClassResources(data.resources, accountId, updatedClass.workshopClassId, transaction);

                const filesToMove: { sourceKey: string, destinationKey: string, resourceId: number }[] = [];

                for (let i = 0; i < data.resources.length; i++) {
                    const reqResource = data.resources[i]!;
                    const newResource = createdResources[i]!;

                    if (reqResource.image && reqResource.image.startsWith("user/temp/")) {
                        const destKey = `user/uploads/workshop/class_resources/${newResource.id}-${accountId}-${Date.now()}-${i}`;
                        filesToMove.push({
                            sourceKey: reqResource.image,
                            destinationKey: destKey,
                            resourceId: newResource.id,
                        });
                    } else if (reqResource.image) {
                        let imageKeyToSave = reqResource.image;
                        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";
                        if (imageBaseUrl && imageKeyToSave.startsWith(imageBaseUrl + "/")) {
                            imageKeyToSave = imageKeyToSave.replace(imageBaseUrl + "/", "");
                        }
                        currentResourceImages.push(imageKeyToSave);
                        resourceImagesToUpdate.push({
                            id: newResource.id,
                            image: imageKeyToSave,
                        });
                    }
                }

                if (filesToMove.length > 0) {
                    const destKeys = await this.fileService.moveTempFileToFinalLocationBulk(
                        filesToMove.map(f => ({ sourceKey: f.sourceKey, destinationKey: f.destinationKey }))
                    );

                    filesToMove.forEach((f, idx) => {
                        resourceImagesToUpdate.push({
                            id: f.resourceId,
                            image: destKeys[idx]!,
                        });
                    });
                }
            }

            // Image handling for base class
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image && data.isImageUpdated ? data.image : "",
                `user/uploads/workshop/class/${updatedClass.workshopClassId}-${accountId}-${Date.now()}`
            );
            await this.fileService.deleteFile(targetClass.image && data.isImageUpdated ? targetClass.image : "");

            // Delete removed resource images
            const oldResourceImagesToDelete = targetResources
                .map(r => r.image)
                .filter(i => i && !currentResourceImages.includes(i));

            if (oldResourceImagesToDelete.length > 0) {
                await this.fileService.deleteFilesBulk(oldResourceImagesToDelete as string[]);
            }

            await transaction.commit();

            if (data.isImageUpdated) {
                await this.classService.updateClassImage(updatedClass.workshopClassId, accountId, imageKey);
            }
            await this.classService.updateClassResourcesImageBulk(resourceImagesToUpdate);

            return await this.getOneClass(updatedClass.workshopClassId, accountId);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
