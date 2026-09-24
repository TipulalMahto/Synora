import React, { useMemo, useState } from 'react'
import { CATEGORIES, getCategory } from '../../data/categories.js'
import { DISTRICT_NAMES } from '../../data/districts.js'
import { api } from '../../lib/api.js'
import { useToast } from '../../context/ToastContext.jsx'

const STATUS_LABEL = {
  submitted: 'Pending AI',
  verified: 'Verified',
  gov_review: 'Pending R&D Team',
  matching: 'Matching',
  collaboration: 'In Collaboration',
  solution: 'Solution Proposed',
  pilot: 'Pilot',
  resolved: 'Resolved',
  reopened: 'Reopened',
}

const Challenge = ({ reports = [], loading = false, onChanged, orgName, onAdopted }) => {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState('all')
  const [district, setDistrict] = useState('all')
  const [adoptingId, setAdoptingId] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return reports.filter((r) => {
      if (domain !== 'all' && r.category !== domain) return false
      if (district !== 'all' && r.location?.district !== district) return false
      if (!q) return true
      return (
        r.title.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        (r.location?.district || '').toLowerCase().includes(q)
      )
    })
  }, [reports, search, domain, district])

  async function handleAdopt(id) {
    setAdoptingId(id)
    try {
      await api.updateReport(id, {
        assignedUniversity: orgName || 'University Team',
        status: 'collaboration',
        note: `${orgName || 'University'} showed interest and adopted this challenge for R&D`,
      })
      toast('Challenge adopted — check "My Projects" to propose a solution!')
      onChanged?.()
      onAdopted?.()
    } catch (err) {
      toast(err?.message || 'Could not adopt this challenge', { type: 'error' })
    } finally {
      setAdoptingId(null)
    }
  }

  return (
    <div id="university-board">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

  {/* Search */}
  <div className="flex h-13 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
    <span className="mr-3 text-xl text-slate-400">⌕</span>

    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by title, description, or district..."
      className="w-full bg-transparent text-[17px] text-slate-700 outline-none placeholder:text-slate-400"
    />
  </div>

  {/* Filters */}
  <div className="mt-4 flex gap-3">

    <select
      value={domain}
      onChange={(e) => setDomain(e.target.value)}
      className="h-11 w-54 appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
    >
      <option value="all">All Domains</option>
      {CATEGORIES.map((c) => (
        <option key={c.key} value={c.key}>{c.en}</option>
      ))}
    </select>

    <select
      value={district}
      onChange={(e) => setDistrict(e.target.value)}
      className="h-11 w-54 appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
    >
      <option value="all">All Districts</option>
      {DISTRICT_NAMES.map((d) => (
        <option key={d} value={d}>{d}</option>
      ))}
    </select>

  </div>

  {/* Result */}
  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-400">
    <span>▽</span>
    <span>
      Showing <span className="text-slate-700">{filtered.length}</span> of {reports.length} challenges
    </span>
  </div>

</div>

{loading ? (
  <div className="w-full min-h-96.25 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm mt-5 flex items-center justify-center text-slate-400">
    Loading challenges…
  </div>
) : filtered.length === 0 ? (
  <div className="w-full min-h-96.25 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm mt-5 flex items-center justify-center text-slate-400 text-center px-6">
    No open challenges match your filters yet. New citizen reports will appear here.
  </div>
) : (
  <div className="grid gap-5 mt-5 sm:grid-cols-2 xl:grid-cols-3">
    {filtered.map((r) => {
      const cat = getCategory(r.category)
      return (
        <div key={r.id} className="w-full min-h-96.25 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col">

          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
              <span>🏷️</span>
              <span>{cat.en}</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
              <span>◷</span>
              <span>{STATUS_LABEL[r.status] || r.status}</span>
            </div>
          </div>

          {/* Content */}
          <div className="mt-4 flex-1">
            <h2 className="text-lg font-bold text-slate-900">
              {r.title}
            </h2>
                {r.photos?.[0] && (
  <img src={r.photos[0]} alt="Citizen submitted photo"
    className="mb-4 h-40 w-full rounded-2xl object-cover border border-slate-100" />
)}
            <p className="mt-4 text-base text-slate-500 line-clamp-3">
              {r.description}
            </p>

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
          </div>

          {/* Button */}
          <button
            onClick={() => handleAdopt(r.id)}
            disabled={adoptingId === r.id}
            className="mt-6 flex h-15 w-full items-center justify-center gap-2 rounded-[20px] bg-blue-600 text-base font-bold text-white shadow-[0_6px_12px_rgba(37,99,235,0.25)] transition hover:bg-blue-700 disabled:opacity-60"
          >
            <span>♧</span>
            <span>{adoptingId === r.id ? 'Adopting…' : 'Accept Challenge for R&D'}</span>
          </button>

        </div>
      )
    })}
  </div>
)}
    </div>
  )
}

export default Challenge
