import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

// interfaces
import { Features, SpellcastingProperties } from "@/interfaces/IClass";

// models
import Account from "@/models/account/account.model";

class WorkshopClass extends Model {
    declare public workshop_class_id: number;
    declare public account_id: string;
    declare public name: string;
    declare public image: string;
    declare public description: string;
    declare public hit_die: string;
    declare public subclass_level: number;
    declare public spellcasting_properties: SpellcastingProperties | null;
    declare public features: Features[];
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

WorkshopClass.init({
    workshop_class_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    account_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: Account,
            key: 'account_id',
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
    hit_die: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    subclass_level: {
        type: DataTypes.INTEGER,
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
    modelName: 'WorkshopClass',
    tableName: 'workshop_classes',
    timestamps: true,
    underscored: true,
});

export default WorkshopClass;
