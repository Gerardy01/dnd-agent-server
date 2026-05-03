import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

import WorkshopClassSub from "@/models/workshopClass/workshopClassSub.model";
import WorkshopSpell from "@/models/workshopSpell/workshopSpell.model";

class WorkshopClassSubSpell extends Model {
    declare public id: number;
    declare public workshop_class_sub_id: number;
    declare public workshop_spell_id: number;
}

WorkshopClassSubSpell.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    workshop_class_sub_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: WorkshopClassSub,
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    workshop_spell_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: WorkshopSpell,
            key: 'workshop_spell_id',
        },
        onDelete: 'CASCADE'
    },
}, {
    sequelize,
    modelName: 'WorkshopClassSubSpell',
    tableName: 'workshop_class_sub_spells',
    timestamps: false,
    underscored: true,
});

export default WorkshopClassSubSpell;
