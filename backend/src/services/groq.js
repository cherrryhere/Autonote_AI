import { createReadStream } from 'fs'
import Groq from 'groq-sdk'

const TRANSCRIBE_MODEL =
  process.env.GROQ_TRANSCRIBE_MODEL || 'whisper-large-v3-turbo'

const CHAT_MODEL =
  process.env.GROQ_CHAT_MODEL || 'openai/gpt-oss-120b'

let _client = null

function client() {
  if (!_client) {
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      throw new Error(
        'GROQ_API_KEY is not set. Add it to backend/.env'
      )
    }

    _client = new Groq({ apiKey })
  }

  return _client
}

// Wrap Groq calls so rate-limit errors come back as a clean Error
// with .rateLimited = true.
async function withErrorHandling(label, fn) {
  try {
    return await fn()
  } catch (err) {
    const status = err?.status || err?.response?.status
    const msg = String(err?.message || err)

    if (
      status === 429 ||
      /rate limit|too many requests/i.test(msg)
    ) {
      const e = new Error(
        `Groq rate limit hit during ${label}. Wait ~30 seconds and try again.`
      )

      e.rateLimited = true
      e.status = 429

      throw e
    }

    if (
      status === 413 ||
      /too large|file size/i.test(msg)
    ) {
      throw new Error(
        'Audio file too large for Groq Whisper. ' +
        'Try a shorter lecture or lower-bitrate audio.'
      )
    }

    throw err
  }
}

// ─── Transcription ──────────────────────────────────────────────────────────
// Sends a compressed audio file to Groq's hosted Whisper.
export async function transcribeAudio(filePath) {
  return withErrorHandling('transcription', async () => {
    const result = await client().audio.transcriptions.create({
      file: createReadStream(filePath),
      model: TRANSCRIBE_MODEL,
      response_format: 'json',
      language: 'en',
      temperature: 0,
    })

    return result.text || ''
  })
}

// ─── Content generation ────────────────────────────────────────────────────
// GPT-OSS-120B generates summary + notes + flashcards + quiz as JSON.
export async function generateStudyMaterial({
  transcript,
  lecture,
}) {
  // Keep the request at a manageable size.
  // Roughly 30K characters is enough for most lecture transcripts
  // while avoiding unnecessarily large model requests.
  const safeTranscript = transcript.slice(0, 30000)

  return withErrorHandling('generation', async () => {
    const res = await client().chat.completions.create({
      model: CHAT_MODEL,

      response_format: {
        type: 'json_object',
      },

      temperature: 0.3,

      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: buildUserPrompt(
            safeTranscript,
            lecture
          ),
        },
      ],
    })

    const raw =
      res.choices?.[0]?.message?.content || '{}'

    const parsed = parseJSON(raw)

    // Defensive normalisation.
    // This prevents the frontend from crashing if a field
    // is unexpectedly missing.
    return {
      durationLabel:
        parsed.durationLabel || null,

      summary: {
        short:
          parsed.summary?.short || '',

        detailed:
          parsed.summary?.detailed || '',

        takeaways:
          Array.isArray(parsed.summary?.takeaways)
            ? parsed.summary.takeaways
            : [],
      },

      notes:
        Array.isArray(parsed.notes)
          ? parsed.notes
          : [],

      flashcards:
        Array.isArray(parsed.flashcards)
          ? parsed.flashcards
          : [],

      quiz:
        Array.isArray(parsed.quiz)
          ? parsed.quiz
          : [],
    }
  })
}

function parseJSON(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/```$/, '')
      .trim()

    return JSON.parse(cleaned)
  }
}

// ─── Prompts ────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
You are an academic study-material generator for university students.

You receive a lecture transcript and produce ONE JSON object
containing structured study material.

Always respond with valid JSON.

Never include prose, explanations, or Markdown outside the JSON.

Be faithful to the lecture content.
Do not invent information that was not covered in the lecture.

Create accurate, clear, useful study material suitable for
university students preparing for examinations.
`.trim()

function buildUserPrompt(transcript, lecture) {
  return `Lecture context:

- Title: "${lecture.title}"
- Subject: "${lecture.subject}"
- Audience: ${lecture.semester}

Generate study material as a JSON object with EXACTLY these keys:

{
  "durationLabel": "string — estimate like '47 min'",

  "summary": {
    "short": "string — 2-3 sentence elevator summary",

    "detailed": "string — 3-5 paragraphs separated by blank lines",

    "takeaways": [
      "string",
      "string"
    ]
  },

  "notes": [
    {
      "topic": "string",

      "points": [
        "string",
        "string"
      ],

      "definitions": [
        {
          "term": "string",
          "meaning": "string"
        }
      ],

      "formulas": [
        "string"
      ]
    }
  ],

  "flashcards": [
    {
      "question": "string",
      "answer": "string"
    }
  ],

  "quiz": [
    {
      "question": "string",

      "options": [
        "A",
        "B",
        "C",
        "D"
      ],

      "answerIndex": 0
    }
  ]
}

Requirements:

Summary:
- Short summary: 2-3 sentences.
- Detailed summary: 3-5 useful paragraphs.
- Takeaways: 4-6 important points.

Notes:
- Produce 3-6 topic blocks.
- Each topic should contain 3-6 important points.
- Include definitions only when relevant.
- Include formulas only when relevant.

Flashcards:
- Produce 6-10 useful active-recall flashcards.
- Questions should test understanding rather than simple copying.

Quiz:
- Produce EXACTLY 5 multiple-choice questions.
- Each question must have EXACTLY 4 options.
- answerIndex must be 0, 1, 2, or 3.

Lecture transcript:

"""
${transcript}
"""
`
}