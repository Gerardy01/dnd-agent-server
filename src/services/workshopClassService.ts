import { Transaction } from "sequelize";

// models
import { WorkshopClass, WorkshopClassResources, WorkshopClassSpell } from "@/models";

// exceptions
import { DataNotFound } from "@/utils/exceptions";

// interfaces
import { CreateClassDTO, UpdateClassDTO, ClassResourceDTO, WorkshopClassDataReturn, WorkshopClassResourceDataReturn } from "@/interfaces/IClass";

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
}
