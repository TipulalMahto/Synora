import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, DEMO_ACCOUNTS } from '../../../context/AuthContext'
import { ROLES, ROLE_PATH } from '../../../lib/roles.js'

const Button = () => {
  // Demo credentials
  const ROLE_EMAIL = {
    citizen: 'citizen@jharkhand.gov.in',
    government: 'government@jharkhand.gov.in',
    university: 'citranchi.ac.in',
    industry: 'industry@tatasteel.com',
  }

  const DEMO_PASSWORD = 'demo1234'

  const { login, register, user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const redirect = searchParams.get('redirect')

  const defaultRole =
    searchParams.get('role') ||
    (redirect === '/report' ? 'citizen' : 'citizen')

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  const [role, setRole] = useState(defaultRole)
  const [name, setName] = useState('')
  const [email, setEmail] = useState(
    ROLE_EMAIL[defaultRole] || ROLE_EMAIL.citizen
  )
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [phone, setPhone] = useState('')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // A ProtectedRoute sends visitors here with ?role=<needed>&redirect=<path>
  // when they try to open a portal without being logged in as the right
  // role. Auto-open the login modal (once) so they don't have to hunt for
  // the button themselves — and keep the requested role preselected.
  useEffect(() => {
    if (redirect && !user) {
      setIsLoginOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pickRole(key) {
    setRole(key)

    if (!isRegister) {
      setEmail(ROLE_EMAIL[key] || '')
      setPassword(DEMO_PASSWORD)
    }

    setError('')
  }

  function toggleMode(registering) {
    setIsRegister(registering)
    setError('')

    if (registering) {
      if (email === ROLE_EMAIL[role]) {
        setEmail('')
      }

      if (password === DEMO_PASSWORD) {
        setPassword('')
      }
    } else {
      setEmail(ROLE_EMAIL[role] || '')
      setPassword(DEMO_PASSWORD)
    }
  }

  async function handleAuth() {
    setBusy(true)
    setError('')

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Name is required')
          setBusy(false)
          return
        }

        await register({
          role,
          name,
          email,
          password,
          phone,
        })
      } else {
        await login(role, {
          email,
          password,
        })
      }

      setIsLoginOpen(false)

      navigate(redirect || ROLE_PATH[role] || '/')
    } catch (err) {
      if (err?.code === 'invalid_credentials') {
        setError('Invalid email or password')
      } else if (err?.code === 'email_exists') {
        setError('Email is already registered')
      } else {
        setError(err?.message || 'Login failed')
      }
    } finally {
      setBusy(false)
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(ROLE_PATH[user.role] || '/')}
          className="flex flex-col items-end rounded-md px-2 py-1 text-right hover:bg-white/40"
        >
          <span className="text-sm font-bold text-blue-900">{user.name}</span>
          <span className="text-xs text-blue-800/70">{user.org}</span>
        </button>
        <button
          onClick={() => { logout(); navigate('/') }}
          className="bg-white text-red-600 px-5 py-3 rounded-md text-sm font-bold shadow-sm hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Login Button */}
      <button
        onClick={() => {
          setIsLoginOpen(true)
          setError('')
        }}
        className="bg-white text-blue-900 px-6 py-3 rounded-md text-lg font-medium shadow-sm hover:bg-gray-100 transition"
      >
        Login/Register
      </button>

      {/* Login Modal */}
      {isLoginOpen && (
        <>
          {/* Background Blur */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
            onClick={() => setIsLoginOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-125 max-h-[90vh] overflow-y-auto rounded-[22px] bg-white shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between bg-[#07152f] px-5 py-4 text-white">

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 font-bold">
                    SN
                  </div>

                  <div>
                    <h2 className="text-sm font-bold">
                      Synora — Secure Login
                    </h2>

                    <p className="text-[10px] text-gray-300">
                      {redirect ? 'Please sign in to continue' : 'Secure Authentication'}
                    </p>
                  </div>
                </div>

                {/* Close */}
                <button
                  onClick={() => setIsLoginOpen(false)}
                  className="text-2xl text-gray-300 hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="space-y-5 p-5">

                {/* Login / Register Switch */}
                <div className="flex rounded-xl bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => toggleMode(false)}
                    className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                      !isRegister
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500'
                    }`}
                  >
                    🔑 Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleMode(true)}
                    className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                      isRegister
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500'
                    }`}
                  >
                    ✨ Register
                  </button>
                </div>

                {/* Select Role */}
                <div>
                  <p className="mb-2 text-xs font-bold tracking-wide text-green-700">
                    🛡 SELECT YOUR ROLE
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => pickRole(item.key)}
                        className={`rounded-xl border p-3 text-left transition ${
                          role === item.key
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <p className="text-sm font-bold">
                          {item.icon} {item.name}
                        </p>

                        <span className="mt-1 inline-block rounded px-2 py-1 text-[10px] font-bold text-gray-400">
                          Google Sign-In
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Authentication Form */}
                <div className="space-y-3">

                  {/* Name */}
                  {isRegister && (
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">
                        Full Name *
                      </label>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          setError('')
                        }}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-700">
                      Email *
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                      autoComplete="username"
                      placeholder="e.g. user@example.com"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-700">
                      Password *
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError('')
                      }}
                      autoComplete={
                        isRegister ? 'new-password' : 'current-password'
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAuth()
                        }
                      }}
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
                    />
                  </div>

                  {/* Phone */}
                  {isRegister && (
                    <div>
                      <label className="mb-1 block text-xs font-bold text-gray-700">
                        Phone
                        <span className="ml-1 font-normal text-gray-400">
                          (Optional)
                        </span>
                      </label>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
                      />
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                    <span>⚠️</span>
                    {error}
                  </div>
                )}

                {/* Main Auth Button */}
                <button
                  onClick={handleAuth}
                  disabled={busy}
                  className="w-full rounded-xl bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy
                    ? 'Please wait...'
                    : isRegister
                    ? 'Create Account'
                    : 'Sign In'}
                </button>

                {/* Demo Account */}
                {!isRegister && (
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-500">
                        🔑 Demo Account
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setEmail(ROLE_EMAIL[role])
                          setPassword(DEMO_PASSWORD)
                          setError('')
                        }}
                        className="text-xs font-bold text-green-600 hover:underline"
                      >
                        Auto-fill Demo
                      </button>
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      {DEMO_ACCOUNTS?.[role]?.name} ·{' '}
                      {DEMO_ACCOUNTS?.[role]?.org}
                    </p>

                    <p className="mt-1 font-mono text-xs text-gray-400">
                      {ROLE_EMAIL[role]} · {DEMO_PASSWORD}
                    </p>
                  </div>
                )}

                {/* Google Information */}
                <div className="w-full rounded-2xl border border-blue-300 bg-blue-50/70 p-4">

                  <p className="text-[13px] font-semibold leading-4 text-blue-700">
                    Sign in with your institutional or organizational Google
                    account. Your role will be auto-detected from your email
                    domain.
                  </p>

                  {/* Google Button - UI only */}
                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">G</span>

                      <span className="text-[15px] font-semibold text-gray-800">
                        Continue with Google
                      </span>
                    </div>

                    <span className="text-xl text-gray-400">
                      →
                    </span>
                  </button>

                  <p className="mt-3 text-center text-[10px] text-blue-500">
                    Role detected from email:
                    <span className="font-semibold">
                      {' '}
                      .ac.in → University · .gov.in → Govt · other → Industry
                    </span>
                  </p>
                </div>

                {/* Footer */}
                <p className="text-center text-[9px] leading-4 text-gray-400">
                  By signing in, you agree to Synora's Terms of Use.
                  Your data is processed under the IT Act 2000 and Jharkhand
                  e-Governance Policy.
                </p>

              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Button
