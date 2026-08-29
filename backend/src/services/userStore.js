// Tiny in-memory user store. State is lost on restart — fine for dev/demos.
// Swap for a real database later.

const usersById = new Map()    // id -> user record
const idByEmail = new Map()    // lowercased email -> id

export function createUser({ id, name, email, passwordHash }) {
  const record = {
    id,
    name,
    email,
    passwordHash,
    createdAt: Date.now(),
  }
  usersById.set(id, record)
  idByEmail.set(email.toLowerCase(), id)
  return record
}

export function findUserByEmail(email) {
  const id = idByEmail.get(String(email).toLowerCase())
  return id ? usersById.get(id) : null
}

export function findUserById(id) {
  return usersById.get(id) || null
}

// Strips the password hash — safe to send to the client.
export function toPublicUser(user) {
  if (!user) return null
  const { id, name, email, createdAt } = user
  return { id, name, email, createdAt }
}
