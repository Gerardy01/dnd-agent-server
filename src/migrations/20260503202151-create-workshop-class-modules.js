'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. workshop_classes
    await queryInterface.createTable('workshop_classes', {
      workshop_class_id: {
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
      hit_die: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      subclass_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      spellcasting_properties: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      features: {
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

    // 2. workshop_class_subs
    await queryInterface.createTable('workshop_class_subs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      workshop_class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workshop_classes',
          key: 'workshop_class_id',
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
      spellcasting_properties: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      features: {
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

    // 3. workshop_class_resources
    await queryInterface.createTable('workshop_class_resources', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      workshop_class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workshop_classes',
          key: 'workshop_class_id',
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
      color: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      max_per_level: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      resource_recovery: {
        type: Sequelize.JSONB,
        allowNull: false,
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

    // 4. workshop_class_sub_resources
    await queryInterface.createTable('workshop_class_sub_resources', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      workshop_class_sub_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workshop_class_subs',
          key: 'id',
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
      color: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      max_per_level: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      resource_recovery: {
        type: Sequelize.JSONB,
        allowNull: false,
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

    // 5. workshop_class_spells
    await queryInterface.createTable('workshop_class_spells', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      workshop_class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workshop_classes',
          key: 'workshop_class_id',
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

    // 6. workshop_class_sub_spells
    await queryInterface.createTable('workshop_class_sub_spells', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      workshop_class_sub_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workshop_class_subs',
          key: 'id',
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
    await queryInterface.dropTable('workshop_class_sub_spells');
    await queryInterface.dropTable('workshop_class_spells');
    await queryInterface.dropTable('workshop_class_sub_resources');
    await queryInterface.dropTable('workshop_class_resources');
    await queryInterface.dropTable('workshop_class_subs');
    await queryInterface.dropTable('workshop_classes');
  }
};
