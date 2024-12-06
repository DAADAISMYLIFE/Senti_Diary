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

// 유저 목록 조회
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
    const { code, state } = req.query;

    try {
        // 토큰 요청 (POST 메서드 사용)
        const token_res = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: client_id,
                client_secret: client_secret,
                redirect_uri: redirectURI,
                code: code,
                state: state
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const access_token = token_res.data.access_token;
        const header = `Bearer ${access_token}`;

        // 사용자 정보 요청
        const user_info = await axios.get('https://openapi.naver.com/v1/nid/me', {
            headers: {
                'Authorization': header
            }
        });

        const { email, nickname, profile_image } = user_info.data.response;

        // 사용자 찾기 또는 생성
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // 회원가입 로직
            const salt = crypto.randomBytes(128).toString('base64');
            const hashPassword = crypto.createHash('sha512')
                .update(email + nickname + profile_image + salt)
                .digest('hex');

            user = await User.create({
                email,
                password: hashPassword,
                passwordSalt: salt,
                nickname,
                profileImage: profile_image,
            });

            // // JWT 토큰 발행
            // const token = jwt.sign(
            //     { id: user.id, email: user.email },
            //     process.env.JWT_SECRET,
            //     { expiresIn: '1h' }
            // );

            return res.status(201).json({
                message: '회원가입이 완료되었습니다!',
                // token,
                user: { id: user.id, email, nickname, profile_image }
            });
        }

        // // 로그인 로직
        // const token = jwt.sign(
        //     { id: user.id, email: user.email },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '1h' }
        // );

        res.status(200).json({
            message: '로그인 성공',
            // token,
            user: { id: user.id, email, nickname, profile_image }
        });

    } catch (error) {
        console.error('OAuth 로그인 중 에러:', error);

        // 상세한 에러 로깅
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
        }

        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
            error: error.message
        });
    }
});
module.exports = router;
