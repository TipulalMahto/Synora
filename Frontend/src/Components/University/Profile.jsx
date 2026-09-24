import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const Profile = ({ openCount = 0, inDevCount = 0, total = 0, tab = 'open', onTabChange }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div>
        <div className="bg-[#f8fafc] px-14 pt-7">

  {/* Top Header */}
  <div className="flex items-center justify-between flex-wrap gap-4">

    {/* Left */}
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate('/')}
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl text-slate-600"
      >
        ←
      </button>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>

          <h1 className="text-[25px] font-bold text-[#07152f]">
            Challenges Board
          </h1>
        </div>

        <p className="text-[15px] text-slate-500">
          HEI Portal · Accept open problems for R&D
        </p>
      </div>
    </div>

    {/* Right */}
    <div className="flex items-center gap-3">
      <span className="rounded-full border border-yellow-300 bg-yellow-50 px-5 py-2 text-sm font-semibold text-yellow-700">
        {openCount} Open
      </span>

      <span className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">
        {inDevCount} In Dev
      </span>

      <button
        onClick={() => { logout(); navigate('/') }}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-white text-xl text-red-500"
      >
        ⇥
      </button>
    </div>

  </div>


  {/* Welcome Banner */}
  <div className="mt-9 flex flex-wrap items-center justify-between gap-4 rounded-[19px] bg-linear-to-r from-[#2450d8] to-[#4935c9] px-5 py-4">

    {/* Profile */}
    <div className="flex items-center gap-5">

      <div>
        <h2 className="text-[18px] font-bold text-white">
          Welcome, {user?.name || 'Faculty'} 🎓
        </h2>

        <p className="text-[15px] text-blue-100">
          {user?.org || 'Faculty / HEI Lead'} · {total} challenges tracked
        </p>
      </div>

    </div>

    {/* Tabs */}
    <div className="flex gap-2 rounded-xl bg-white/15 p-1">
      <button
        onClick={() => onTabChange?.('open')}
        className={`rounded-lg px-4 py-2 text-sm font-bold transition ${tab === 'open' ? 'bg-white text-[#2450d8]' : 'text-white/90'}`}
      >
        🎯 Open Challenges
      </button>
      <button
        onClick={() => onTabChange?.('projects')}
        className={`rounded-lg px-4 py-2 text-sm font-bold transition ${tab === 'projects' ? 'bg-white text-[#2450d8]' : 'text-white/90'}`}
      >
        🚀 My Projects
      </button>
    </div>

  </div>

</div>
    </div>
  )
}

export default Profile
