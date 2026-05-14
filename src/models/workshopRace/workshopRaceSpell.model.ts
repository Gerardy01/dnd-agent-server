import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/database";

import WorkshopRace from "@/models/workshopRace/workshopRace.model";
import WorkshopSpell from "@/models/workshopSpell/workshopSpell.model";

class WorkshopRaceSpell extends Model {
    declare public id: number;
    declare public workshop_race_id: number;
    declare public workshop_spell_id: number;
}

WorkshopRaceSpell.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    workshop_race_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: WorkshopRace,
            key: 'workshop_race_id',
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
    modelName: 'WorkshopRaceSpell',
    tableName: 'workshop_race_spells',
    timestamps: false,
    underscored: true,
});

export default WorkshopRaceSpell;
