'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workshop_monsters', {
      workshop_monster_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      alignment: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      size: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      appearance: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      languages: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      speed: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      senses: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      stats: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      additional_properties: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      actions: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('workshop_monsters');
  }
};
