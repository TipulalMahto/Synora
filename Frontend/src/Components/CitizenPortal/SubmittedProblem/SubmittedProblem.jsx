import React from 'react'
import { ClipboardList, CirclePlus } from "lucide-react";
import { statusMeta, statusProgress, statusBadgeClass } from '../../../lib/status.js'

function goToReportForm() {
  document.getElementById('report-input')?.scrollIntoView({ behavior: 'smooth' })
}

function scrollToTracker() {
  document.getElementById('track-problem')?.scrollIntoView({ behavior: 'smooth' })
}

const SubmittedProblem = ({ reports = [], loading = false }) => {
  const count = reports.length

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">

      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-green-600" />

          <h2 className="text-2xl font-bold text-slate-900">
            My Submitted Problems ({count})
          </h2>
        </div>

        <button
          onClick={goToReportForm}
          className="flex items-center gap-1.5 text-green-700 font-semibold hover:text-green-800"
        >
          <CirclePlus className="w-5 h-5" />
          Submit New
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[30px] min-h-83.75 shadow-sm flex items-center justify-center text-slate-400">
          Loading your problems…
        </div>
      ) : count === 0 ? (
        /* Empty State Box */
        <div className="bg-white border border-slate-200 rounded-[30px] min-h-83.75 shadow-sm flex flex-col items-center justify-center text-center px-6">

          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-5">
            <ClipboardList className="w-9 h-9 text-green-700" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No Problems Reported Yet
          </h3>

          <p className="text-slate-500 text-base leading-5 max-w-120">
            You haven't submitted any societal challenges. Report an issue in
            <br />
            your village or town to get started.
          </p>

          <button
            onClick={goToReportForm}
            className="mt-5 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-7 py-4 rounded-2xl shadow-md transition"
          >
            <CirclePlus className="w-5 h-5" />
            Submit Your First Problem
          </button>

        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => {
            const meta = statusMeta(r.status)
            const progress = statusProgress(r.status)
            return (
              <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400">{r.id}</span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusBadgeClass(r.status)}`}>
                    {meta.icon} {meta.label}
                  </span>
                </div>
                <h3 className="mt-2 font-bold text-slate-900">{r.title}</h3>
                {r.photos?.[0] && (
  <img src={r.photos[0]} alt="Your submitted photo"
    className="mb-3 h-32 w-full rounded-xl object-cover border border-slate-100" />
)}
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{r.description}</p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-teal-400 to-teal-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {(r.assignedUniversity || r.assignedIndustry) && (
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                    {r.assignedUniversity && (
                      <span className="rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5">
                        🎓 {r.assignedUniversity}
                      </span>
                    )}
                    {r.assignedIndustry && (
                      <span className="rounded-full bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5">
                        🏭 {r.assignedIndustry}
                      </span>
                    )}
                  </div>
                )}

                {r.pending && (
                  <p className="mt-2 text-xs font-semibold text-amber-600">⏳ Waiting to sync</p>
                )}

                <button
                  onClick={scrollToTracker}
                  className="mt-3 text-xs font-bold text-teal-700 hover:underline"
                >
                  View full timeline →
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SubmittedProblem
