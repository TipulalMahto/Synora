import React from 'react'
import { useNavigate } from 'react-router-dom'

const University = () => {
    const navigate = useNavigate()

  return (
    <button onClick={()=>{navigate('/University')}} className='bg-orange-400 text-black font-medium px-4 py-2 rounded-full'>HEI/University</button>
  )
}

export default University