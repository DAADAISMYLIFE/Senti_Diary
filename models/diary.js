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
                    model: 'Users', // 연결된 테이블 이름 (User 모델의 테이블 이름) 
                    key: 'id'
                },
                onDelete: 'CASCADE', // 연관된 사용자 삭제 시 다이어리도 삭제 
                onUpdate: 'CASCADE'
            },

            // 날씨 외래키 연결해야함
            weatherId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Weathers', // 연결된 테이블 이름 (Weather 모델의 테이블 이름)
                    key: 'id'
                },
                onDelete: 'SET NULL', // 연관된 날씨가 삭제되도 유지되어야 함
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
        db.Diary.hasOne(db.Weather, { foreignKey: 'weatherId', targetKey: 'id' });

    }
}

module.exports = Diary;