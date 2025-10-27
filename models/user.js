module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: {
                msg: 'Địa chỉ email đã tồn tại trong hệ thống.'
            },
            allowNull: false,
            validate: { 
                isEmail: {
                    msg: "Địa chỉ email không hợp lệ."
                },
                notNull: {
                    msg: "Email là trường bắt buộc."
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { 
                len: {
                    args: [6, 255],
                    msg: "Mật khẩu phải dài từ 6 đến 255 ký tự."
                },
                notNull: {
                    msg: "Mật khẩu là trường bắt buộc."
                }
            }
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Họ tên không được để trống."
                }
            }
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
    User.associate = (models) => {
        User.hasMany(models.Note, {
            foreignKey: 'userId',
            as: 'notes'
        });
        User.hasMany(models.SharedNote, {
            foreignKey: 'sharedWithUserId',
            as: 'receivedSharedNotes'
        });
    };

    return User;
};