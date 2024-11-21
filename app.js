const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { sequelize } = require("./models");
const userRouter = require("./routes/userRouter.js");
const diaryRouter = require("./routes/diaryRouter.js");
const app = express();
app.use(express.json());

sequelize.sync({ force: false })
    .then(() => {
        console.log("DB 연결 성공");
    })
    .catch((err) => {
        console.log(err);
    });

// 메인 랜딩 페이지
app.get('/', (req, res) => {
    res.send("Hello NodeJS");
});

// 유저 관련 URL
app.use('/users', userRouter);

// 일기 관련 URL
app.use('/diaries', diaryRouter);

// 이외의 URL 404 처리
app.use((req, res, next) => {
    res.status(404).send("404 NOT FOUND!");
});



app.listen(8000, () => {
    console.log('http://localhost:8000 로 서버 실행 중...');
});