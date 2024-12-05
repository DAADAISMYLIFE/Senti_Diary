const User = require('./user');
const Diary = require('./diary');
const Weather = require('./weather');
const EmotionTag = require('./emotionTag');
const SummaryTag = require('./summaryTag');


const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development_sqlite';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Diary = Diary;
db.Weather = Weather;
db.EmotionTag = EmotionTag;
db.SummaryTag = SummaryTag;


User.initiate(sequelize);
Diary.initiate(sequelize);
Weather.initiate(sequelize);
EmotionTag.initiate(sequelize);
SummaryTag.initiate(sequelize);

Diary.associate(db);
EmotionTag.associate(db);
SummaryTag.associate(db);

module.exports = db;
