import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

// types and interfaces
import { AttackProperties, SpellSaveProperties } from "@/interfaces/ISpell";

// models
import Account from "@/models/account/account.model";

class WorkshopSpell extends Model {
    declare public workshop_spell_id: number;
    declare public account_id: string;
    declare public image: string | null;
    declare public name: string;
    declare public description: string;
    declare public level: number;
    declare public range: number;
    declare public school: string;
    declare public attack_properties: AttackProperties | null;
    declare public spell_save_properties: SpellSaveProperties | null;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

WorkshopSpell.init({
    workshop_spell_id: {
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
        onDelete: 'CASCADE',
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
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    range: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    school: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    attack_properties: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    spell_save_properties: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'WorkshopSpell',
    tableName: 'workshop_spells',
    timestamps: true,
    underscored: true,
});

export default WorkshopSpell;
