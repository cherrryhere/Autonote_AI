# AutoNote AI

AI-powered lecture notes generator — upload audio/video, get back transcripts, structured notes, summaries, flashcards, and quizzes.

Built with **React + Vite + Tailwind** on the frontend and **Node.js + Express** on the backend, powered by the **free** Groq API (Whisper for transcription, Llama 3.3 70B for content generation).

```
AutoNote AI/
├── frontend/   ← React + Vite + Tailwind UI
└── backend/    ← Express + Groq API + bundled ffmpeg
```

---

## 1. Get a free Groq API key

1. Visit https://console.groq.com/keys
2. Sign in with Google / GitHub.
3. Click **Create API Key** → copy it.

Free-tier limits at the time of writing:
| Model | Limit |
|---|---|
| `whisper-large-v3-turbo` | 20 req/min, 100 req/day, 7,200 audio sec/hr |
| `llama-3.3-70b-versatile` | 30 req/min, 1,000 req/day |

Plenty for student use.

---

## 2. Run the backend

```powershell
cd "C:\Users\Suraaj gibs\OneDrive\Desktop\AutoNote AI\backend"
npm install
copy .env.example .env
notepad .env          # paste your GROQ_API_KEY
npm run dev
```

You should see:
```
  AutoNote AI backend listening on http://localhost:3001
  Transcribe:   whisper-large-v3-turbo
  Chat model:   llama-3.3-70b-versatile
  Groq key:     loaded ✓
```

Backend runs on **http://localhost:3001**.

> **Note:** the first `npm install` downloads a static ffmpeg binary (~30 MB) bundled via `@ffmpeg-installer/ffmpeg`. No system ffmpeg required.

---

## 3. Run the frontend (in a second terminal)

```powershell
cd "C:\Users\Suraaj gibs\OneDrive\Desktop\AutoNote AI\frontend"
npm install
npm run dev
```

Frontend opens automatically at **http://localhost:5173** with `/api` proxied to the backend.

---

## What the backend does

When you upload a lecture, the backend runs a 3-call pipeline:

| Step | Action | Tool |
|---|---|---|
| 1 | Strip video, downmix to mono 16 kHz, encode to 32 kbps MP3 | bundled **ffmpeg** |
| 2 | Transcribe the audio | Groq **Whisper Large V3 Turbo** |
| 3–5 | Generate summary + topic-wise notes + flashcards + quiz as one JSON | Groq **Llama 3.3 70B** |

The compression step keeps files comfortably under Groq's **25 MB Whisper cap** (32 kbps mono ≈ 14 MB per hour of speech). Quality stays clean because Whisper is trained on low-bitrate speech.

The frontend kicks off the upload, then polls `/api/lectures/:id/status` every 2 seconds to drive the on-screen progress bar.

---

## API reference

| Method | Path | Description |
|---|---|---|
| `POST`   | `/api/lectures`            | Multipart upload (`file`, `title`, `subject`, `semester`). Returns `{ id }`. |
| `GET`    | `/api/lectures`            | List all lectures (most recent first). |
| `GET`    | `/api/lectures/:id`        | Full lecture record incl. transcript, summary, notes, flashcards, quiz. |
| `GET`    | `/api/lectures/:id/status` | Lightweight progress poll: `{ status, step, error }`. |
| `GET`    | `/api/stats`               | Totals for the dashboard cards. |
| `GET`    | `/api/health`              | Liveness check. |

---

## Architecture

```
backend/
├── server.js                    Express entry, CORS, JSON, routes
├── src/
│   ├── routes/
│   │   ├── lectures.js          POST upload, GET status / id / list
│   │   └── stats.js             Dashboard totals
│   ├── services/
│   │   ├── audio.js             ffmpeg compression for Whisper
│   │   ├── groq.js              Groq SDK wrapper (Whisper + Llama)
│   │   ├── processor.js         3-call pipeline orchestrator
│   │   └── store.js             In-memory lecture/job store
│   └── middleware/
│       └── upload.js            Multer config (MP3/WAV/MP4/MOV, 500 MB cap)
└── uploads/                     Local file storage (gitignored)

frontend/
├── src/
│   ├── api/client.js            Fetch wrapper around /api
│   ├── hooks/useLecture.js      Loads current lecture for results pages
│   ├── components/              Sidebar, Topbar, UploadBox, etc.
│   └── pages/                   9 pages — landing, dashboard, upload, results
└── vite.config.js               /api → http://localhost:3001 proxy
```

---

## Notes & next steps

- **Storage is in-memory** — restarting the backend clears all uploads. Swap `services/store.js` for SQLite when you need persistence.
- **The frontend gracefully falls back to sample data** if the backend is unreachable, so the UI always looks alive (great for demos and screenshots).
- **All Groq generation calls use JSON mode** (`response_format: { type: 'json_object' }`) — no fragile regex parsing.
- **File-size cap:** 25 MB raw upload to Whisper. ffmpeg compression handles up to ~90-min lectures comfortably.
- **Switch chat model** by setting `GROQ_CHAT_MODEL=llama-3.1-8b-instant` for even faster (but smaller) responses, or `mixtral-8x7b-32768` for longer context windows.
