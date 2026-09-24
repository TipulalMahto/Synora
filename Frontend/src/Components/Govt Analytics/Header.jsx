import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

function KpiCard({ label, value, sub, subClass, dark }) {
  return (
    <div className={`rounded-3xl p-5 shadow-sm ${dark ? 'bg-linear-to-br from-[#12294d] to-[#0b1c38] text-white' : 'border border-slate-200 bg-white'}`}>
      <p className={`text-xs font-bold tracking-wide ${dark ? 'text-white/70' : 'text-slate-400'}`}>{label}</p>
      <h2 className={`mt-3 text-3xl font-black leading-none ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</h2>
      {sub && <p className={`mt-2 text-xs font-bold ${dark ? 'text-white/80' : subClass}`}>{sub}</p>}
    </div>
  )
}

const Header = ({ stats, onExport }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const total = stats?.total ?? 0
  const pendingVerification = stats?.byStatus?.submitted ?? 0
  const underReview = stats?.byStatus?.gov_review ?? 0
  const solutionProposed = stats?.byStatus?.solution ?? 0
  const underCollaboration = (stats?.byStatus?.matching ?? 0) + (stats?.byStatus?.collaboration ?? 0)
  const resolved = stats?.byStatus?.resolved ?? 0

  return (
    <div className="bg-slate-50 p-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-13 h-13 rounded-2xl border bg-white shadow-sm"
          >
            ←
          </button>

          <div>
            <h1 className="text-3xl font-black text-slate-950">
              State Analytics & Oversight Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Government of Jharkhand · Citizen Grievance & Collaboration Monitoring Unit
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="hidden sm:flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
            👤 {user?.name || 'Government Admin'}
          </span>
          <button
            onClick={onExport}
            className="bg-orange-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-orange-700 transition"
          >
            ↓ Export State Report (CSV)
          </button>

          <button
            onClick={() => { logout(); navigate('/') }}
            className="w-13 h-13 rounded-2xl border bg-white text-red-500"
          >
            ↪
          </button>
        </div>
      </div>

      {/* Primary KPI row — exactly the metrics government needs to run the pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="TOTAL COMPLAINTS" value={total} sub="All challenges filed" subClass="text-slate-500" />
        <KpiCard label="PENDING VERIFICATION" value={pendingVerification} sub="Awaiting first review" subClass="text-amber-600" />
        <KpiCard label="UNDER REVIEW" value={underReview} sub="With government desk" subClass="text-orange-600" />
        <KpiCard label="SOLUTION PROPOSED" value={solutionProposed} sub="Awaiting pilot" subClass="text-yellow-700" />
        <KpiCard label="UNDER COLLABORATION" value={underCollaboration} sub="With HEI / Industry" subClass="text-violet-600" dark />
        <KpiCard label="SUCCESSFULLY RESOLVED" value={resolved} sub={`${stats?.resolutionRate ?? 0}% resolution rate`} subClass="text-green-600" />
      </div>
    </div>
  )
}

export default Header
