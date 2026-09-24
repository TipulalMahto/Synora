import React, { useState } from 'react'
import { api } from '../../../lib/api.js'
import { useToast } from '../../../context/ToastContext.jsx'
import { statusMeta, statusProgress, statusBadgeClass } from '../../../lib/status.js'
import Timeline from './Timeline.jsx'

const TrackProblem = () => {
  const { toast } = useToast()
  const [trackingId, setTrackingId] = useState('')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [reopening, setReopening] = useState(false)
  const [notFound, setNotFound] = useState(false)

  async function handleTrack() {
    const id = trackingId.trim()
    if (!id) {
      toast('Please enter a tracking number', { type: 'error' })
      return
    }
    setBusy(true)
    setNotFound(false)
    setResult(null)
    try {
      const report = await api.getReport(id)
      if (report) {
        setResult(report)
      } else {
        setNotFound(true)
      }
    } catch {
      setNotFound(true)
    } finally {
      setBusy(false)
    }
  }

  async function handleReopen() {
    if (!result) return
    setReopening(true)
    try {
      const updated = await api.reopenReport(result.id, 'Citizen reports the issue still persists')
      setResult(updated)
      toast('Marked as reopened — government has been notified')
    } catch (err) {
      toast(err?.message || 'Could not reopen this report', { type: 'error' })
    } finally {
      setReopening(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleTrack()
  }

  function goToReportForm() {
    document.getElementById('report-input')?.scrollIntoView({ behavior: 'smooth' })
  }

  const meta = result ? statusMeta(result.status) : null

  return (
    <div id="track-problem" className="mb-25 w-full max-w-3xl mx-auto rounded-2xl border border-yellow-400 bg-[#fff8e9] shadow-lg overflow-hidden">

  {/* Header */}
  <div className="border-b border-yellow-400 px-6 py-6">
    <h2 className="text-center text-xl font-bold text-gray-900">
      Track Complaint
    </h2>

    <div className="mt-4 h-1.5 w-1/2 mx-auto bg-cyan-400"></div>
  </div>

  {/* Content */}
  <div className="px-6 py-12">

    <h1 className="text-2xl font-medium text-teal-600 mb-5">
      Track Your Complaint Status
    </h1>

    <label className="block text-lg font-bold text-gray-900 mb-5">
      Tracking number
    </label>

    <input
      id="tracker-input"
      type="text"
      value={trackingId}
      onChange={(e) => setTrackingId(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="e.g. SS-20100"
      className="w-full rounded-full bg-[#effff8] px-10 py-5 text-lg text-gray-700
                 shadow-md outline-none
                 placeholder:text-gray-500
                 focus:ring-2 focus:ring-teal-400"
    />

    <p className="mt-5 text-lg leading-7 text-gray-700">
      The tracking number was shown to you right after you submitted the complaint.
      You can also find it on the "My Submitted Problems" card below.
    </p>

    <button
      onClick={handleTrack}
      disabled={busy}
      className="mt-6 w-full rounded-full bg-teal-600 py-4
                 text-lg font-bold text-white
                 hover:bg-teal-700 transition disabled:opacity-60"
    >
      {busy ? 'Searching…' : 'Track now'}
    </button>

    <button
      onClick={goToReportForm}
      className="mt-8 block mx-auto text-lg font-bold text-blue-700
                 hover:underline"
    >
      Register a Complaint
    </button>

    {notFound && (
      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
        No complaint found for tracking number "{trackingId.trim()}". Please double-check and try again.
      </div>
    )}

    {result && (
      <div className="mt-6 rounded-2xl border border-teal-200 bg-white px-5 py-6 shadow-sm">

        {/* Summary */}
        <div className="flex items-center justify-between">
          <p className="font-mono text-sm text-slate-500">{result.id}</p>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusBadgeClass(result.status)}`}>
            {meta.icon} {meta.label}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-bold text-slate-900">{result.title}</h3>
        <p className="mt-1 text-sm text-slate-600">{result.description}</p>
        {result.location?.label && (
          <p className="mt-2 text-sm text-slate-500">📍 {result.location.label}</p>
        )}

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Progress</span>
            <span>{statusProgress(result.status)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-teal-400 to-teal-600 transition-all"
              style={{ width: `${statusProgress(result.status)}%` }}
            />
          </div>
        </div>

        {/* Partners */}
        {(result.assignedUniversity || result.assignedIndustry) && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            {result.assignedUniversity && (
              <span className="rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1">
                🎓 {result.assignedUniversity}
              </span>
            )}
            {result.assignedIndustry && (
              <span className="rounded-full bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1">
                🏭 {result.assignedIndustry}
              </span>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="mb-3 text-sm font-bold text-slate-700">Complaint Timeline</p>
          <Timeline report={result} />
        </div>

        {/* Reopen */}
        {result.status === 'resolved' && (
          <button
            onClick={handleReopen}
            disabled={reopening}
            className="mt-2 w-full rounded-xl border border-rose-200 bg-rose-50 py-3 text-sm font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-60"
          >
            {reopening ? 'Reopening…' : '🔄 Issue still not fixed? Reopen this complaint'}
          </button>
        )}
      </div>
    )}

  </div>
</div>
  )
}

export default TrackProblem
