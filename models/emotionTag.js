const Sequelize = require('sequelize');

// 감정 태그 모델
class EmotionTag extends Sequelize.Model {
    static initiate(sequelize) {
        EmotionTag.init({
            name: {
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
        db.EmotionTag.belongsToMany(db.Diary, { through: 'DiaryEmotion', foreignKey: 'emotionTagId' });
    };
}

module.exports = EmotionTag;