# Payout Job Portal

Payout is a full-stack job portal with:

- Jobseeker and student onboarding
- Employer authentication and hiring dashboard
- MySQL-backed jobs and applications data
- In-app AI assistant for guided product help

## Stack

- Frontend: React + Vite
- Backend: Express
- Database: MySQL
- AI: OpenAI API or local-context fallback

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and review these values:

```bash
PORT=3001
VITE_API_BASE_URL=http://localhost:3001/api
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=wesly8143
MYSQL_DATABASE=payout_portal
JWT_SECRET=change-this-secret
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
AI_MAX_CONTEXT_DOCS=4
VITE_AI_SERVER_URL=http://localhost:3001
```

3. Make sure MySQL is running.

4. Start the backend:

```bash
npm run server
```

5. Start the frontend:

```bash
npm run dev
```

6. Open the app at `http://localhost:3000`.

The backend will create the database schema automatically when MySQL is available.

## Demo Logins

- Student: `student@payoutjob.com` / `Payout@123`
- Employer: `employer@payoutjob.com` / `Payout@123`

## Key Features

- Real auth with persistent sessions
- Student profile persistence
- Live job listings from MySQL
- Real application submission and tracking
- Employer dashboard for jobs, applications, and candidate review
- AI assistant with product-aware guidance

## AI Assistant

- Uses OpenAI when `OPENAI_API_KEY` is configured
- Falls back to local project context when no API key is set
- Adapts guidance for jobseeker, student, and recruiter personas

## Notes

- If MySQL is not running, the backend will still start but API routes that need the database will return a connection error.
- The seeded demo accounts are created automatically only when the users table is empty.
