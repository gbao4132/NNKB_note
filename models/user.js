'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        // TRƯỜNG MỚI ĐÃ THÊM
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Đảm bảo email là duy nhất
            validate: {
                isEmail: true // Tích hợp sẵn kiểm tra email
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true // Tự động thêm createdAt và updatedAt
    });

    User.associate = (models) => {
        // MỐI QUAN HỆ ĐÃ CẬP NHẬT:
        // Một Người dùng (User) có nhiều Thư mục (Folder)
        User.hasMany(models.Folder, {
            foreignKey: 'userId',
            as: 'folders',
            onDelete: 'CASCADE' // Nếu xóa User, xóa hết Folder của họ
        });
    };

    return User;
};