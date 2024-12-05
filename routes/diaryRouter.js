const express = require("express");
const router = express.Router();

const { Diary, Weather, DiaryEmotion, EmotionTag } = require('../models');
const { Op } = require('sequelize');


router.route('/')
    // 다이어리 목록 조회
    .get(async (req, res) => {
        try {
            const diaries = await Diary.findAll({
                attributes: ['id', 'userId', 'title', 'view_scope', 'created_at', 'updated_at'],
                include: [
                    {
                        model: Weather,
                        attributes: ['icon'],
                    },
                    {
                        model: EmotionTag, // EmotionTag를 포함
                        attributes: ['id', 'name'], // 감정의 id와 name 필드만 포함
                        through: { attributes: [] } // DiaryEmotion 중간 테이블의 데이터는 제외
                    }
                ],
                order: [['created_at', 'DESC']],
            });

            res.status(200).json(diaries);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })
    // 다이어리 작성
    .post(async (req, res) => {
        try {
            const jsonData = req.body;
            const createdDiary = await Diary.create({
                userId: 1, // TODO : 로그인 구현 이후 유저 아이디 넣기
                title: jsonData.title,
                content: jsonData.content,
                weatherId: jsonData.weather,
                viewScope: jsonData.viewScope,
            });

            console.log(jsonData);

            // DiaryEmotion 테이블에 연결된 감정 태그 추가
            if (jsonData.emotion && Array.isArray(jsonData.emotion)) {
                // emotion 필드가 배열일 경우 처리
                const emotionIds = jsonData.emotion; // emotion 배열: [1, 2, 3]
                await createdDiary.addEmotionTags(emotionIds);
            }

            // 응답으로 받은 데이터를 다시 전송합니다.
            res.status(201).json({
                message: 'diary가 생성되었습니다.',
                diary: createdDiary
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


router.route('/:id')
    // 다이어리 개별 조회
    .get(async (req, res) => {
        try {
            const diary = await Diary.findOne({
                attributes: ['userId', 'title', 'content', 'view_scope', 'created_at', 'updated_at'],
                include: [{
                    model: Weather,
                    attributes: ['icon']
                }, {
                    model: EmotionTag,
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }],
                where: { id: req.params.id }
            });

            if (!diary) {
                return res.status(404).json({ error: 'Diary not found' });
            }

            res.status(200).json(diary);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

    // 다이어리 수정
    .put(async (req, res) => {
        try {
            const diaryId = req.params.id;
            const updateData = req.body;

            const diary = await Diary.update(updateData, { where: { id: diaryId } });

            res.status(200).json(diary);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

    // 다이어리 삭제
    .delete(async (req, res) => {
        try {
            const diaryId = req.params.id;
            const diary = await Diary.destroy({ where: { id: diaryId } });

            res.status(200).json({ 'detail': '삭제 되었습니다.' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })
module.exports = router;