import React, { useMemo, useState } from 'react'
import { CATEGORIES, getCategory } from '../../data/categories.js'
import { DISTRICT_NAMES } from '../../data/districts.js'
import { api } from '../../lib/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import { STATUS_ORDER, statusMeta, statusBadgeClass } from '../../lib/status.js'

// What action(s) government can take, given a report's current status.
// Mirrors the conceptual flow: verify -> review -> forward for matching ->
// (university/industry take it from here) -> government can still step in
// to resolve or reject at any point.
function actionsFor(status) {
  switch (status) {
    case 'submitted':
      return [
        { key: 'verify', label: '✅ Verify', next: 'verified', note: 'Verified by government', cls: 'bg-sky-600 hover:bg-sky-700' },
        { key: 'reject', label: '⛔ Reject', next: 'rejected', note: 'Not accepted by government', cls: 'bg-rose-100 hover:bg-rose-200 !text-rose-700' },
      ]
    case 'verified':
    case 'reopened':
      return [
        { key: 'review', label: '🏛️ Move to Review', next: 'gov_review', note: 'Sent for departmental review', cls: 'bg-amber-600 hover:bg-amber-700' },
      ]
    case 'gov_review':
      return [
        { key: 'forward', label: '🎯 Forward for Matching', next: 'matching', note: 'Approved & routed to University/Industry matching', cls: 'bg-indigo-600 hover:bg-indigo-700' },
        { key: 'reject', label: '⛔ Reject', next: 'rejected', note: 'Not accepted after review', cls: 'bg-rose-100 hover:bg-rose-200 !text-rose-700' },
      ]
    case 'matching':
    case 'collaboration':
    case 'solution':
    case 'pilot':
      return [
        { key: 'resolve', label: '🎉 Mark Resolved', next: 'resolved', note: 'Verified & closed by government', cls: 'bg-green-600 hover:bg-green-700' },
      ]
    default:
      return []
  }
}

const Data = ({ reports = [], loading = false, onChanged }) => {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState('all')
  const [district, setDistrict] = useState('all')
  const [status, setStatus] = useState('all')
  const [busyId, setBusyId] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return reports.filter((r) => {
      if (domain !== 'all' && r.category !== domain) return false
      if (district !== 'all' && r.location?.district !== district) return false
      if (status !== 'all' && r.status !== status) return false
      if (!q) return true
      return (
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        (r.location?.district || '').toLowerCase().includes(q) ||
        (r.assignedUniversity || '').toLowerCase().includes(q)
      )
    })
  }, [reports, search, domain, district, status])

  async function act(id, next, note) {
    setBusyId(id)
    try {
      await api.updateReport(id, { status: next, note })
      toast('Challenge updated')
      onChanged?.()
    } catch (err) {
      toast(err?.message || 'Could not update this challenge', { type: 'error' })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

  {/* Header */}
  <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
    <div>
      <h2 className="text-lg font-bold text-slate-900">
        📄 Challenge Management & Ecosystem Activity
      </h2>
      <p className="text-sm text-slate-500">
        Verify, review, forward and resolve challenges — real-time log of grassroots problems, university teams and CSR commitments
      </p>
    </div>

    <span className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700">
      {filtered.length} Documented Records
    </span>
  </div>

  {/* Search + Filters */}
  <div className="flex flex-wrap gap-3 mb-4">
    <div className="flex-1 min-w-50 flex items-center gap-2 px-4 h-10 border border-slate-200 rounded-2xl bg-slate-50">
      <span className="text-slate-400">⌕</span>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-transparent outline-none text-sm"
        placeholder="Search by Tracking ID, title, district, or university..."
      />
    </div>

    <select
      value={domain}
      onChange={(e) => setDomain(e.target.value)}
      className="w-44 h-10 px-4 border border-slate-200 rounded-2xl bg-slate-50 text-sm text-slate-700"
    >
      <option value="all">All Domains</option>
      {CATEGORIES.map((c) => (
        <option key={c.key} value={c.key}>{c.en}</option>
      ))}
    </select>

    <select
      value={district}
      onChange={(e) => setDistrict(e.target.value)}
      className="w-36 h-10 px-4 border border-slate-200 rounded-2xl bg-slate-50 text-sm text-slate-700"
    >
      <option value="all">All Districts</option>
      {DISTRICT_NAMES.map((d) => (
        <option key={d} value={d}>{d}</option>
      ))}
    </select>

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="w-44 h-10 px-4 border border-slate-200 rounded-2xl bg-slate-50 text-sm text-slate-700"
    >
      <option value="all">All Statuses</option>
      {STATUS_ORDER.map((key) => (
        <option key={key} value={key}>{statusMeta(key).label}</option>
      ))}
    </select>
  </div>

  {/* Table */}
  <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr className="text-left text-xs font-semibold text-slate-600 uppercase">
          <th className="px-4 py-4">Tracking ID</th>
          <th className="px-4 py-4">Problem Title & Location</th>
          <th className="px-4 py-4">Domain</th>
          <th className="px-4 py-4">Assigned HEI</th>
          <th className="px-4 py-4">CSR Partner</th>
          <th className="px-4 py-4">Status</th>
          <th className="px-4 py-4">Actions</th>
          <th className="px-4 py-4">Photos</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>
        ) : filtered.length === 0 ? (
          <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">No records match your filters yet.</td></tr>
        ) : (
          filtered.map((r) => {
            const cat = getCategory(r.category)
            const meta = statusMeta(r.status)
            const actions = actionsFor(r.status)
            return (
              <tr key={r.id} className="border-b border-slate-100 align-top">
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                    {r.id}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <p className="font-bold text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-500">📍 {[r.location.village, r.location.district, r.location.pincode].filter(Boolean).join(', ')}</p>
                </td>

                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-600">
                    {cat.en}
                  </span>
                </td>

                <td className={`px-4 py-4 ${r.assignedUniversity ? 'font-semibold text-slate-700' : 'italic text-slate-400'}`}>
                  {r.assignedUniversity || 'Unassigned'}
                </td>

                <td className={`px-4 py-4 ${r.assignedIndustry ? 'font-semibold text-slate-700' : 'italic text-slate-400'}`}>
                  {r.assignedIndustry || 'Awaiting CSR'}
                </td>

                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${statusBadgeClass(r.status)}`}>
                    {meta.icon} {meta.label}
                  </span>
                </td>

                <td className="px-4 py-4">
                  {actions.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No action needed</span>
                  ) : (
                    <div className="flex flex-col gap-1.5 min-w-40">
                      {actions.map((a) => (
                        <button
                          key={a.key}
                          onClick={() => act(r.id, a.next, a.note)}
                          disabled={busyId === r.id}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold text-white transition disabled:opacity-60 ${a.cls}`}
                        >
                          {busyId === r.id ? '…' : a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
  {r.photos?.[0] ? (
    <button type="button" onClick={() => window.open(r.photos[0], '_blank')} title="Click to view full photo">
      <img src={r.photos[0]} alt="Citizen submitted photo"
        className="h-12 w-12 rounded-lg object-cover border border-slate-200 hover:opacity-80 transition" />
    </button>
  ) : (
    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-300 text-xs">No photo</span>
  )}
</td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  </div>
</div>
  )
}

export default Data
