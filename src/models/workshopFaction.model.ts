import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

// models
import Account from "@/models/account.model";

class WorkshopFaction extends Model {
    declare public workshop_faction_id: number;
    declare public account_id: string;
    declare public image: string | null;
    declare public name: string;
    declare public description: string;
    declare public color: string;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

WorkshopFaction.init({
    workshop_faction_id: {
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
    color: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'WorkshopFaction',
    tableName: 'workshop_factions',
    timestamps: true,
    underscored: true,
});

export default WorkshopFaction;
