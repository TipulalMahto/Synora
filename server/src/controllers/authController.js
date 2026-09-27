import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { dbReady } from '../db.js'
import { jwtSecret } from '../middleware/auth.js'
import { OAuth2Client } from 'google-auth-library'
import crypto from 'crypto'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Pre-configured demo accounts for instant testing
export const DEMO_ACCOUNTS = {
  citizen: {
    email: 'citizen@jharkhand.gov.in',
    password: 'demo1234',
    name: 'Tipulal Mahto',
    org: 'Ranchi Citizen',
  },
  government: {
    email: 'government@jharkhand.gov.in',
    password: 'demo1234',
    name: 'Dept. of Higher & Technical Education',
    org: 'Government of Jharkhand',
  },
  university: {
    email: 'citranchi.ac.in',
    password: 'demo1234',
    name: 'CIT Ranchi',
    org: 'Innovation & Incubation Centre',
  },
  industry: {
    email: 'industry@tatasteel.com',
    password: 'demo1234',
    name: 'Tata Steel Foundation',
    org: 'CSR & Innovation',
  },
}

// In-memory fallback for registered users when DB is unavailable
const memoryUsers = []

/**
 * Seed demo accounts into MongoDB if they don't exist yet
 */
export async function seedDemoUsers() {
  if (!dbReady()) return
  try {
    for (const [role, demo] of Object.entries(DEMO_ACCOUNTS)) {
      const existing = await User.findOne({ email: demo.email.toLowerCase() })
      if (!existing) {
        await User.create({
          role,
          name: demo.name,
          email: demo.email.toLowerCase(),
          password: demo.password, // pre-save hook in User model will hash this
          org: demo.org,
        })
        console.log(`✓ Seeded demo user: ${demo.email}`)
      }
    }
  } catch (err) {
    console.warn('⚠  Demo users seed warning:', err.message)
  }
}

/**
 * Register a new user (Citizen, Government, University, Industry)
 * POST /api/auth/register
 */
export async function registerUser(req, res) {
  try {
    const { role = 'citizen', name, email, password, phone = '', org = '' } = req.body || {}

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'missing_fields', message: 'Name, email and password are required' })
    }

    if (String(password).length < 4) {
      return res.status(400).json({ error: 'weak_password', message: 'Password must be at least 4 characters long' })
    }

    const cleanEmail = String(email).trim().toLowerCase()

    // 1. If MongoDB is ready, save to DB
    if (dbReady()) {
      const existing = await User.findOne({ email: cleanEmail })
      if (existing) {
        return res.status(400).json({ error: 'email_exists', message: 'Email is already registered' })
      }
      const user = await User.create({
        role,
        name: String(name).trim(),
        email: cleanEmail,
        password: String(password), // hashed automatically by UserSchema pre-save hook
        phone: String(phone).trim(),
        org: String(org).trim() || (role === 'citizen' ? 'Citizen' : ''),
      })
      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name, email: user.email, org: user.org },
        jwtSecret(),
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      )
      return res.json({ role: user.role, name: user.name, email: user.email, phone: user.phone, org: user.org, token, demo: false })
    }

    // 2. Memory store fallback when DB is offline
    const existingMem = memoryUsers.find((u) => u.email === cleanEmail)
    if (existingMem) {
      return res.status(400).json({ error: 'email_exists', message: 'Email is already registered' })
    }

    const hashedPassword = await bcrypt.hash(String(password), 10)
    const newUser = {
      role,
      name: String(name).trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: String(phone).trim(),
      org: String(org).trim() || (role === 'citizen' ? 'Citizen' : ''),
    }
    memoryUsers.push(newUser)

    const token = jwt.sign(
      { role: newUser.role, name: newUser.name, email: newUser.email, org: newUser.org },
      jwtSecret(),
      { expiresIn: '30d' }
    )
    return res.json({ role: newUser.role, name: newUser.name, email: newUser.email, phone: newUser.phone, org: newUser.org, token, demo: false })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ error: 'server_error', message: err.message })
  }
}

/**
 * Sign in existing user or demo account
 * POST /api/auth/login
 */
