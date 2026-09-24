import React from 'react'
import { useNavigate } from 'react-router-dom'
import CitizenPortal from '../../CitizenPortal/CitizenPortal'

const Citizen = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/CitizenPortal')}
      className='bg-orange-400 text-black font-medium px-4 py-2 rounded-full'
    >
      Citizen Portal
    </button>
  )
}

export default Citizen