'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SharedNotes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // KHÓA NGOẠI: noteId trỏ đến bảng Notes
      noteId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Notes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
      },
      // KHÓA NGOẠI: ownerId trỏ đến bảng Users (Chủ sở hữu ghi chú)
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // KHÓA NGOẠI: sharedWithUserId trỏ đến bảng Users (Người nhận chia sẻ)
      sharedWithUserId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permission: {
        type: Sequelize.ENUM('read', 'edit'), // Quyền truy cập
        defaultValue: 'read',
        allowNull: false
      },
      sharedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
      // KHÔNG CẦN createdAt/updatedAt mặc định vì chúng ta dùng sharedAt
    });

    // Thêm ràng buộc duy nhất (Unique Constraint) để tránh chia sẻ 1 ghi chú 2 lần cho cùng 1 người
    await queryInterface.addConstraint('SharedNotes', {
      fields: ['noteId', 'sharedWithUserId'],
      type: 'unique',
      name: 'unique_share_per_user_and_note'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SharedNotes');
  }
};