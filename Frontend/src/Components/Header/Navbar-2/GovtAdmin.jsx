import React from 'react'
import { useNavigate } from 'react-router-dom'

const Industry = () => {
    const navigate = useNavigate()

  return (
    <button onClick={()=>{navigate('/GovtAdmin')}} className='bg-orange-400 text-black font-medium px-4 py-2 rounded-full'>Govt. Admin</button>
  )
}

export default Industry