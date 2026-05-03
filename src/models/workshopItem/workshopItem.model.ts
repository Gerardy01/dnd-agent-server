import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

// interfaces
import { AdditionalProperties, ArmorProperties, ItemBonus, ModifierBonus, WeaponProperties } from "@/interfaces/IItem";

// models
import Account from "@/models/account/account.model";

class WorkshopItem extends Model {
    declare public workshop_item_id: number;
    declare public account_id: string;
    declare public image: string;
    declare public name: string;
    declare public type: string;
    declare public description: string;
    declare public appearance: string;
    declare public category: string;
    declare public rarity: string;
    declare public is_magic_item: boolean;
    declare public weight: number;
    declare public cost: number;
    declare public currency_unit: string;
    declare public equip_slot: string;
    declare public weapon_properties: WeaponProperties | null;
    declare public armor_properties: ArmorProperties | null;
    declare public additional_properties: AdditionalProperties;
    declare public flat_bonus: ItemBonus | null;
    declare public override_bonus: ItemBonus | null;
    declare public modifier_bonus: ModifierBonus[] | null;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

WorkshopItem.init({
    workshop_item_id: {
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
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    appearance: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rarity: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_magic_item: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currency_unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    equip_slot: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    weapon_properties: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    armor_properties: {
        type: DataTypes.JSONB,
        allowNull: true,
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
    flat_bonus: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    override_bonus: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    modifier_bonus: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'WorkshopItem',
    tableName: 'workshop_items',
    timestamps: true,
    underscored: true,
});

export default WorkshopItem;
