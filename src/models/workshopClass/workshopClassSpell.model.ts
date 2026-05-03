import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

import WorkshopClass from "@/models/workshopClass/workshopClass.model";
import WorkshopSpell from "@/models/workshopSpell/workshopSpell.model";

class WorkshopClassSpell extends Model {
    declare public id: number;
    declare public workshop_class_id: number;
    declare public workshop_spell_id: number;
}

WorkshopClassSpell.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    workshop_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: WorkshopClass,
            key: 'workshop_class_id',
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
    modelName: 'WorkshopClassSpell',
    tableName: 'workshop_class_spells',
    timestamps: false,
    underscored: true,
});

export default WorkshopClassSpell;
