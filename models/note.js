module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('Note', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        folderId: { //Khóa ngoại liên kết với Bảng Folders
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Folders', // Tên bảng (số nhiều)
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT // Dùng TEXT cho nội dung dài
        },
        tags: {
            type: DataTypes.JSON, // Lưu trữ tags dưới dạng JSON array
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'active', // 'active', 'trashed'
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Note.associate = (models) => {
        Note.belongsTo(models.Folder, {
            foreignKey: 'folderId',
            as: 'folder'
        });
    };

    return Note;
};