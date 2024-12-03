    const Sequelize = require('sequelize');

    // 날씨 모델
    class Weather extends Sequelize.Model {
        static initiate(sequelize) {
            Weather.init({
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },

                icon: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },

            }, {
                sequelize,
                timestamps: true,
                underscored: true,
                charset: 'utf8mb3',
                collate: 'utf8mb3_general_ci',
            });
        }

        static associate(db) {
            db.Weather.hasMany(db.Diary, { foreignKey: 'weatherId', targetKey: 'id' });
        }
    }

    module.exports = Weather;