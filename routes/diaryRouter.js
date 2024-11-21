const express = require("express");
const router = express.Router();

const { Diary } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
    try {
        const diaries = await Diary.findAll({
            attributes: ['userId', 'title', 'title', 'content']
        });
        res.status(200).json(diaries)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const jsonData = req.body;
        const createdDiary = await Diary.create({
            userId: 4,
            title: jsonData.title,
            content: jsonData.content,
            viewScope: jsonData.viewScope,
        })

        console.log(jsonData.title);

        // 응답으로 받은 데이터를 다시 전송합니다.
        res.status(200).json({
            message: 'diary가 생성되었습니다.'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;