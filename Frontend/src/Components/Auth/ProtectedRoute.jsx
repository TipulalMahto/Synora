import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { pathForRole } from '../../lib/roles.js'

// Guards a portal route so only a logged-in user with the matching role can
// see it. Not logged in -> bounced to Home with ?role=&redirect= so the login
// modal in the navbar can auto-open with the right role preselected. Logged
// in as the wrong role -> bounced to that user's own portal instead.
const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    const redirect = encodeURIComponent(location.pathname)
    return <Navigate to={`/?role=${role}&redirect=${redirect}`} replace />
  }

  if (user.role !== role) {
    return <Navigate to={pathForRole(user.role)} replace />
  }

  return children
}

export default ProtectedRoute
