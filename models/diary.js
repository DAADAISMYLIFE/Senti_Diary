const Sequelize = require('sequelize');

// 유저 모델
class Diary extends Sequelize.Model {
    static initiate(sequelize) {
        Diary.init({
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            viewScope: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },

            lat: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },

            lng: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            userId: { // userId 외래 키 필드 추가
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', 
                    key: 'id'
                },
                onDelete: 'CASCADE',  
                onUpdate: 'CASCADE'
            },

            // 날씨 외래키 연결해야함
            weatherId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Weather', 
                    key: 'id'
                },
                onDelete: 'SET NULL',
                onUpdate: 'SET NULL'
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
        db.Diary.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
        db.Diary.belongsTo(db.Weather, { foreignKey: 'weatherId', targetKey: 'id' });

    }
}

module.exports = Diary;