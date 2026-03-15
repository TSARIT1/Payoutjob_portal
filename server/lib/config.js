import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3001),
  jwtSecret: process.env.JWT_SECRET || 'payout-dev-secret',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  aiMaxContextDocs: Number(process.env.AI_MAX_CONTEXT_DOCS || 4),
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'wesly8143',
    database: process.env.MYSQL_DATABASE || 'payout_portal'
  }
};
