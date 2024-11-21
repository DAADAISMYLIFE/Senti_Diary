const express = require("express");
const app = express();

app.get('/', (req,res)=>{
    res.send("Hello NodeJS");
});

app.listen(8000, ()=>{
    console.log('http://localhost:8000 로 서버 실행 중...');
});