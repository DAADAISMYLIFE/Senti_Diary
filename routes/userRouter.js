const express = require("express");
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const uuid4 = require('uuid4');

const router = express.Router();

const { User } = require('../models');
const { Op } = require('sequelize');


// 저장 경로와 파일 이름 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'media/'); // 파일 저장 폴더
    },
    filename(req, file, cb) {
        const randomID = uuid4();
        const ext = path.extname(file.originalname);
        const filename = randomID + ext;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['email', 'nickname', 'profileImage']
        });
        res.status(200).json(users)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
        const { email, password, nickname } = req.body;
        const profileImageUrl = null;
        console.log(req.file)
        if (req.file != null) {
            // 업로드된 파일 경로 처리
            profileImageUrl = `http://localhost:8000/media/${req.file.filename}` // 파일 경로
        }
        //비밀번호 해시를 위한 솔트
        const salt = crypto.randomBytes(128).toString('base64');
        const hashPassword = crypto.createHash('sha512').update(password + salt).digest('hex');

        // 사용자 생성
        const createdUser = await User.create({
            email,
            password: hashPassword,
            passwordSalt: salt,
            nickname,
            profileImage: profileImageUrl,
        });

        // 성공 응답
        res.status(200).json({
            message: 'user가 생성되었습니다.',
            detail: createdUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;