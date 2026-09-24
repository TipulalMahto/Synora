import React from 'react'
import { STATUS_ORDER, STATUS_META, statusIndex } from '../../../lib/status.js'

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return ''
  }
}

// Vertical progress tracker: Submitted -> Verified -> Review -> Matching ->
// Collaboration -> Solution -> Pilot -> Resolved, with the note/date captured
// from the report's timeline at each stage (government / university /
// industry actions all write into the same timeline on the backend).
const Timeline = ({ report }) => {
  if (!report) return null

  const rejected = report.status === 'rejected'
  const currentIdx = statusIndex(report.status)
  const entryFor = (statusKey) => report.timeline?.find((e) => e.status === statusKey)

  return (
    <ol className="relative mt-2">
      {STATUS_ORDER.map((statusKey, i) => {
        const done = i < currentIdx
        const current = i === currentIdx && !rejected
        const meta = STATUS_META[statusKey]
        const entry = entryFor(statusKey)
        const isLast = i === STATUS_ORDER.length - 1

        return (
          <li key={statusKey} className="flex gap-4">
            {/* rail */}
            <div className="flex flex-col items-center">
              <span
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                  done
                    ? 'bg-teal-600 text-white'
                    : current
                    ? 'bg-teal-100 text-teal-700 ring-4 ring-teal-100'
                    : 'bg-slate-100 text-slate-300'
                }`}
              >
                {done ? '✓' : current ? <span className="h-2.5 w-2.5 rounded-full bg-teal-600 animate-pulse" /> : meta.icon}
              </span>
              {!isLast && (
                <span className={`w-0.5 flex-1 min-h-[1.75rem] ${done ? 'bg-teal-500' : 'bg-slate-200'}`} />
              )}
            </div>

            {/* label */}
            <div className={`pb-5 ${!done && !current ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden>{meta.icon}</span>
                <p className={`font-bold ${current ? 'text-teal-700' : 'text-slate-800'}`}>{meta.label}</p>
              </div>
              <p className="text-sm text-slate-500">{entry?.note || meta.desc}</p>
              {entry?.at && <p className="mt-0.5 text-xs font-medium text-slate-400">{formatDate(entry.at)}</p>}
            </div>
          </li>
        )
      })}

      {rejected && (
        <li className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600">⛔</span>
          </div>
          <div>
            <p className="font-bold text-rose-600">Not accepted</p>
            <p className="text-sm text-slate-500">{entryFor('rejected')?.note || 'Government did not accept this report'}</p>
          </div>
        </li>
      )}
    </ol>
  )
}

export default Timeline
