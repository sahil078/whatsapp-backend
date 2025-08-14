# WhatsApp-like Webhook Storage Backend

Express.js + TypeScript + MongoDB (Mongoose) backend that ingests WhatsApp Business API–like webhook JSON, stores messages, updates statuses, and exposes REST endpoints for a UI. Optional Socket.IO realtime events.

## Quick Start

```bash
npm i
cp .env.example .env
# set MONGODB_URI and ORIGIN in .env
npm run dev
```

## REST Endpoints

- GET /api/conversations
- GET /api/messages/:wa_id
- POST /api/messages
- POST /webhook/simulate
# whatsapp-backend
