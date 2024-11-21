require('dotenv').config(); // dotenv 설정 추가
const express = require('express');
const logger = require('./logger'); // logger.js 파일 불러오기

const app = express();

// API 요청 로그
app.use((req, res, next) => {
  logger.info({
    message: 'HTTP Request',
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
  });
  next();
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  logger.error({
    message: 'Error Occurred',
    error: err.message,
    stack: err.stack,
    url: req.url,
  });
  res.status(500).json({ error: 'Internal Server Error' });
});

// 샘플 라우트
app.get('/', (req, res) => {
  //logger.info({ message: 'Root Endpoint Accessed' });
  res.send('CI/CD 꼭 하셔야합니다!');
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  logger.info({ message: `Server started on port ${PORT}` });
});
