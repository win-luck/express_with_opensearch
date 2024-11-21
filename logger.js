require('dotenv').config(); // dotenv 설정 추가
const { createLogger, format, transports } = require('winston');
const { Client } = require('@opensearch-project/opensearch');

// OpenSearch 클라이언트 설정
const client = new Client({
  node: process.env.OPENSEARCH_NODE, 
  auth: {
    username: process.env.OPENSEARCH_USERNAME, 
    password: process.env.OPENSEARCH_PASSWORD, 
  },
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV !== 'production', // 개발 환경에서만 비활성화
  },
});

// OpenSearch로 로그 전송 함수
async function logToOpenSearch(info) {
  try {
    await client.index({
      index: 'express-logs', // OpenSearch 인덱스 이름
      body: {
        timestamp: new Date().toISOString(),
        level: info.level,
        message: info.message,
      },
    });
  } catch (error) {
    console.error('Failed to log to OpenSearch:', error);
  }
}

// Winston Logger 생성
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(), // 콘솔 출력
  ],
});

// 로그 레벨에 따라 OpenSearch로 전송
logger.on('data', (info) => {
  logToOpenSearch(info);
});

module.exports = logger;
