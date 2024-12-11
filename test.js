async function testAIAPI() {
    const apiKey = 'API_KEY';
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const requestBody = {
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: `
            당신은 한국어로만 응답하는 유능한 비서입니다. 사용자의 일기에 대해 반드시 아래 형식으로 응답하세요.
            형식:
            요약: [사용자의 하루일기를 키워드 형태로, 1개~5개 이하로 출력하세요.]
            키워드: [일기에서 나타나는 주요감정을 다음 감정 목록 중에서 1개~3개 선택하여 그 정수로 된 ID를 출력하세요.(기쁨=1, 슬픔=2, 행복=2, 화남=3, 즐거움=4, 행복=5, 불안=6, 아쉬움=7, 우울함=8, 심심함=9)]
            주의: 반드시 위의 형식을 유지하세요.
          `
            },
            {
                role: 'user',
                content: '오늘은 정말 기분이 좋았고, 친구와 함께 시간을 보냈습니다.'
            }
        ],
        temperature: 0.5
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API 응답:', data);

        const result = data.choices[0].message.content;
        console.log('AI 응답 내용:', result);

    } catch (error) {
        console.error('오류 발생:', error);
    }
}

// 테스트 함수 호출
testAIAPI();
