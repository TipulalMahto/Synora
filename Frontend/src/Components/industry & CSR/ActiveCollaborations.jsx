import React, { useState } from 'react'
import { getCategory } from '../../data/categories.js'
import { api } from '../../lib/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import { statusMeta, statusProgress, statusBadgeClass } from '../../lib/status.js'

// Inline "Propose a Solution" composer — same pattern as the University
// portal. Captures real text from the CSR/industry team and advances the
// challenge status via the existing PATCH /api/reports/:id endpoint.
const ProposeSolutionForm = ({ onSubmit, onCancel, busy }) => {
  const [text, setText] = useState('')
  return (
    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <label className="mb-1 block text-xs font-bold text-amber-800">Describe your proposed solution</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="e.g. Deploy solar-powered water pumps sourced from our plants, co-funded under Section 135 CSR..."
        className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          disabled={busy || !text.trim()}
          onClick={() => onSubmit(text.trim())}
          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-60"
        >
          {busy ? 'Submitting…' : '💡 Submit Solution'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
          Cancel
        </button>
      </div>
    </div>
  )
}

const ActiveCollaborations = ({ reports = [], loading = false, onChanged, orgName }) => {
  const { toast } = useToast()
  const [busyId, setBusyId] = useState(null)
  const [composingId, setComposingId] = useState(null)

  async function advance(id, status, note) {
    setBusyId(id)
    try {
      await api.updateReport(id, { status, note })
      toast('Updated!')
      onChanged?.()
    } catch (err) {
      toast(err?.message || 'Could not update this challenge', { type: 'error' })
    } finally {
      setBusyId(null)
      setComposingId(null)
    }
  }

  return (
    <div id="industry-active" className="px-12 pb-14">
      {loading ? (
        <div className="w-full min-h-96.25 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm mt-6 flex items-center justify-center text-slate-400">
          Loading your collaborations…
        </div>
      ) : reports.length === 0 ? (
        <div className="w-full min-h-96.25 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm mt-6 flex items-center justify-center text-slate-400 text-center px-6">
          No active collaborations yet — offer support on an opportunity to get started.
        </div>
      ) : (
        <div className="grid gap-5 mt-6 sm:grid-cols-2 xl:grid-cols-3">
          {reports.map((r) => {
            const cat = getCategory(r.category)
            const meta = statusMeta(r.status)
            const progress = statusProgress(r.status)
            return (
              <div key={r.id} className="w-full rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                    <span>🏷️</span><span>{cat.en}</span>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusBadgeClass(r.status)}`}>
                    {meta.icon} {meta.label}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900">{r.title}</h2>
                {r.photos?.[0] && (
  <img src={r.photos[0]} alt="Citizen submitted photo"
    className="mb-4 h-40 w-full rounded-2xl object-cover border border-slate-100" />
)}
                {r.location && (r.location.village || r.location.district || r.location.pincode) && (
  <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
    <span className="flex items-center gap-1">
      📍 {[r.location.village, r.location.district, r.location.pincode].filter(Boolean).join(', ')}
    </span>
    <span className="flex items-center gap-1">
      📅 {new Date(r.createdAt).toLocaleDateString()}
    </span>
  </div>
)}

                <div className="mt-4">
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-linear-to-r from-amber-400 to-amber-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {r.assignedUniversity && (
                  <p className="mt-3 text-xs font-semibold text-indigo-700">🎓 Academic partner: {r.assignedUniversity}</p>
                )}

                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                  {r.status === 'collaboration' && composingId !== r.id && (
                    <button onClick={() => setComposingId(r.id)} className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600">
                      💡 Propose Solution
                    </button>
                  )}
                  {r.status === 'solution' && (
                    <button
                      onClick={() => advance(r.id, 'pilot', `Pilot funded by ${orgName}`)}
                      disabled={busyId === r.id}
                      className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60"
                    >
                      🧪 Start Pilot
                    </button>
                  )}
                  {r.status === 'pilot' && (
                    <button
                      onClick={() => advance(r.id, 'resolved', `${orgName} confirms the solution was scaled & delivered`)}
                      disabled={busyId === r.id}
                      className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      🎉 Mark Resolved
                    </button>
                  )}
                  {r.status === 'resolved' && (
                    <span className="rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 text-sm font-bold text-green-700">
                      🎉 Successfully Resolved
                    </span>
                  )}
                </div>

                {composingId === r.id && (
                  <ProposeSolutionForm
                    busy={busyId === r.id}
                    onCancel={() => setComposingId(null)}
                    onSubmit={(text) => advance(r.id, 'solution', `${orgName} proposed: ${text}`)}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ActiveCollaborations
