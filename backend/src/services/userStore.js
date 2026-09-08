import { pool } from '../db.js'

export async function createUser({ id, name, email, passwordHash }) {
  const createdAt = Date.now()
  await pool.query(
    'INSERT INTO users (id, name, email, password_hash, created_at) VALUES ($1, $2, $3, $4, $5)',
    [id, name, email, passwordHash, createdAt]
  )
  return { id, name, email, passwordHash, createdAt }
}

export async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE lower(email) = lower($1)', [String(email)])
  return rows[0] ? mapUser(rows[0]) : null
}

export async function findUserById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return rows[0] ? mapUser(rows[0]) : null
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: Number(row.created_at),
  }
}

// Strips the password hash — safe to send to the client.
export function toPublicUser(user) {
  if (!user) return null
  const { id, name, email, createdAt } = user
  return { id, name, email, createdAt }
}
