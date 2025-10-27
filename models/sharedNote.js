module.exports = (sequelize, DataTypes) => {
    const SharedNote = sequelize.define('SharedNote', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        noteId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Notes',
                key: 'id'
            },
            validate: { notNull: { msg: "Mục chia sẻ phải có noteId." } }
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            validate: { notNull: { msg: "Mục chia sẻ phải có ownerId." } }
        },
        sharedWithUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            validate: { notNull: { msg: "Mục chia sẻ phải có sharedWithUserId." } }
        },
        permission: {
            type: DataTypes.ENUM('read', 'edit'), 
            defaultValue: 'read',
            allowNull: false,
            validate: { 
                isIn: {
                    args: [['read', 'edit']],
                    msg: "Quyền truy cập phải là 'read' hoặc 'edit'."
                },
                notNull: {
                    msg: "Quyền truy cập là trường bắt buộc."
                }
            }
        },
        sharedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, { 
        timestamps: false, 
        
        // Ràng buộc duy nhất
        uniqueKeys: {
            shared_note_unique: {
                fields: ['noteId', 'sharedWithUserId']
            }
        }
    });

    // Định nghĩa mối quan hệ
    SharedNote.associate = (models) => {
        SharedNote.belongsTo(models.Note, {
            foreignKey: 'noteId',
            as: 'note'
        });
        SharedNote.belongsTo(models.User, {
            foreignKey: 'sharedWithUserId',
            as: 'sharedWith'
        });
        SharedNote.belongsTo(models.User, {
            foreignKey: 'ownerId',
            as: 'owner'
        });
    };

    return SharedNote;
};