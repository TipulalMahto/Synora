import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  LogOut,
  FileCheck2,
  HandCoins,
  Rocket,
} from "lucide-react";
import { useAuth } from '../../context/AuthContext.jsx'

const Header = ({ activeCount = 0, openCount = 0, tab = 'opportunities', onTabChange }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="w-full bg-[#f8fafc] px-12 py-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate('/')}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600"
          >
            <ArrowLeft size={23} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-violet-600">▤</span>

              <h1 className="text-[24px] font-extrabold text-[#111827]">
                Industry & CSR Investment Portal
              </h1>
            </div>

            <p className="mt-1 text-[15px] text-slate-500">
              {user?.org || 'CSR Partner'} · Section 135 CSR Deployment & R&D Scaling
            </p>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/') }}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-200 bg-white text-red-500"
        >
          <LogOut size={20} />
        </button>
      </div>


      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">

        {/* Card 1 */}
        <div className="flex h-33.75 items-center gap-5 rounded-[30px] border border-slate-200 bg-white px-6 shadow-sm">

          <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <FileCheck2 size={27} />
          </div>

          <div>
            <p className="text-[15px] font-bold tracking-wide text-slate-400 ">
              ACTIVE COLLABORATIONS
            </p>

            <p className="mt-1 text-[31px] font-extrabold leading-none text-slate-900">
              {activeCount}
            </p>

            <p className="mt-2 text-sm font-bold text-emerald-600">
              With University R&D Teams
            </p>
          </div>
        </div>


        {/* Card 2 */}
        <div className="flex h-33.75 items-center gap-5 rounded-[30px] px-6 text-slate-900 shadow-[0_12px_25px_rgba(75,35,140,0.25)]">

          <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <HandCoins size={28} />
          </div>

          <div>
            <p className="text-[15px] font-bold tracking-wide text-slate-400">
              OPEN FOR CSR FUNDING
            </p>

            <p className="mt-1 text-[31px] font-extrabold leading-none">
              {openCount}
            </p>

            <p className="mt-2 text-sm font-bold text-emerald-600">
              Challenges Awaiting Adoption
            </p>
          </div>
        </div>


        {/* Card 3 */}
        <div className="flex h-33.75 items-center gap-5 rounded-[30px] border border-slate-200 bg-white px-6 shadow-sm">

          <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600">
            <Rocket size={28} />
          </div>

          <div>
            <p className="text-[15px] font-bold tracking-wide text-slate-400">
              PILOTS & DEPLOYED
            </p>

            <p className="mt-1 text-[31px] font-extrabold leading-none text-slate-900">
              {activeCount}
            </p>

            <p className="mt-2 text-sm font-bold text-emerald-600">
              Field Validated & Scaling
            </p>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="mt-6 inline-flex gap-2 rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => onTabChange?.('opportunities')}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${tab === 'opportunities' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
        >
          🎯 Opportunities to Collaborate
        </button>
        <button
          onClick={() => onTabChange?.('active')}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${tab === 'active' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
        >
          🤝 Active Collaborations
        </button>
      </div>
    </div>
  )
}

export default Header
