import React, { useCallback, useEffect, useState } from 'react'
import Header from './Header'
import Graphs from './Graphs'
import RecentActivity from './RecentActivity'
import CollaborationActivity from './CollaborationActivity'
import Data from './Data'
import { api, computeStats } from '../../lib/api.js'
import { usePolling } from '../../lib/usePolling.js'

const Govt = () => {
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(() => computeStats([]))
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [list, s] = await Promise.all([api.listReports(), api.stats()])
      setReports(list)
      setStats(s)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Live: citizen submissions and partner updates show up without a manual refresh.
  // usePolling(refresh, 8000)

  return (
    <div>
      <Header stats={stats} onExport={() => exportCsv(reports)} />
      <Graphs stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-10 pb-2">
        <RecentActivity reports={reports} />
        <CollaborationActivity reports={reports} />
      </div>
      <div className="px-10 pb-10 pt-6">
        <Data reports={reports} loading={loading} onChanged={refresh} />
      </div>
    </div>
  )
}

function exportCsv(reports) {
  const header = ['Tracking ID', 'Title', 'Category', 'District', 'Status', 'Priority', 'Votes', 'Assigned University', 'Assigned Industry']
  const rows = reports.map((r) => [
    r.id,
    r.title,
    r.category,
    r.location?.district || '',
    r.status,
    r.priority,
    r.votes,
    r.assignedUniversity || '',
    r.assignedIndustry || '',
  ])
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `jharkhand-state-report-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default Govt
