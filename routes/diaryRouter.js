const express = require("express");
const router = express.Router();

const { Diary, Weather } = require('../models');
const { Op } = require('sequelize');


router.route('/')
    .get(async (req, res) => {
        try {
            const diaries = await Diary.findAll({
                attributes: ['userId', 'title', 'content', 'view_scope'],
                include: [{
                    model: Weather,
                    attributes: ['icon']
                }]
            });
            res.status(200).json(diaries);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

    // 다이어리 작성
    .post(async (req, res) => {
        try {
            const jsonData = req.body;
            console.log(jsonData.title)
            console.log(jsonData.content)
            console.log(jsonData.weather)
            console.log(jsonData.viewScope)
            const createdDiary = await Diary.create({
                userId: 1, // 사용자 ID는 실제 사용자에 맞게 수정해야 합니다.
                title: jsonData.title,
                content: jsonData.content,
                weatherId: jsonData.weather, // 날씨 정보를 추가
                viewScope: jsonData.viewScope,
            });

            console.log(jsonData.title);

            // 응답으로 받은 데이터를 다시 전송합니다.
            res.status(200).json({
                message: 'diary가 생성되었습니다.',
                detail: createdDiary
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


module.exports = router;