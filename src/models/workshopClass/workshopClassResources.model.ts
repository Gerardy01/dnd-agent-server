import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

import { MaxKnown, ResourceRecovery } from "@/interfaces/IClass";
import WorkshopClass from "@/models/workshopClass/workshopClass.model";

class WorkshopClassResources extends Model {
    declare public id: number;
    declare public workshop_class_id: number;
    declare public image: string;
    declare public name: string;
    declare public description: string;
    declare public color: string;
    declare public max_per_level: MaxKnown[];
    declare public resource_recovery: ResourceRecovery;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

WorkshopClassResources.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    workshop_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: WorkshopClass,
            key: 'workshop_class_id',
        },
        onDelete: 'CASCADE'
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    max_per_level: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
    resource_recovery: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'WorkshopClassResources',
    tableName: 'workshop_class_resources',
    timestamps: true,
    underscored: true,
});

export default WorkshopClassResources;
