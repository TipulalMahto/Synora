import React, { useCallback, useEffect, useState } from 'react'
import WelcomeProfile from './WelcomeProfile/WelcomeProfile'
import ReportProblem from './ReportProblem/ReportProblem'
import TrackProblem from './TrackProblem/TrackProblem'
import SubmittedProblem from './SubmittedProblem/SubmittedProblem'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../lib/api.js'

const CitizenPortal = () => {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const mine = await api.getMyReports(user)
      setReports(mine)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <div>
      <WelcomeProfile />
      <ReportProblem onSubmitted={refresh} />
      <TrackProblem />
      <SubmittedProblem reports={reports} loading={loading} />
    </div>
  )
}

export default CitizenPortal
