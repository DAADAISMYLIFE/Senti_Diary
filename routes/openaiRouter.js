const express = require("express");
const axios = require("axios");
const router = express.Router();

router.route('/')
    .post(async (req, res) => {
        const { content } = req.body; // Extract content from the request body

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const prompt = `
        당신은 한국어로만 응답하는 유능한 비서입니다. 사용자의 일기에 대해 반드시 아래 형식으로 응답하세요.
        형식:
        요약: [사용자의 일기를 간단하게 요약하세요.]
        키워드: [일기에서 나타나는 주요 감정을 다음 감정 목록 중에서 3개 선택하여 출력하세요. (기쁨, 행복, 즐거움, 화남, 불안, 슬픔, 아쉬움, 우울함, 심심함)]

        ${content}
        `;

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const { choices } = response.data;
            console.log(response.data);
            if (choices && choices[0]) {
                const output = choices[0].message.content;

                // Extract summary and keywords
                const summaryMatch = output.match(/요약:\s*(.*)/);
                const keywordsMatch = output.match(/키워드:\s*\[(.*)\]/);

                const summary = summaryMatch ? summaryMatch[1] : "N/A";
                const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [];

                return res.json({
                    summary: summary,
                    keywords: keywords
                });
            } else {
                return res.status(500).json({ error: "Unexpected response from OpenAI" });
            }
        } catch (error) {
            console.error("OpenAI API Error:", error.response?.data || error.message);
            return res.status(500).json({ error: "Failed to process request" });
        }
    });

module.exports = router;
