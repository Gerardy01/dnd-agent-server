import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

import { Features, SpellcastingProperties } from "@/interfaces/IClass";
import WorkshopClass from "@/models/workshopClass/workshopClass.model";

class WorkshopClassSub extends Model {
    declare public id: number;
    declare public workshop_class_id: number;
    declare public image: string;
    declare public name: string;
    declare public description: string;
    declare public spellcasting_properties: SpellcastingProperties | null;
    declare public features: Features[];
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

WorkshopClassSub.init({
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
        type: DataTypes.STRING(100),
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
    spellcasting_properties: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    features: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
}, {
    sequelize,
    modelName: 'WorkshopClassSub',
    tableName: 'workshop_class_subs',
    timestamps: true,
    underscored: true,
});

export default WorkshopClassSub;
