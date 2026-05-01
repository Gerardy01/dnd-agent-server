import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

// models
import Account from "@/models/account.model";

// interfaces
import { MonsterAction, MonsterSenses, MonsterSpeed, MonsterStats, AdditionalProperties } from "@/interfaces/IMonster";

class WorkshopMonster extends Model {
    declare public workshop_monster_id: number;
    declare public account_id: string;
    declare public image: string;
    declare public name: string;
    declare public alignment: string;
    declare public size: string;
    declare public type: string;
    declare public description: string;
    declare public appearance: string;
    declare public languages: string;
    declare public speed: MonsterSpeed;
    declare public senses: MonsterSenses;
    declare public stats: MonsterStats;
    declare public additional_properties: AdditionalProperties;
    declare public actions: MonsterAction[];
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

WorkshopMonster.init({
    workshop_monster_id: {
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
    alignment: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    size: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    appearance: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    languages: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    speed: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
            walk: 0,
            burrow: 0,
            climb: 0,
            fly: 0,
            swim: 0,
        }
    },
    senses: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
            blindsight: 0,
            darkvision: 0,
            tremorsense: 0,
            truesight: 0,
        }
    },
    stats: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
            min_hp: 0,
            max_hp: 0,
            ac: 10,
            cr: 0,
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10,
        }
    },
    additional_properties: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
            immunities: [],
            resistances: [],
            vulnerabilities: [],
            conditionImmunities: [],
        }
    },
    actions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
    },
}, {
    sequelize,
    modelName: 'WorkshopMonster',
    tableName: 'workshop_monsters',
    timestamps: true,
    underscored: true,
});

export default WorkshopMonster;
