# Velora AI

AI-powered study management application with LangGraph agents, RAG retrieval, and Google Classroom integration.

## Features

- **LangGraph Agent System**: Velora (main orchestrator) + Helper agents per class
- **Ingestion Pipeline**: Audio/file upload → Whisper transcription → embeddings → pgvector
- **RAG System**: Hybrid search (semantic + keyword) with time-weighted retrieval
- **Study Brief Generation**: AI-generated daily study plans
- **Practice Quiz Generation**: Retrieval-based questions from materials
- **Google Classroom Integration**: Sync courses and assignments
- **Web Push Notifications**: Study reminders and alerts

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL with pgvector extension
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/spraldev/veloraai.git
cd veloraai
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials. Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random string for NextAuth
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for dev)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `OPENAI_API_KEY`: OpenAI API key
- `VAPID_PUBLIC_KEY`: Web push public key
- `VAPID_PRIVATE_KEY`: Web push private key
- `VAPID_EMAIL`: Contact email for web push

4. Set up the database:
```bash
createdb veloraai
psql veloraai -c "CREATE EXTENSION vector;"
pnpm prisma migrate dev
pnpm prisma generate
```

5. Generate VAPID keys for web push:
```bash
npx web-push generate-vapid-keys
```

### Running the App

Development:
```bash
pnpm dev
```

Production build:
```bash
pnpm build
pnpm start
```

## Usage

1. Sign in with Google or email/password
2. Complete onboarding and connect Google Classroom (optional)
3. Upload class materials (audio, notes, files)
4. Chat with Velora or class-specific Helpers
5. Generate daily Study Briefs
6. Create practice quizzes
7. Track assignments and study progress

## Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM and pgvector
- **Auth**: NextAuth with Google OAuth
- **AI**: LangGraph.js agents with OpenAI GPT-4
- **Embeddings**: OpenAI text-embedding-3-small
- **Transcription**: OpenAI Whisper API

## License

MIT
