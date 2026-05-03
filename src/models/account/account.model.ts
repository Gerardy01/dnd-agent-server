import { Sequelize, DataType, Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";



class Account extends Model {
    declare public account_id: string;
    declare public username: string;
    declare public email: string;
    declare public password: string;
    declare public archived: boolean;
    declare public readonly created_at: Date;
    declare public readonly updated_at: Date;
}

Account.init({
    account_id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: true,
    underscored: true,
});

export default Account;