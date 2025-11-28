// File: models/folder.js
module.exports = (sequelize, DataTypes) => {
    const Folder = sequelize.define('Folder', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: { // <-- Khóa ngoại liên kết với Bảng Users
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Tên bảng (số nhiều)
                key: 'id'
            }
        }
    }, {
        timestamps: true // Tự động thêm createdAt/updatedAt
    });

    Folder.associate = (models) => {
        // Một Thư mục (Folder) thuộc về một Người dùng (User)
        Folder.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        // Một Thư mục (Folder) có nhiều Ghi chú (Note)
        Folder.hasMany(models.Note, {
            foreignKey: 'folderId',
            as: 'notes',
            onDelete: 'CASCADE' // Nếu xóa Thư mục, xóa hết Note bên trong
        });
    };

    return Folder;
};