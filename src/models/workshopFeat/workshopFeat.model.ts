import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

// models
import Account from "@/models/account/account.model";

class WorkshopFeat extends Model {
    declare public workshop_feat_id: number;
    declare public account_id: string;
    declare public image: string;
    declare public name: string;
    declare public description: string;
    declare public category: string;
    declare public min_level: number | null;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

WorkshopFeat.init({
    workshop_feat_id: {
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
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    min_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: "WorkshopFeat",
    tableName: "workshop_feats",
    timestamps: true,
    underscored: true,
});

export default WorkshopFeat;