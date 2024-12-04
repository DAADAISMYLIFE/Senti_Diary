const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require('morgan');
const axios = require('axios');

var client_id = process.env.NAVER_CLIENT_ID;
var client_secret = process.env.NAVER_CLIENT_SECRET;
var state = "RANDOM_STATE";
var redirectURI = encodeURI(process.env.NAVER_CALLBACK_URL);
var api_url = "";

const { sequelize } = require("./models");
const userRouter = require("./routes/userRouter.js");
const diaryRouter = require("./routes/diaryRouter.js");
const weatherRouter = require("./routes/weatherRouter.js");
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
app.use('/api/v1/users', userRouter);

// 일기 관련 URL
app.use('/api/v1/diaries', diaryRouter);

// 날씨 관련 URL
app.use('/api/v1/weather', weatherRouter);
app.get('/naverlogin', (req, res) => {
    api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end("<a href='" + api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
});
app.get('/callback', async (req, res) => {
    console.log("Hello World");
    const code = req.query.code;
    const state = req.query.state;
    const api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`;

    try {
        const response = await axios.get(api_url, {
            headers: {
                'X-Naver-Client-Id': client_id,
                'X-Naver-Client-Secret': client_secret
            }
        });
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
        res.end(JSON.stringify(response.data));
    } catch (error) {
        res.status(error.response ? error.response.status : 500).end();
        console.log('error = ' + (error.response ? error.response.status : 'Unknown error'));
    }
});


app.get('/member', async (req, res) => {
    const token = req.body.access_token;
    const header = `Bearer ${token}`; // Bearer 다음에 공백 추가
    const api_url = 'https://openapi.naver.com/v1/nid/me';

    try {
        const response = await axios.get(api_url, {
            headers: { 'Authorization': header }
        });
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
        res.end(JSON.stringify(response.data));
    } catch (error) {
        console.log('error');
        if (error.response) {
            res.status(error.response.status).end();
            console.log('error = ' + error.response.status);
        } else {
            res.status(500).end();
            console.log('error = Unknown error');
        }
    }
});

// 이외의 URL 404 처리
app.use((req, res, next) => {
    res.status(404).send("404 NOT FOUND!");
});

// 500 서버 에러
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('에러');
})


app.listen(process.env.PORT || 3000, () => {
    console.log('http://localhost:3000 로 서버 실행 중...');
});