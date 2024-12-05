const express = require("express");
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const uuid4 = require('uuid4');
const axios = require('axios');

const client_id = process.env.NAVER_CLIENT_ID;
const client_secret = process.env.NAVER_CLIENT_SECRET;
const redirectURI = encodeURI(process.env.NAVER_CALLBACK_URL);

const router = express.Router();

const { User } = require('../models');
const { Op } = require('sequelize');

// 저장 경로와 파일 이름 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'media/profile/'); // 파일 저장 폴더
    },
    filename(req, file, cb) {
        const randomID = uuid4();
        const ext = path.extname(file.originalname);
        const filename = randomID + ext;
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: File type not supported!');
        }
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['email', 'nickname', 'profileImage']
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 프론트에서 code와 state를 받아 쿼리 스트링에 담아 이 api를 호출해야 함
router.get('/oauth/login', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const access_token_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`;
    console.log('안녕');
    try {
        const token_res = await axios.get(access_token_url, {
            headers: {
                'X-Naver-Client-Id': client_id,
                'X-Naver-Client-Secret': client_secret
            }
        });

        // 요청이 제대로 되었을 경우 access_token을 발급함
        // access_token을 'Bearer <토큰>'의 형식으로 네이버에 유저 정보 요청
        const access_token = token_res.data.access_token
        const header = `Bearer ${access_token}`; // Bearer 다음에 공백 추가
        const user_info_url = 'https://openapi.naver.com/v1/nid/me';

        const user_info = await axios.get(user_info_url, {
            headers: {
                'Authorization': header
            }
        });

        const email = user_info.data.response.email;
        const nickname = user_info.data.response.nickname;
        const profile_image = user_info.data.response.profile_image;

        const user = await User.findOne({
            attributes: ['email'],
            where: { email: email }
        });

        // user_info가 db에 있으면(email로 검색) => 로그인
        // user_info가 db에 없으면(email로 검색) => 회원가입
        if (user == null) {
            // 비밀번호 해시를 위한 솔트
            const salt = crypto.randomBytes(128).toString('base64');
            const hashPassword = crypto.createHash('sha512').update(email + nickname + profile_image + salt).digest('hex');

            // 사용자 생성
            const createdUser = await User.create({
                email,
                password: hashPassword,
                passwordSalt: salt,
                nickname,
                profileImage: profile_image,
            });

            // 성공 응답
            res.status(201).json({
                message: 'user가 생성되었습니다.',
                detail: createdUser
            });
        }
        else {
            // 성공 응답
            res.status(200).json({
                message: '로그인 성공',
                detail: `${nickname}님이 로그인 성공했습니다!`
            });
        }

        ///////
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
            res.status(error.response.status).json({ message: error.response.data });
        } else {
            console.error('Error message:', error.message);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
});
module.exports = router;
