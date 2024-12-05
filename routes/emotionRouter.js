const express = require("express");
const path = require('path');

const router = express.Router();

const { EmotionTag } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
    try {
        const emotionTag = await EmotionTag.findAll({
            attributes: ['id', 'name']
        });
        res.status(200).json(emotionTag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
