import { Transaction } from "sequelize";

// models
import { WorkshopClass, WorkshopClassResources, WorkshopClassSpell, WorkshopClassSub, WorkshopClassSubResources, WorkshopClassSubSpell } from "@/models";

// exceptions
import { DataNotFound } from "@/utils/exceptions";

// interfaces
import { CreateClassDTO, UpdateClassDTO, ClassResourceDTO, WorkshopClassDataReturn, WorkshopClassResourceDataReturn, AddFeaturePayload, EditFeaturePayload, DeleteFeaturePayload, AddResourcePayload, EditResourcePayload, DeleteResourcePayload, ClassResourceReturn, CreateClassSubDTO, UpdateClassSubDTO, WorkshopClassSubDataReturn, WorkshopClassSubResourceDataReturn } from "@/interfaces/IClass";

export interface IWorkshopClassService {
    getClasses(accountId: string): Promise<WorkshopClassDataReturn[]>;
    getOneClass(workshopClassId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopClassDataReturn>;
    getClassResources(workshopClassId: number, imageKeyOnly?: boolean): Promise<WorkshopClassResourceDataReturn[]>;
    getClassSpellIds(workshopClassId: number): Promise<number[]>;
    createClass(data: CreateClassDTO, accountId: string, transaction?: Transaction): Promise<WorkshopClassDataReturn>;
    createClassResources(data: ClassResourceDTO[], accountId: string, workshopClassId: number, transaction?: Transaction): Promise<WorkshopClassResourceDataReturn[]>;
    createClassSpell(spellIds: number[], workshopClassId: number, transaction?: Transaction): Promise<void>;
    editClass(data: UpdateClassDTO, accountId: string, transaction?: Transaction): Promise<WorkshopClassDataReturn>;
    deleteClassResources(workshopClassId: number, transaction?: Transaction): Promise<void>;
    deleteClassSpells(workshopClassId: number, transaction?: Transaction): Promise<void>;
    deleteClass(workshopClassId: number, accountId: string, transaction?: Transaction): Promise<void>;
    updateClassImage(workshopClassId: number, accountId: string, image: string): Promise<void>;
    updateClassResourcesImageBulk(resourcesImageKeys: { id: number, image: string }[]): Promise<void>;
    addFeature(data: AddFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn>;
    editFeature(data: EditFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn>;
    deleteFeature(data: DeleteFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn>;
    addResource(data: AddResourcePayload, accountId: string): Promise<ClassResourceReturn>;
    editResource(data: EditResourcePayload, accountId: string): Promise<ClassResourceReturn>;
    deleteResource(data: DeleteResourcePayload, accountId: string): Promise<ClassResourceReturn>;
    getOneResource(resourceId: number, workshopClassId: number, accountId: string): Promise<WorkshopClassResourceDataReturn>;
    getSubclasses(workshopClassId: number, accountId: string): Promise<WorkshopClassSubDataReturn[]>;
    getOneSubclass(subclassId: number, workshopClassId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopClassSubDataReturn>;
    getSubclassResources(subclassId: number, imageKeyOnly?: boolean): Promise<WorkshopClassSubResourceDataReturn[]>;
    getSubclassSpellIds(subclassId: number): Promise<number[]>;
    createSubclass(data: CreateClassSubDTO, accountId: string, transaction?: Transaction): Promise<WorkshopClassSubDataReturn>;
    createSubclassResources(data: ClassResourceDTO[], accountId: string, subclassId: number, transaction?: Transaction): Promise<WorkshopClassSubResourceDataReturn[]>;
    createSubclassSpell(spellIds: number[], subclassId: number, transaction?: Transaction): Promise<void>;
    editSubclass(data: UpdateClassSubDTO, accountId: string, transaction?: Transaction): Promise<WorkshopClassSubDataReturn>;
    deleteSubclassResources(subclassId: number, transaction?: Transaction): Promise<void>;
    deleteSubclassSpells(subclassId: number, transaction?: Transaction): Promise<void>;
    deleteSubclass(subclassId: number, workshopClassId: number, accountId: string, transaction?: Transaction): Promise<void>;
    updateSubclassImage(subclassId: number, accountId: string, image: string): Promise<void>;
    updateSubclassResourcesImageBulk(resourcesImageKeys: { id: number, image: string }[]): Promise<void>;
}

export class WorkshopClassService implements IWorkshopClassService {
    constructor() { }

    async getClasses(accountId: string): Promise<WorkshopClassDataReturn[]> {
        const classes = await WorkshopClass.findAll({
            where: { account_id: accountId },
            order: [['created_at', 'DESC']]
        });

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return classes.map(c => ({
            workshopClassId: c.workshop_class_id,
            accountId: c.account_id,
            image: c.image ? `${imageBaseUrl}/${c.image}` : "",
            name: c.name,
            description: c.description,
            hitDie: c.hit_die,
            subclassLevel: c.subclass_level,
            spellcastingProperties: c.spellcasting_properties,
            features: c.features,
            createdAt: c.createdAt,
        }));
    }

    async getOneClass(workshopClassId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopClassDataReturn> {
        const c = await WorkshopClass.findOne({
            where: {
                workshop_class_id: workshopClassId,
                account_id: accountId
            }
        });

        if (!c) {
            throw new DataNotFound("CLASS001");
        }

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";
        const image = imageKeyOnly ? c.image : c.image ? `${imageBaseUrl}/${c.image}` : "";

        return {
            workshopClassId: c.workshop_class_id,
            accountId: c.account_id,
            image: image,
            name: c.name,
            description: c.description,
            hitDie: c.hit_die,
            subclassLevel: c.subclass_level,
            spellcastingProperties: c.spellcasting_properties,
            features: c.features,
            createdAt: c.createdAt,
        };
    }

    async getClassResources(workshopClassId: number, imageKeyOnly?: boolean): Promise<WorkshopClassResourceDataReturn[]> {
        const resources = await WorkshopClassResources.findAll({
            where: { workshop_class_id: workshopClassId }
        });

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return resources.map(resource => ({
            id: resource.id,
            workshopClassId: resource.workshop_class_id,
            image: imageKeyOnly ? resource.image : resource.image ? `${imageBaseUrl}/${resource.image}` : "",
            name: resource.name,
            description: resource.description,
            color: resource.color,
            maxPerLevel: resource.max_per_level,
            resourceRecovery: resource.resource_recovery,
            createdAt: resource.createdAt,
        }));
    }

    async getClassSpellIds(workshopClassId: number): Promise<number[]> {
        const spells = await WorkshopClassSpell.findAll({
            where: { workshop_class_id: workshopClassId }
        });

        return spells.map(s => s.workshop_spell_id);
    }

    async createClass(data: CreateClassDTO, accountId: string, transaction?: Transaction): Promise<WorkshopClassDataReturn> {
        const newClass = await WorkshopClass.create({
            account_id: accountId,
            image: "",
            name: data.name,
            description: data.description,
            hit_die: data.hitDie,
            subclass_level: data.subclassLevel,
            spellcasting_properties: data.spellcastingProperties || null,
            features: data.features || [],
        }, { transaction: transaction ?? null });

        return {
            workshopClassId: newClass.workshop_class_id,
            accountId: newClass.account_id,
            image: newClass.image,
            name: newClass.name,
            description: newClass.description,
            hitDie: newClass.hit_die,
            subclassLevel: newClass.subclass_level,
            spellcastingProperties: newClass.spellcasting_properties,
            features: newClass.features,
            createdAt: newClass.createdAt,
        };
    }

    async createClassResources(data: ClassResourceDTO[], accountId: string, workshopClassId: number, transaction?: Transaction): Promise<WorkshopClassResourceDataReturn[]> {
        const resourcesToCreate = data.map(resource => ({
            workshop_class_id: workshopClassId,
            image: "",
            name: resource.name,
            description: resource.description,
            color: resource.color,
            max_per_level: resource.maxPerLevel,
            resource_recovery: resource.resourceRecovery,
        }));

        const newResources = await WorkshopClassResources.bulkCreate(resourcesToCreate, { transaction: transaction ?? null, returning: true });

        return newResources.map(resource => ({
            id: resource.id,
            workshopClassId: resource.workshop_class_id,
            image: resource.image,
            name: resource.name,
            description: resource.description,
            color: resource.color,
            maxPerLevel: resource.max_per_level,
            resourceRecovery: resource.resource_recovery,
            createdAt: resource.createdAt,
        }));
    }

    async createClassSpell(spellIds: number[], workshopClassId: number, transaction?: Transaction): Promise<void> {
        const uniqueSpellIds = [...new Set(spellIds)];
        const spellsToCreate = uniqueSpellIds.map(spellId => ({
            workshop_class_id: workshopClassId,
            workshop_spell_id: spellId,
        }));

        await WorkshopClassSpell.bulkCreate(spellsToCreate, { transaction: transaction ?? null });
    }

    async editClass(data: UpdateClassDTO, accountId: string, transaction?: Transaction): Promise<WorkshopClassDataReturn> {
        const workshopClass = await WorkshopClass.findOne({
            where: {
                workshop_class_id: data.workshopClassId,
                account_id: accountId,
            }
        });

        if (!workshopClass) {
            throw new DataNotFound("CLASS001");
        }

        await workshopClass.update({
            image: data.isImageUpdated ? data.image : workshopClass.image,
            name: data.name,
            description: data.description,
            hit_die: data.hitDie,
            subclass_level: data.subclassLevel,
            spellcasting_properties: data.spellcastingProperties || null,
            features: data.features || [],
        }, { transaction: transaction ?? null });

        return {
            workshopClassId: workshopClass.workshop_class_id,
            accountId: workshopClass.account_id,
            image: workshopClass.image,
            name: workshopClass.name,
            description: workshopClass.description,
            hitDie: workshopClass.hit_die,
            subclassLevel: workshopClass.subclass_level,
            spellcastingProperties: workshopClass.spellcasting_properties,
            features: workshopClass.features,
            createdAt: workshopClass.createdAt,
        };
    }

    async deleteClassResources(workshopClassId: number, transaction?: Transaction): Promise<void> {
        await WorkshopClassResources.destroy({
            where: { workshop_class_id: workshopClassId },
            transaction: transaction ?? null
        });
    }

    async deleteClassSpells(workshopClassId: number, transaction?: Transaction): Promise<void> {
        await WorkshopClassSpell.destroy({
            where: { workshop_class_id: workshopClassId },
            transaction: transaction ?? null
        });
    }

    async deleteClass(workshopClassId: number, accountId: string, transaction?: Transaction): Promise<void> {
        const workshopClass = await WorkshopClass.findOne({
            where: {
                workshop_class_id: workshopClassId,
                account_id: accountId,
            }
        });

        if (!workshopClass) {
            throw new DataNotFound("CLASS001");
        }

        await workshopClass.destroy({ transaction: transaction ?? null });
    }

    async updateClassImage(workshopClassId: number, accountId: string, image: string): Promise<void> {
        if (!image) return;

        const workshopClass = await WorkshopClass.findOne({
            where: {
                workshop_class_id: workshopClassId,
                account_id: accountId,
            }
        });

        if (!workshopClass) {
            throw new DataNotFound("CLASS001");
        }

        await workshopClass.update({ image });
    }

    async updateClassResourcesImageBulk(resourcesImageKeys: { id: number, image: string }[]): Promise<void> {
        if (resourcesImageKeys.length === 0) return;

        const updatePromises = resourcesImageKeys
            .filter(item => item.image)
            .map(item => WorkshopClassResources.update(
                { image: item.image },
                { where: { id: item.id } }
            ));

        await Promise.all(updatePromises);
    }

    async addFeature(data: AddFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn> {
        const workshopClass = await WorkshopClass.findOne({
            where: {
                workshop_class_id: data.workshopClassId,
                account_id: accountId,
            }
        });

        if (!workshopClass) {
            throw new DataNotFound("CLASS001");
        }

        const features = [...workshopClass.features, data.feature];

        const updated = await workshopClass.update({ features });

        return {
            workshopClassId: updated.workshop_class_id,
            accountId: updated.account_id,
            image: updated.image,
            name: updated.name,
            description: updated.description,
            hitDie: updated.hit_die,
            subclassLevel: updated.subclass_level,
            spellcastingProperties: updated.spellcasting_properties,
            features: updated.features,
            createdAt: updated.createdAt,
        };
    }

    async editFeature(data: EditFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn> {
        const workshopClass = await WorkshopClass.findOne({
            where: {
                workshop_class_id: data.workshopClassId,
                account_id: accountId,
            }
        });

        if (!workshopClass) {
            throw new DataNotFound("CLASS001");
        }

        const features = [...workshopClass.features];
        const index = features.findIndex(f =>
            f.name === data.currentFeature.name &&
            f.level === data.currentFeature.level &&
            f.description === data.currentFeature.description &&
            f.type === data.currentFeature.type
        );

        if (index !== -1) {
            features[index] = data.newFeature;
        }

        const updated = await workshopClass.update({ features });

        return {
            workshopClassId: updated.workshop_class_id,
            accountId: updated.account_id,
            image: updated.image,
            name: updated.name,
            description: updated.description,
            hitDie: updated.hit_die,
            subclassLevel: updated.subclass_level,
            spellcastingProperties: updated.spellcasting_properties,
            features: updated.features,
            createdAt: updated.createdAt,
        };
    }

    async deleteFeature(data: DeleteFeaturePayload, accountId: string): Promise<WorkshopClassDataReturn> {
        const workshopClass = await WorkshopClass.findOne({
            where: {
                workshop_class_id: data.workshopClassId,
                account_id: accountId,
            }
        });

        if (!workshopClass) {
            throw new DataNotFound("CLASS001");
        }

        const features = [...workshopClass.features];
        const index = features.findIndex(f =>
            f.name === data.feature.name &&
            f.level === data.feature.level &&
            f.description === data.feature.description &&
            f.type === data.feature.type
        );

        if (index !== -1) {
            features.splice(index, 1);
        }

        const updated = await workshopClass.update({ features });

        return {
            workshopClassId: updated.workshop_class_id,
            accountId: updated.account_id,
            image: updated.image,
            name: updated.name,
            description: updated.description,
            hitDie: updated.hit_die,
            subclassLevel: updated.subclass_level,
            spellcastingProperties: updated.spellcasting_properties,
            features: updated.features,
            createdAt: updated.createdAt,
        };
    }
    async addResource(data: AddResourcePayload, accountId: string): Promise<ClassResourceReturn> {
        const workshopClass = await WorkshopClass.findOne({
            where: {
                workshop_class_id: data.workshopClassId,
                account_id: accountId,
            }
        });

        if (!workshopClass) {
            throw new DataNotFound("CLASS001");
        }

        const newResource = await WorkshopClassResources.create({
            workshop_class_id: data.workshopClassId,
            image: data.resource.image || "",
            name: data.resource.name,
            description: data.resource.description,
            color: data.resource.color,
            max_per_level: data.resource.maxPerLevel,
            resource_recovery: data.resource.resourceRecovery,
        });

        return {
            id: newResource.id,
            image: newResource.image,
            name: newResource.name,
            description: newResource.description,
            color: newResource.color,
            maxPerLevel: newResource.max_per_level,
            resourceRecovery: newResource.resource_recovery,
        };
    }

    async editResource(data: EditResourcePayload, accountId: string): Promise<ClassResourceReturn> {

        const workshopClass = await WorkshopClass.findOne({
            where: {
                workshop_class_id: data.workshopClassId,
                account_id: accountId,
            }
        });

        if (!workshopClass) {
            throw new DataNotFound("CLASS001");
        }

        const resource = await WorkshopClassResources.findOne({
            where: {
                id: data.classResourceId,
                workshop_class_id: data.workshopClassId,
            }
        });

        if (!resource) {
            throw new DataNotFound("CLASS001");
        }

        await resource.update({
            image: data.resource.image || "",
            name: data.resource.name,
            description: data.resource.description,
            color: data.resource.color,
            max_per_level: data.resource.maxPerLevel,
            resource_recovery: data.resource.resourceRecovery,
        });

        return {
            id: resource.id,
            image: resource.image,
            name: resource.name,
            description: resource.description,
            color: resource.color,
            maxPerLevel: resource.max_per_level,
            resourceRecovery: resource.resource_recovery,
        };
    }


    async deleteResource(data: DeleteResourcePayload, accountId: string): Promise<ClassResourceReturn> {
        const workshopClass = await WorkshopClass.findOne({
            where: {
                workshop_class_id: data.workshopClassId,
                account_id: accountId,
            }
        });

        if (!workshopClass) {
            throw new DataNotFound("CLASS001");
        }

        const resource = await WorkshopClassResources.findOne({
            where: {
                id: data.classResourceId,
                workshop_class_id: data.workshopClassId,
            }
        });

        if (!resource) {
            throw new DataNotFound("CLASS001");
        }

        const deletedResource: ClassResourceReturn = {
            id: resource.id,
            image: resource.image,
            name: resource.name,
            description: resource.description,
            color: resource.color,
            maxPerLevel: resource.max_per_level,
            resourceRecovery: resource.resource_recovery,
        };

        await resource.destroy();

        return deletedResource;
    }

    async getOneResource(resourceId: number, workshopClassId: number, accountId: string): Promise<WorkshopClassResourceDataReturn> {

        const workshopClass = await WorkshopClass.findOne({
            where: {
                workshop_class_id: workshopClassId,
                account_id: accountId,
            }
        });

        if (!workshopClass) {
            throw new DataNotFound("CLASS001");
        }

        const resource = await WorkshopClassResources.findOne({
            where: {
                id: resourceId,
                workshop_class_id: workshopClassId,
            },
        });

        if (!resource) {
            throw new DataNotFound("CLASS001");
        }

        return {
            id: resource.id,
            workshopClassId: resource.workshop_class_id,
            image: resource.image,
            name: resource.name,
            description: resource.description,
            color: resource.color,
            maxPerLevel: resource.max_per_level,
            resourceRecovery: resource.resource_recovery,
            createdAt: resource.createdAt,
        };
    }

    async getSubclasses(workshopClassId: number, accountId: string): Promise<WorkshopClassSubDataReturn[]> {
        await this.getOneClass(workshopClassId, accountId); // validate class access

        const subclasses = await WorkshopClassSub.findAll({
            where: { workshop_class_id: workshopClassId },
            order: [['created_at', 'DESC']]
        });

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return subclasses.map(c => ({
            id: c.id,
            workshopClassId: c.workshop_class_id,
            image: c.image ? `${imageBaseUrl}/${c.image}` : "",
            name: c.name,
            description: c.description,
            spellcastingProperties: c.spellcasting_properties,
            features: c.features,
            createdAt: c.createdAt,
        }));
    }

    async getOneSubclass(subclassId: number, workshopClassId: number, accountId: string, imageKeyOnly?: boolean): Promise<WorkshopClassSubDataReturn> {
        await this.getOneClass(workshopClassId, accountId); // validate class access

        const c = await WorkshopClassSub.findOne({
            where: {
                id: subclassId,
                workshop_class_id: workshopClassId
            }
        });

        if (!c) {
            throw new DataNotFound("CLASS001");
        }

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";
        const image = imageKeyOnly ? c.image : c.image ? `${imageBaseUrl}/${c.image}` : "";

        return {
            id: c.id,
            workshopClassId: c.workshop_class_id,
            image: image,
            name: c.name,
            description: c.description,
            spellcastingProperties: c.spellcasting_properties,
            features: c.features,
            createdAt: c.createdAt,
        };
    }

    async getSubclassResources(subclassId: number, imageKeyOnly?: boolean): Promise<WorkshopClassSubResourceDataReturn[]> {
        const resources = await WorkshopClassSubResources.findAll({
            where: { workshop_class_sub_id: subclassId }
        });

        const imageBaseUrl = process.env.FILE_PUBLIC_URL || "";

        return resources.map(resource => ({
            id: resource.id,
            workshopClassSubId: resource.workshop_class_sub_id,
            image: imageKeyOnly ? resource.image : resource.image ? `${imageBaseUrl}/${resource.image}` : "",
            name: resource.name,
            description: resource.description,
            color: resource.color,
            maxPerLevel: resource.max_per_level,
            resourceRecovery: resource.resource_recovery,
            createdAt: resource.createdAt,
        }));
    }

    async getSubclassSpellIds(subclassId: number): Promise<number[]> {
        const spells = await WorkshopClassSubSpell.findAll({
            where: { workshop_class_sub_id: subclassId }
        });

        return spells.map(s => s.workshop_spell_id);
    }

    async createSubclass(data: CreateClassSubDTO, accountId: string, transaction?: Transaction): Promise<WorkshopClassSubDataReturn> {
        await this.getOneClass(data.workshopClassId, accountId); // validate class access

        const newSubclass = await WorkshopClassSub.create({
            workshop_class_id: data.workshopClassId,
            image: "",
            name: data.name,
            description: data.description,
            spellcasting_properties: data.spellcastingProperties || null,
            features: data.features || [],
        }, { transaction: transaction ?? null });

        return {
            id: newSubclass.id,
            workshopClassId: newSubclass.workshop_class_id,
            image: newSubclass.image,
            name: newSubclass.name,
            description: newSubclass.description,
            spellcastingProperties: newSubclass.spellcasting_properties,
            features: newSubclass.features,
            createdAt: newSubclass.createdAt,
        };
    }

    async createSubclassResources(data: ClassResourceDTO[], accountId: string, subclassId: number, transaction?: Transaction): Promise<WorkshopClassSubResourceDataReturn[]> {
        const resourcesToCreate = data.map(resource => ({
            workshop_class_sub_id: subclassId,
            image: "",
            name: resource.name,
            description: resource.description,
            color: resource.color,
            max_per_level: resource.maxPerLevel,
            resource_recovery: resource.resourceRecovery,
        }));

        const newResources = await WorkshopClassSubResources.bulkCreate(resourcesToCreate, { transaction: transaction ?? null, returning: true });

        return newResources.map(resource => ({
            id: resource.id,
            workshopClassSubId: resource.workshop_class_sub_id,
            image: resource.image,
            name: resource.name,
            description: resource.description,
            color: resource.color,
            maxPerLevel: resource.max_per_level,
            resourceRecovery: resource.resource_recovery,
            createdAt: resource.createdAt,
        }));
    }

    async createSubclassSpell(spellIds: number[], subclassId: number, transaction?: Transaction): Promise<void> {
        const uniqueSpellIds = [...new Set(spellIds)];
        const spellsToCreate = uniqueSpellIds.map(spellId => ({
            workshop_class_sub_id: subclassId,
            workshop_spell_id: spellId,
        }));

        await WorkshopClassSubSpell.bulkCreate(spellsToCreate, { transaction: transaction ?? null });
    }

    async editSubclass(data: UpdateClassSubDTO, accountId: string, transaction?: Transaction): Promise<WorkshopClassSubDataReturn> {
        await this.getOneClass(data.workshopClassId, accountId); // validate class access

        const subclass = await WorkshopClassSub.findOne({
            where: {
                id: data.id,
                workshop_class_id: data.workshopClassId,
            }
        });

        if (!subclass) {
            throw new DataNotFound("CLASS001");
        }

        await subclass.update({
            image: data.isImageUpdated ? data.image : subclass.image,
            name: data.name,
            description: data.description,
            spellcasting_properties: data.spellcastingProperties || null,
            features: data.features || [],
        }, { transaction: transaction ?? null });

        return {
            id: subclass.id,
            workshopClassId: subclass.workshop_class_id,
            image: subclass.image,
            name: subclass.name,
            description: subclass.description,
            spellcastingProperties: subclass.spellcasting_properties,
            features: subclass.features,
            createdAt: subclass.createdAt,
        };
    }

    async deleteSubclassResources(subclassId: number, transaction?: Transaction): Promise<void> {
        await WorkshopClassSubResources.destroy({
            where: { workshop_class_sub_id: subclassId },
            transaction: transaction ?? null
        });
    }

    async deleteSubclassSpells(subclassId: number, transaction?: Transaction): Promise<void> {
        await WorkshopClassSubSpell.destroy({
            where: { workshop_class_sub_id: subclassId },
            transaction: transaction ?? null
        });
    }

    async deleteSubclass(subclassId: number, workshopClassId: number, accountId: string, transaction?: Transaction): Promise<void> {
        await this.getOneClass(workshopClassId, accountId); // validate class access

        const subclass = await WorkshopClassSub.findOne({
            where: {
                id: subclassId,
                workshop_class_id: workshopClassId,
            }
        });

        if (!subclass) {
            throw new DataNotFound("CLASS001");
        }

        await subclass.destroy({ transaction: transaction ?? null });
    }

    async updateSubclassImage(subclassId: number, accountId: string, image: string): Promise<void> {
        if (!image) return;

        const subclass = await WorkshopClassSub.findOne({
            where: { id: subclassId }
        });

        if (!subclass) {
            throw new DataNotFound("CLASS001");
        }

        await subclass.update({ image });
    }

    async updateSubclassResourcesImageBulk(resourcesImageKeys: { id: number, image: string }[]): Promise<void> {
        if (resourcesImageKeys.length === 0) return;

        const updatePromises = resourcesImageKeys
            .filter(item => item.image)
            .map(item => WorkshopClassSubResources.update(
                { image: item.image },
                { where: { id: item.id } }
            ));

        await Promise.all(updatePromises);
    }

}