export async function loginUser(req, res) {
  try {
    const { role, email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ error: 'missing_credentials', message: 'Email and password are required' })
    }

    const cleanEmail = String(email).trim().toLowerCase()
    const inputPassword = String(password)
    const userRole = role || 'citizen'

    // 1. Check registered DB users
    if (dbReady()) {
      const user = await User.findOne({ email: cleanEmail })
      if (user) {
        const isMatch = await user.comparePassword(inputPassword)
        if (isMatch) {
          const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, email: user.email, org: user.org },
            jwtSecret(),
            { expiresIn: process.env.JWT_EXPIRE || '30d' }
          )
          return res.json({ role: user.role, email: user.email, name: user.name, phone: user.phone || '', org: user.org || '', token, demo: false })
        }
      }
    }

    // 2. Check demo accounts fallback (for instant demo login if not yet seeded or offline)
    const demoAccount = DEMO_ACCOUNTS[userRole] || Object.values(DEMO_ACCOUNTS).find((acc) => acc.email === cleanEmail)
    if (demoAccount && cleanEmail === demoAccount.email.toLowerCase() && inputPassword === demoAccount.password) {
      const token = jwt.sign(
        { role: userRole, name: demoAccount.name, email: demoAccount.email, org: demoAccount.org },
        jwtSecret(),
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      )
      return res.json({ role: userRole, email: demoAccount.email, name: demoAccount.name, org: demoAccount.org, token, demo: true })
    }

    // 3. Check memory registered users (if DB is offline)
    const memUser = memoryUsers.find((u) => u.email === cleanEmail)
    if (memUser) {
      const isMatch = await bcrypt.compare(inputPassword, memUser.password)
      if (isMatch) {
        const token = jwt.sign(
          { role: memUser.role, name: memUser.name, email: memUser.email, org: memUser.org },
          jwtSecret(),
          { expiresIn: '30d' }
        )
        return res.json({ role: memUser.role, email: memUser.email, name: memUser.name, phone: memUser.phone, org: memUser.org, token, demo: false })
      }
    }

    // INVALID CREDENTIALS - Reject any other attempt!
    return res.status(401).json({ error: 'invalid_credentials', message: 'Invalid email or password' })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'server_error', message: err.message })
  }
}

/**
 * Sign in / sign up via Google Identity Services
 * POST /api/auth/google
 */
export async function googleAuth(req, res) {
  try {
    const { credential, role = 'citizen' } = req.body || {}
    if (!credential) {
      return res.status(400).json({ error: 'missing_credential', message: 'Google credential is required' })
    }

    // Verifies the ID token's signature + audience — this is the real security check.
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()

    if (!payload?.email_verified) {
      return res.status(401).json({ error: 'email_not_verified', message: 'Please use a verified Google account' })
    }

    const cleanEmail = String(payload.email).toLowerCase()
    const name = payload.name || cleanEmail.split('@')[0]

    if (dbReady()) {
      let user = await User.findOne({ email: cleanEmail })
      if (!user) {
        // New Google sign-up. Password is never used for this account, but the
        // schema requires one — a random hash keeps it unguessable.
        user = await User.create({
          role,
          name,
          email: cleanEmail,
          password: crypto.randomBytes(20).toString('hex'),
          org: role === 'citizen' ? 'Citizen' : '',
        })
      }
      // Existing user -> always log them into THEIR real role, ignore whatever
      // role card was selected in the modal (prevents duplicate/mismatched accounts).
      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name, email: user.email, org: user.org },
        jwtSecret(),
        { expiresIn: process.env.JWT_EXPIRE || '30d' },
      )
      return res.json({ role: user.role, name: user.name, email: user.email, phone: user.phone || '', org: user.org || '', token, demo: false })
    }

    // DB offline fallback (mirrors loginUser's memory-store pattern)
    let memUser = memoryUsers.find((u) => u.email === cleanEmail)
    if (!memUser) {
      memUser = { role, name, email: cleanEmail, password: '', org: role === 'citizen' ? 'Citizen' : '' }
      memoryUsers.push(memUser)
    }
    const token = jwt.sign(
      { role: memUser.role, name: memUser.name, email: memUser.email, org: memUser.org },
      jwtSecret(),
      { expiresIn: '30d' },
    )
    return res.json({ role: memUser.role, email: memUser.email, name: memUser.name, org: memUser.org, token, demo: false })
  } catch (err) {
    console.error('Google auth error:', err)
    return res.status(401).json({ error: 'invalid_google_token', message: 'Could not verify Google sign-in' })
  }
}

/**
 * Get current authenticated user details
 * GET /api/auth/me
 */
export function getCurrentUser(req, res) {
  const user = req.user
  if (!user) return res.status(401).json({ error: 'unauthorized' })
  return res.json({ id: user.id, role: user.role, email: user.email, name: user.name, org: user.org, demo: false })
}

