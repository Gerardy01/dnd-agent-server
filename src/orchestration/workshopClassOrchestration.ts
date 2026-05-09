import sequelize from '@/config/database';

// interfaces
import { CreateClassPayload, UpdateClassPayload, WorkshopClassDataReturn, WorkshopClassDetailDataReturn, AddFeaturePayload, EditFeaturePayload, DeleteFeaturePayload, AddResourcePayload, EditResourcePayload, DeleteResourcePayload, ClassResourceReturn, CreateClassSubPayload, UpdateClassSubPayload, WorkshopClassSubDataReturn, WorkshopClassSubDetailDataReturn } from "@/interfaces/IClass";
import { IFileService } from "@/services/fileService";
import { IWorkshopClassService } from "@/services/workshopClassService";
import { IWorkshopSpellService } from "@/services/workshopSpellService";

export interface IWorkshopClassOrchestration {
    getClasses(accountId: string): Promise<WorkshopClassDataReturn[]>;
    getOneClass(workshopClassId: number, accountId: string): Promise<WorkshopClassDataReturn>;
    getDetailedClass(workshopClassId: number, accountId: string): Promise<WorkshopClassDetailDataReturn>;
    createClass(data: CreateClassPayload, accountId: string): Promise<WorkshopClassDataReturn>;
    editClass(data: UpdateClassPayload, accountId: string): Promise<WorkshopClassDataReturn>;
    deleteClass(workshopClassId: number, accountId: string): Promise<void>;
    addFeature(data: AddFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn>;
    editFeature(data: EditFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn>;
    deleteFeature(data: DeleteFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn>;
    addResource(data: AddResourcePayload, accountId: string): Promise<ClassResourceReturn>;
    editResource(data: EditResourcePayload, accountId: string): Promise<ClassResourceReturn>;
    deleteResource(data: DeleteResourcePayload, accountId: string): Promise<void>;
    getSubclasses(workshopClassId: number, accountId: string): Promise<WorkshopClassSubDataReturn[]>;
    getOneSubclass(subclassId: number, workshopClassId: number, accountId: string): Promise<WorkshopClassSubDataReturn>;
    getDetailedSubclass(subclassId: number, workshopClassId: number, accountId: string): Promise<WorkshopClassSubDetailDataReturn>;
    createSubclass(data: CreateClassSubPayload, accountId: string): Promise<WorkshopClassSubDataReturn>;
    editSubclass(data: UpdateClassSubPayload, accountId: string): Promise<WorkshopClassSubDataReturn>;
    deleteSubclass(subclassId: number, workshopClassId: number, accountId: string): Promise<void>;
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

    async getOneClass(workshopClassId: number, accountId: string): Promise<WorkshopClassDataReturn> {
        return await this.classService.getOneClass(workshopClassId, accountId);
    }

    async getDetailedClass(workshopClassId: number, accountId: string): Promise<WorkshopClassDetailDataReturn> {
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

    async editClass(data: UpdateClassPayload, accountId: string): Promise<WorkshopClassDataReturn> {
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

    async deleteClass(workshopClassId: number, accountId: string): Promise<void> {
        const targetClass = await this.classService.getOneClass(workshopClassId, accountId, true);
        const targetResources = await this.classService.getClassResources(workshopClassId, true);

        // Delete class image
        await this.fileService.deleteFile(targetClass.image ?? "");

        // Delete resource images
        const resourceImagesToDelete = targetResources.map(r => r.image).filter(i => i);
        if (resourceImagesToDelete.length > 0) {
            await this.fileService.deleteFilesBulk(resourceImagesToDelete as string[]);
        }

        await this.classService.deleteClass(workshopClassId, accountId);
    }

    async addFeature(data: AddFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn> {
        return await this.classService.addFeature(data, accountId);
    }

    async editFeature(data: EditFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn> {
        return await this.classService.editFeature(data, accountId);
    }

    async deleteFeature(data: DeleteFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn> {
        return await this.classService.deleteFeature(data, accountId);
    }

    async addResource(data: AddResourcePayload, accountId: string): Promise<ClassResourceReturn> {

        // If image provided, move it from temp to final
        if (data.resource.image && data.resource.image.startsWith("user/temp/")) {
            const destKey = `user/uploads/workshop/class_resources/${data.workshopClassId}-${accountId}-${Date.now()}`;
            const imageKey = await this.fileService.moveTempFileToFinalLocation(data.resource.image, destKey);
            data.resource.image = imageKey;
        }

        return await this.classService.addResource(data, accountId);
    }

    async editResource(data: EditResourcePayload, accountId: string): Promise<ClassResourceReturn> {

        const existingResource = await this.classService.getOneResource(data.classResourceId, data.workshopClassId, accountId);

        if (data.resource.image && data.resource.image.startsWith("user/temp/")) {
            const destKey = `user/uploads/workshop/class_resources/${data.classResourceId}-${accountId}-${Date.now()}`;
            const imageKey = await this.fileService.moveTempFileToFinalLocation(data.resource.image, destKey);

            data.resource.image = imageKey;
        }

        if (existingResource.image) {
            await this.fileService.deleteFile(existingResource.image);
        }

        return await this.classService.editResource(data, accountId);
    }

    async deleteResource(data: DeleteResourcePayload, accountId: string): Promise<void> {
        const existingResource = await this.classService.getOneResource(data.classResourceId, data.workshopClassId, accountId);

        // Delete image if it exists
        if (existingResource.image) {
            await this.fileService.deleteFile(existingResource.image);
        }

        await this.classService.deleteResource(data, accountId);
    }

    async getSubclasses(workshopClassId: number, accountId: string): Promise<WorkshopClassSubDataReturn[]> {
        return await this.classService.getSubclasses(workshopClassId, accountId);
    }

    async getOneSubclass(subclassId: number, workshopClassId: number, accountId: string): Promise<WorkshopClassSubDataReturn> {
        return await this.classService.getOneSubclass(subclassId, workshopClassId, accountId);
    }

    async getDetailedSubclass(subclassId: number, workshopClassId: number, accountId: string): Promise<WorkshopClassSubDetailDataReturn> {
        const subclassData = await this.classService.getOneSubclass(subclassId, workshopClassId, accountId);
        const resources = await this.classService.getSubclassResources(subclassId);
        const spellIds = await this.classService.getSubclassSpellIds(subclassId);

        const spells = await this.spellService.getSpellsByIds(spellIds, accountId);

        return {
            ...subclassData,
            resources,
            spells
        };
    }

    async createSubclass(data: CreateClassSubPayload, accountId: string): Promise<WorkshopClassSubDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            // 1. Create the base subclass
            const newSubclass = await this.classService.createSubclass(data, accountId, transaction);

            // 2. Process spells if any exist and subclass has spellcasting_properties
            if (data.spellIds && data.spellIds.length > 0 && data.spellcastingProperties) {
                // Validate spells (throws error if not found)
                await this.spellService.getSpellsByIds(data.spellIds, accountId);

                // Create subclass-spell relationship
                await this.classService.createSubclassSpell(data.spellIds, newSubclass.id, transaction);
            }

            // 3. Process resources if any
            let resourceImagesToUpdate: { id: number, image: string }[] = [];
            if (data.resources && data.resources.length > 0) {
                const createdResources = await this.classService.createSubclassResources(data.resources, accountId, newSubclass.id, transaction);

                // Formulate bulk image move payload
                const filesToMove: { sourceKey: string, destinationKey: string, resourceId: number }[] = [];

                for (let i = 0; i < data.resources.length; i++) {
                    const reqResource = data.resources[i]!;
                    const newResource = createdResources[i]!;

                    if (reqResource.image) {
                        const destKey = `user/uploads/workshop/class_sub_resources/${newResource.id}-${accountId}-${Date.now()}-${i}`;
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

            // 4. Move subclass image (if exists)
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image ?? "",
                `user/uploads/workshop/class_sub/${newSubclass.id}-${accountId}-${Date.now()}`
            );

            await transaction.commit();

            await this.classService.updateSubclassImage(newSubclass.id, accountId, imageKey);
            await this.classService.updateSubclassResourcesImageBulk(resourceImagesToUpdate);

            return newSubclass;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async editSubclass(data: UpdateClassSubPayload, accountId: string): Promise<WorkshopClassSubDataReturn> {
        const transaction = await sequelize.transaction();

        try {
            const targetSubclass = await this.classService.getOneSubclass(data.id, data.workshopClassId, accountId, true);
            const targetResources = await this.classService.getSubclassResources(data.id, true);

            const updatedSubclass = await this.classService.editSubclass(data, accountId, transaction);

            // Spells
            await this.classService.deleteSubclassSpells(updatedSubclass.id, transaction);
            if (data.spellIds && data.spellIds.length > 0 && data.spellcastingProperties) {
                await this.spellService.getSpellsByIds(data.spellIds, accountId);
                await this.classService.createSubclassSpell(data.spellIds, updatedSubclass.id, transaction);
            }

            // Resources
            await this.classService.deleteSubclassResources(updatedSubclass.id, transaction);

            let resourceImagesToUpdate: { id: number, image: string }[] = [];
            const currentResourceImages: string[] = [];

            if (data.resources && data.resources.length > 0) {
                const createdResources = await this.classService.createSubclassResources(data.resources, accountId, updatedSubclass.id, transaction);

                const filesToMove: { sourceKey: string, destinationKey: string, resourceId: number }[] = [];

                for (let i = 0; i < data.resources.length; i++) {
                    const reqResource = data.resources[i]!;
                    const newResource = createdResources[i]!;

                    if (reqResource.image && reqResource.image.startsWith("user/temp/")) {
                        const destKey = `user/uploads/workshop/class_sub_resources/${newResource.id}-${accountId}-${Date.now()}-${i}`;
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

            // Image handling for subclass
            const imageKey = await this.fileService.moveTempFileToFinalLocation(
                data.image && data.isImageUpdated ? data.image : "",
                `user/uploads/workshop/class_sub/${updatedSubclass.id}-${accountId}-${Date.now()}`
            );
            await this.fileService.deleteFile(targetSubclass.image && data.isImageUpdated ? targetSubclass.image : "");

            // Delete removed resource images
            const oldResourceImagesToDelete = targetResources
                .map(r => r.image)
                .filter(i => i && !currentResourceImages.includes(i));

            if (oldResourceImagesToDelete.length > 0) {
                await this.fileService.deleteFilesBulk(oldResourceImagesToDelete as string[]);
            }

            await transaction.commit();

            if (data.isImageUpdated) {
                await this.classService.updateSubclassImage(updatedSubclass.id, accountId, imageKey);
            }
            await this.classService.updateSubclassResourcesImageBulk(resourceImagesToUpdate);

            return await this.getOneSubclass(updatedSubclass.id, data.workshopClassId, accountId);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteSubclass(subclassId: number, workshopClassId: number, accountId: string): Promise<void> {
        const targetSubclass = await this.classService.getOneSubclass(subclassId, workshopClassId, accountId, true);
        const targetResources = await this.classService.getSubclassResources(subclassId, true);

        // Delete subclass image
        await this.fileService.deleteFile(targetSubclass.image ?? "");

        // Delete resource images
        const resourceImagesToDelete = targetResources.map(r => r.image).filter(i => i);
        if (resourceImagesToDelete.length > 0) {
            await this.fileService.deleteFilesBulk(resourceImagesToDelete as string[]);
        }

        await this.classService.deleteSubclass(subclassId, workshopClassId, accountId);
    }
}
