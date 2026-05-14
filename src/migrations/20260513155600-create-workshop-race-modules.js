'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. workshop_races
    await queryInterface.createTable('workshop_races', {
      workshop_race_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      account_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'account_id',
        },
        onDelete: 'CASCADE'
      },
      image: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      speed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      language: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      spellcasting_properties: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      traits: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      }
    });

    // 2. workshop_race_spells
    await queryInterface.createTable('workshop_race_spells', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      workshop_race_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workshop_races',
          key: 'workshop_race_id',
        },
        onDelete: 'CASCADE'
      },
      workshop_spell_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workshop_spells',
          key: 'workshop_spell_id',
        },
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('workshop_race_spells');
    await queryInterface.dropTable('workshop_races');
  }
};
