import React from 'react'
import { ShieldCheck, MapPin, Hand } from "lucide-react";
import { useAuth } from '../../../context/AuthContext.jsx'

const WelcomeProfile = () => {
  const { user } = useAuth()
  const displayName = user?.name || 'Citizen'

  return (
    <div className="mx-9 mt-3 flex h-42.75 items-center justify-between rounded-[30px] bg-linear-to-r from-[#117c46] to-[#075b50] px-7 text-white shadow-lg">

      {/* Left */}
      <div>
        {/* Badge */}
        <div className="mb-2 flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-semibold">
          <ShieldCheck size={17} />
          Citizen Problem Monitoring Hub
        </div>

        {/* Name */}
        <h1 className="text-[36px] font-bold leading-none">
          Welcome, {displayName}
          <span className="ml-2">👋</span>
        </h1>

        {/* Location */}
        <div className="mt-3 flex items-center gap-2 text-[18px]">
          <MapPin size={18} />
          <span>
            {user?.org || 'Jharkhand'} · {user ? 'Registered Citizen' : 'Guest — please log in'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default WelcomeProfile
