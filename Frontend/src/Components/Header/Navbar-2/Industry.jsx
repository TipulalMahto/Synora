import React from 'react'
import { useNavigate } from 'react-router-dom'

const Industry = () => {
    const navigate = useNavigate()

  return (
    <button onClick={()=>{navigate('/Industry')}} className='bg-orange-400 text-black font-medium px-4 py-2 rounded-full'>Industry & CSR</button>
  )
}

export default Industry