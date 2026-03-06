'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('refresh_tokens', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                unique: true,
                allowNull: false,
                autoIncrement: true,
            },
            account_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'accounts',
                    key: 'account_id',
                },
                onDelete: 'CASCADE',
            },
            token_expiry_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            user_agent: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            is_revoked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            identifier: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('now'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('refresh_tokens');
    },
};
