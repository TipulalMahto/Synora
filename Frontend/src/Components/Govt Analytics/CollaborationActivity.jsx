import React, { useMemo } from 'react'
import { statusMeta, statusProgress } from '../../lib/status.js'

// Every challenge currently paired with a University and/or Industry
// partner — the "who's collaborating with whom, and how far along" view
// government needs to coordinate funding, approvals and monitoring.
const CollaborationActivity = ({ reports = [], limit = 8 }) => {
  const collaborations = useMemo(() => {
    return reports
      .filter((r) => r.assignedUniversity || r.assignedIndustry)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit)
  }, [reports, limit])

  return (
    <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🤝</span>
        <h2 className="text-lg font-bold text-slate-900">Collaboration Activity</h2>
      </div>
      <p className="text-sm text-slate-500 mt-1">Challenges currently paired with a University and/or Industry partner</p>

      {collaborations.length === 0 ? (
        <div className="mt-6 flex h-40 items-center justify-center text-sm text-slate-400 text-center px-4">
          No active partnerships yet — forward a verified challenge so universities and industry can adopt it.
        </div>
      ) : (
        <div className="mt-5 space-y-3 max-h-96 overflow-y-auto pr-1">
          {collaborations.map((r) => {
            const meta = statusMeta(r.status)
            const progress = statusProgress(r.status)
            return (
              <div key={r.id} className="rounded-2xl border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-semibold text-slate-800">{r.title}</p>
                  <span className="shrink-0 text-xs font-bold text-slate-500">{meta.icon} {meta.label}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                  {r.assignedUniversity && (
                    <span className="rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5">🎓 {r.assignedUniversity}</span>
                  )}
                  {r.assignedIndustry && (
                    <span className="rounded-full bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5">🏭 {r.assignedIndustry}</span>
                  )}
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-linear-to-r from-violet-400 to-violet-600" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CollaborationActivity
