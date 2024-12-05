const Sequelize = require('sequelize');

// 다이어리 모델
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
        // 다이어리 감정 관계 추가
        db.Diary.belongsToMany(db.EmotionTag, { through: 'DiaryEmotion', foreignKey: 'diaryId' });
    }
}

module.exports = Diary;