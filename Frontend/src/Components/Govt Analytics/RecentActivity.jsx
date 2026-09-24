import React, { useMemo } from 'react'
import { statusMeta } from '../../lib/status.js'

function timeAgo(iso) {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

// Flattens every report's timeline into a single state-wide activity feed —
// the "who did what, when" ledger across citizens, government, universities
// and industry partners.
const RecentActivity = ({ reports = [], limit = 8 }) => {
  const events = useMemo(() => {
    const all = []
    for (const r of reports) {
      for (const entry of r.timeline || []) {
        all.push({ ...entry, reportId: r.id, title: r.title })
      }
    }
    return all.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, limit)
  }, [reports, limit])

  return (
    <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🕘</span>
        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
      </div>
      <p className="text-sm text-slate-500 mt-1">Latest updates across all challenges, statewide</p>

      {events.length === 0 ? (
        <div className="mt-6 flex h-40 items-center justify-center text-sm text-slate-400">
          No activity yet — updates will appear here as challenges move through the pipeline.
        </div>
      ) : (
        <div className="mt-5 space-y-3 max-h-96 overflow-y-auto pr-1">
          {events.map((e, i) => {
            const meta = statusMeta(e.status)
            return (
              <div key={`${e.reportId}-${i}`} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-base">{meta.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{e.title}</p>
                  <p className="truncate text-xs text-slate-500">{e.note || meta.label}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-400">{timeAgo(e.at)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RecentActivity
