# ShramikMitra

ShramikMitra is a bilingual (Hindi/English) web app for migrant workers, featuring job listings, community/help pages, and a phone-style IVR experience (Twilio) with a judge-friendly in-browser IVR simulator.

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind + shadcn/ui
- Backend: Node.js + Express + MongoDB (MongoDB Atlas)
- IVR: Twilio webhooks (TwiML) + ngrok

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas connection string (required for backend)
- Optional: Twilio account + ngrok (for real phone calls)
- Optional: Docker + Docker Compose (for one-command run)

## Environment Variables

### Backend (`backend/.env`)

Required:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
PORT=3001
```

Optional (only if you want real Twilio IVR calls):

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

### Frontend (repo root `.env`)

Recommended for chatbot:

```env
VITE_GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If you run ngrok via Docker (see below):

```env
NGROK_AUTHTOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Run Locally (3 terminals) — Recommended

Install dependencies (first time only):

```bash
cd /home/Masum/Videos/shramik-mitra
npm install
cd backend && npm install && cd ..
```

Terminal 1 (backend):

```bash
cd /home/Masum/Videos/shramik-mitra/backend
npm start
```

Terminal 2 (frontend):

```bash
cd /home/Masum/Videos/shramik-mitra
npm run dev
```

Terminal 3 (ngrok for real Twilio calls):

```bash
ngrok http 3001
```

Open:

- Frontend: http://localhost:5173/
- IVR Simulator: http://localhost:5173/ivr-simulator

## Run with Docker (frontend + backend + ngrok)

This starts everything with one command.

```bash
cd /home/Masum/Videos/shramik-mitra
docker compose up --build
```

Open:

- Frontend: http://localhost:5173/
- IVR Simulator: http://localhost:5173/ivr-simulator
- ngrok inspector: http://localhost:4040/

Stop:

```bash
docker compose down
```

## Twilio IVR Setup

See IVR setup details in `IVR_SETUP_GUIDE.md`.

For a no-phone, judge-friendly demo, use the IVR simulator page:

- `http://localhost:5173/ivr-simulator`

## Useful Scripts

From repo root:

- `npm run dev` — Frontend
- `npm run server` — Backend
- `npm run demo` — Frontend + backend together (uses `concurrently`)
- `npm run build` — Production build
