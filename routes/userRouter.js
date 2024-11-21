const express = require("express");
const router = express.Router();

const { User } = require('../models');
const { Op } = require('sequelize');


router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['email', 'nickname']
        });
        res.status(200).json(users)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const jsonData = req.body;
        const createdUser = await User.create({
            email: jsonData.email,
            password: jsonData.password,
            nickname: jsonData.nickname,
            profileImage: jsonData.profileImage || ""
        })

        // 응답으로 받은 데이터를 다시 전송합니다.
        res.status(200).json({
            message: 'user가 생성되었습니다.'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;