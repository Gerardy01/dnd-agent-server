import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

// interfaces
import { SpellcastingProperties } from "@/interfaces/IClass";
import { Traits } from "@/interfaces/IRace";

// models
import Account from "@/models/account/account.model";

class WorkshopRace extends Model {
    declare public workshop_race_id: number;
    declare public account_id: string;
    declare public name: string;
    declare public image: string;
    declare public description: string;
    declare public speed: number;
    declare public language: string;
    declare public spellcasting_properties: SpellcastingProperties | null;
    declare public traits: Traits[];
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

WorkshopRace.init({
    workshop_race_id: {
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
    speed: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    language: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    spellcasting_properties: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    traits: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
}, {
    sequelize,
    modelName: 'WorkshopRace',
    tableName: 'workshop_races',
    timestamps: true,
    underscored: true,
});

export default WorkshopRace;
