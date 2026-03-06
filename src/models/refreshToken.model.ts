import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

// models
import Account from "@/models/account.model";

class RefreshToken extends Model {
    declare public id: number;
    declare public account_id: string;
    declare public token_expiry_date: Date;
    declare public is_revoked: boolean;
    declare public user_agent: string;
    declare public identifier: string;
    declare public readonly created_at: Date;
}

RefreshToken.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
    token_expiry_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_agent: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_revoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    identifier: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: true,
    underscored: true,
    updatedAt: false,
});

export default RefreshToken;