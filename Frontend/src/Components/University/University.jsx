import React, { useCallback, useEffect, useState } from 'react'
import Profile from './Profile'
import Challenge from './Challenge'
import MyProjects from './MyProjects'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../lib/api.js'
import { usePolling } from '../../lib/usePolling.js'

const University = () => {
  const { user } = useAuth()
  const orgName = user?.org || user?.name || 'University Team'
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('open')

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const list = await api.listReports()
      setReports(list)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Live: pick up new government-verified challenges without a manual refresh.
  // usePolling(refresh, 9000)

  const openChallenges = reports.filter((r) => !r.assignedUniversity && !r.assignedIndustry && ['verified', 'gov_review', 'matching'].includes(r.status))
  const myProjects = reports.filter((r) => r.assignedUniversity === orgName)

  return (
    <div>
      <Profile
        openCount={openChallenges.length}
        inDevCount={myProjects.filter((r) => r.status !== 'resolved').length}
        total={reports.length}
        tab={tab}
        onTabChange={setTab}
      />
      {tab === 'open' ? (
        <Challenge reports={openChallenges} loading={loading} onChanged={refresh} orgName={orgName} onAdopted={() => setTab('projects')} />
      ) : (
        <MyProjects reports={myProjects} loading={loading} onChanged={refresh} orgName={orgName} />
      )}
    </div>
  )
}

export default University
