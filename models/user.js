const Sequelize = require('sequelize');

// 유저 모델
class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            passwordSalt: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            nickname: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            profileImage: {
                type: Sequelize.STRING,
                allowNull: true,
            },

        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}
module.exports = User;