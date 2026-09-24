import React from 'react'
import { CATEGORIES } from '../../data/categories.js'
import { STATUS_ORDER, statusMeta } from '../../lib/status.js'

const BAR_COLORS = ['bg-green-700', 'bg-blue-700', 'bg-purple-700', 'bg-amber-700', 'bg-sky-600', 'bg-emerald-600', 'bg-rose-600', 'bg-orange-600', 'bg-indigo-600', 'bg-teal-600', 'bg-slate-600']

const STATUS_BAR_COLOR = {
  submitted: 'bg-slate-500',
  verified: 'bg-sky-600',
  gov_review: 'bg-amber-600',
  matching: 'bg-indigo-600',
  collaboration: 'bg-violet-600',
  solution: 'bg-yellow-600',
  pilot: 'bg-teal-600',
  resolved: 'bg-green-700',
}

const Graphs = ({ stats }) => {
  const byCategory = stats?.byCategory || {}
  const byDistrict = stats?.byDistrict || {}
  const byStatus = stats?.byStatus || {}

  const categoryBars = CATEGORIES
    .map((c) => ({ name: c.en, count: byCategory[c.key] || 0 }))
    .filter((c) => c.count > 0)
  const maxCount = Math.max(1, ...categoryBars.map((c) => c.count))

  const districtEntries = Object.entries(byDistrict).sort((a, b) => b[1] - a[1])
  const topDistrict = districtEntries[0]

  const statusBars = STATUS_ORDER.map((key) => ({ key, count: byStatus[key] || 0 }))
  const maxStatusCount = Math.max(1, ...statusBars.map((s) => s.count))

  const resolved = stats?.resolved ?? 0
  const total = stats?.total ?? 0
  const pendingLike = Math.max(0, total - resolved)
  const resolvedPct = total ? Math.round((resolved / total) * 100) : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 bg-[#f8fafc]">

  {/* Complaint Status Distribution */}
  <div className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm">
    <div className="flex items-center gap-3">
      <span className="text-2xl text-indigo-600">📊</span>
      <h2 className="text-xl font-bold text-slate-900">
        Complaint Status Distribution
      </h2>
    </div>

    <p className="text-sm text-slate-500 mt-1">
      Where every challenge currently sits in the pipeline
    </p>

    {total === 0 ? (
      <div className="flex h-52 mt-8 items-center justify-center text-sm text-slate-400">
        No reports yet — the chart fills in as citizens submit problems.
      </div>
    ) : (
      <div className="mt-6 space-y-3">
        {statusBars.map(({ key, count }) => {
          const meta = statusMeta(key)
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-36 shrink-0 text-sm font-semibold text-slate-700 flex items-center gap-1">
                <span>{meta.icon}</span> {meta.label}
              </span>
              <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${STATUS_BAR_COLOR[key] || 'bg-slate-500'}`}
                  style={{ width: `${(count / maxStatusCount) * 100}%` }}
                ></div>
              </div>
              <span className="w-6 text-right text-sm font-bold text-slate-700">{count}</span>
            </div>
          )
        })}
      </div>
    )}
  </div>

  {/* Resolved vs Pending */}
  <div className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm flex flex-col">
    <div className="flex items-center gap-3">
      <span className="text-2xl text-green-600">✅</span>
      <h2 className="text-xl font-bold text-slate-900">
        Resolved vs Pending
      </h2>
    </div>

    <p className="text-sm text-slate-500 mt-1">
      Overall resolution progress across the state
    </p>

    {total === 0 ? (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
        No reports yet
      </div>
    ) : (
      <div className="mt-8 flex flex-1 flex-col items-center justify-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 40 40" className="h-40 w-40 -rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke="#f1f5f9" strokeWidth="6" />
            <circle
              cx="20" cy="20" r="16" fill="none" stroke="#15803d" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${(resolvedPct / 100) * 100.5} 100.5`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900">{resolvedPct}%</span>
            <span className="text-xs font-semibold text-slate-400">Resolved</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 w-full">
          <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center">
            <p className="text-2xl font-extrabold text-green-700">{resolved}</p>
            <p className="text-xs font-semibold text-green-600 mt-1">Resolved</p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
            <p className="text-2xl font-extrabold text-amber-700">{pendingLike}</p>
            <p className="text-xs font-semibold text-amber-600 mt-1">In Progress</p>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Domain-wise Problem Volume */}
  <div className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm h-112.5">
    <div className="flex items-center gap-3">
      <span className="text-2xl text-green-600">▥</span>
      <h2 className="text-xl font-bold text-slate-900">
        Domain-wise Problem Volume
      </h2>
    </div>

    <p className="text-sm text-slate-500 mt-1">
      Distribution of citizen reports across key development sectors
    </p>

    {/* Chart area */}
    {categoryBars.length === 0 ? (
      <div className="flex h-67.5 mt-8 items-center justify-center text-sm text-slate-400">
        No reports yet — the chart fills in as citizens submit problems.
      </div>
    ) : (
      <div className="flex items-end justify-between h-67.5 mt-8 px-3 border-l border-b border-slate-400 gap-2 overflow-x-auto">
        {categoryBars.map(({ name, count }, i) => (
          <div key={name} className="flex flex-col items-center justify-end h-full">
            <span className="text-xs font-bold text-slate-600 mb-1">{count}</span>
            <div
              className={`w-16 ${BAR_COLORS[i % BAR_COLORS.length]} rounded-t-lg`}
              style={{ height: `${Math.max(8, (count / maxCount) * 220)}px` }}
            ></div>
            <span className="text-xs text-slate-500 mt-3 rotate-25 origin-top whitespace-nowrap">
              {name}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* District Impact Breakdown */}
  <div className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm h-112.5">
    <div className="flex items-center gap-3">
      <span className="text-2xl text-orange-500">◴</span>
      <h2 className="text-xl font-bold text-slate-900">
        District Impact Breakdown
      </h2>
    </div>

    <p className="text-sm text-slate-500 mt-1">
      Top districts by reported societal challenges
    </p>

    {districtEntries.length === 0 ? (
      <div className="flex h-77.5 items-center justify-center text-sm text-slate-400">
        No district data yet
      </div>
    ) : (
      <div className="mt-8 space-y-3 max-h-77.5 overflow-y-auto pr-2">
        {districtEntries.map(([district, count]) => (
          <div key={district} className="flex items-center gap-3">
            <span className="w-36 shrink-0 text-sm font-semibold text-slate-700 truncate">{district}</span>
            <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-green-700 rounded-full"
                style={{ width: `${(count / (topDistrict?.[1] || 1)) * 100}%` }}
              ></div>
            </div>
            <span className="w-8 text-right text-sm font-bold text-green-700">{count}</span>
          </div>
        ))}
      </div>
    )}
  </div>

</div>
  )
}

export default Graphs
