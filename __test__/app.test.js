// app.test.js
const request = require('supertest');
const express = require('express');
const axios = require('axios');
const app = require('../app'); // app.js 파일을 가져옵니다.

describe('API 테스트', () => {
    // 메인 랜딩 페이지 테스트
    test('GET / 응답 확인', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Hello NodeJS');
    });

    // 404 테스트
    test('존재하지 않는 URL에 대한 404 응답', async () => {
        const response = await request(app).get('/non-existent-url');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('404 NOT FOUND!');
    });
});

describe('Diary API 테스트', () => {
    let diaryId;

    test('GET /api/v1/diaries 응답 확인', async () => {
        // 구현된 부분 실행해서 리턴값 가져옴
        const response = await request(app).get('/api/v1/diaries');

        //나는 200 응답을 받기를 기대한다.
        expect(response.status).toBe(200);

        // 응답의 body가 배열이기를 기대한다.
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/v1/diaries 응답 확인', async () => {

        // 내가 요청에 넣을 값들
        const newDiary = {
            title: 'Test Diary',
            content: 'This is a test diary.',
            weather: 1,
            viewScope: true,
            emotion: [1, 2],
        };

        // 구현된 부분 실행해서 리턴값 가져옴
        const response = await request(app).post('/api/v1/diaries').send(newDiary);

        // 200 : OK
        // 201 : CREATE
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('diary가 생성되었습니다.');
        diaryId = response.body.diary.id;
    });

    test('GET /api/v1/diaries/:id 응답 확인', async () => {
        const response = await request(app).get(`/api/v1/diaries/${diaryId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(diaryId);
    });

    test('PUT /api/v1/diaries/:id 응답 확인', async () => {
        const updatedDiary = {
            title: '수정된 다이어리 제목',
            content: '해당 다이어리는 수정되었습니다.',
        };

        const response = await request(app).put(`/api/v1/diaries/${diaryId}`).send(updatedDiary);
        expect(response.status).toBe(200);
        expect(response.body[0]).toBe(1);
    });

    test('DELETE /api/v1/diaries/:id 응답 확인', async () => {
        const response = await request(app).delete(`/api/v1/diaries/${diaryId}`);
        expect(response.status).toBe(200);
        expect(response.body.detail).toBe('삭제 되었습니다.');
    });
});
