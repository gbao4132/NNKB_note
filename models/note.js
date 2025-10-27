module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('Note', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', 
                key: 'id'
            },
            validate: {
                notNull: {
                    msg: "Ghi chú phải có người sở hữu (userId)."
                }
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { 
                notEmpty: {
                    msg: "Tiêu đề ghi chú không được để trống."
                },
                len: {
                    args: [3, 255],
                    msg: "Tiêu đề phải dài từ 3 đến 255 ký tự."
                }
            }
        },
        content: {
            type: DataTypes.TEXT
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {});

    // Định nghĩa mối quan hệ
    Note.associate = (models) => {
        Note.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'owner'
        });
        Note.hasMany(models.SharedNote, {
            foreignKey: 'noteId',
            as: 'shares'
        });
    };

    return Note;
};