const express = require("express");
const multer = require('multer');
const path = require('path');

const router = express.Router();

const { Weather } = require('../models');
const { Op } = require('sequelize');

// 저장 경로와 파일 이름 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'media/weather_icon/'); // 파일 저장 폴더
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
        const weather = await Weather.findAll({
            attributes: ['id', 'name', 'icon']
        });
        res.status(200).json(weather);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
