import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { ROLES, ROLE_LABEL, pathForRole } from '../../../lib/roles.js'
import Home from './Home'
import AboutUs from './AboutUs'

// Logged out: show every role so a visitor can preview/log in to any portal.
// Logged in: only show the portal that belongs to the signed-in role, so
// "each role should see only the features relevant to that role" holds true
// in the navigation too — not just on the page itself.
const Navbar2 = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  function goTo(role) {
    if (!user) {
      navigate(`/?role=${role}&redirect=${encodeURIComponent(pathForRole(role))}`)
      return
    }
    navigate(pathForRole(role))
  }

  const visibleRoles = user ? ROLES.filter((r) => r.key === user.role) : ROLES

  return (
    <nav className='w-full px-8 py-1'>
      <div className='flex items-center justify-center gap-3 flex-wrap'>
        <Home />

        {visibleRoles.map((r) => {
          const active = location.pathname.toLowerCase() === pathForRole(r.key).toLowerCase()
          return (
            <button
              key={r.key}
              onClick={() => goTo(r.key)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                active ? 'bg-orange-500 text-white' : 'bg-orange-400 text-black hover:bg-orange-500 hover:text-white'
              }`}
            >
              {r.icon} {ROLE_LABEL[r.key]}
            </button>
          )
        })}

        <AboutUs />
      </div>
    </nav>
  )
}

export default Navbar2
