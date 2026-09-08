import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Add it to backend/.env')
}

// Managed Postgres providers (Neon, Supabase, Render Postgres) require TLS;
// a local dev database on localhost does not.
const isLocal = /^(postgres(ql)?:\/\/)?[^@]*@?(localhost|127\.0\.0\.1)/i.test(connectionString)

export const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
})

export async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    BIGINT NOT NULL
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lectures (
      id            TEXT PRIMARY KEY,
      user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title         TEXT NOT NULL,
      subject       TEXT NOT NULL,
      semester      TEXT NOT NULL,
      filename      TEXT,
      mime_type     TEXT,
      size          BIGINT DEFAULT 0,
      source_url    TEXT,
      source_title  TEXT,
      source_author TEXT,
      date          TEXT NOT NULL,
      duration      TEXT DEFAULT '—',
      status        TEXT NOT NULL DEFAULT 'processing',
      step          INTEGER NOT NULL DEFAULT 0,
      error         TEXT,
      rate_limited  BOOLEAN DEFAULT FALSE,
      transcript    TEXT,
      summary       JSONB,
      notes         JSONB,
      flashcards    JSONB,
      quiz          JSONB,
      created_at    BIGINT NOT NULL
    )
  `)

  await pool.query('CREATE INDEX IF NOT EXISTS lectures_user_id_idx ON lectures(user_id)')
}
