'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workshop_items', {
      workshop_item_id: {
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
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      appearance: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rarity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_magic_item: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      cost: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currency_unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      equip_slot: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      weapon_properties: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      armor_properties: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      additional_properties: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          immunities: [],
          resistances: [],
          vulnerabilities: [],
          conditionImmunities: [],
        }
      },
      flat_bonus: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      override_bonus: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      modifier_bonus: {
        type: Sequelize.JSONB,
        allowNull: true,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('workshop_items');
  }
};
