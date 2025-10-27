'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // KHÓA NGOẠI: userId trỏ đến bảng Users (Mối quan hệ 1-n)
      userId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'Users', // Tên bảng đích
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Xóa User thì xóa hết Note của họ
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Notes');
  }
};