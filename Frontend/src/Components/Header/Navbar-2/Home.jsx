import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/')}
      className='bg-orange-400 text-black font-medium px-7 py-2 rounded-full'
    >
      Home
    </button>
  )
}

export default Home
