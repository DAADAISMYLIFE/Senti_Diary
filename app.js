const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require('morgan');


const { sequelize } = require("./models");
const userRouter = require("./routes/userRouter.js");
const diaryRouter = require("./routes/diaryRouter.js");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); //개발
app.use(morgan('combined')); //배포

app.use('/media', express.static('media'));


sequelize.sync({ force: false })
    .then(() => {
        console.log("DB 연결 성공");
    })
    .catch((err) => {
        console.log(err);
    });

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

app.get('/media/:file', (req, res) => {
    const filename = req.params.file;
    const filePath = path.join(__dirname, 'media', filename);

    // MIME 타입을 설정
    res.setHeader('Content-Type', 'image/jpeg');  // 예: JPEG 이미지
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('File not found');
        }
    });
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