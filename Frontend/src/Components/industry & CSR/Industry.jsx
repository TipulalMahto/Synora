import React, { useCallback, useEffect, useState } from 'react'
import Header from './Header'
import Tasks from './Tasks'
import ActiveCollaborations from './ActiveCollaborations'
import { useAuth } from '../../context/AuthContext.jsx'
import { api } from '../../lib/api.js'
import { usePolling } from '../../lib/usePolling.js'

const Industry = () => {
  const { user } = useAuth()
  const orgName = user?.org || user?.name || 'CSR Partner'
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('opportunities')

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

  // Live: pick up new government-verified / university-matched challenges.
  // usePolling(refresh, 9000)

  const activeProjects = reports.filter((r) => r.assignedIndustry === orgName)
  const openForCsr = reports.filter(
    (r) => !r.assignedIndustry && ['gov_review', 'matching', 'collaboration', 'solution'].includes(r.status),
  )

  return (
    <div>
      <Header
        activeCount={activeProjects.filter((r) => r.status !== 'resolved').length}
        openCount={openForCsr.length}
        tab={tab}
        onTabChange={setTab}
      />
      {tab === 'opportunities' ? (
        <Tasks reports={openForCsr} loading={loading} onChanged={refresh} orgName={orgName} onOffered={() => setTab('active')} />
      ) : (
        <ActiveCollaborations reports={activeProjects} loading={loading} onChanged={refresh} orgName={orgName} />
      )}
    </div>
  )
}

export default Industry
