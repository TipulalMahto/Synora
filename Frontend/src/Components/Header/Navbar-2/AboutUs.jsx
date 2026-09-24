import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AboutUs = () => {
  const navigate = useNavigate()
  const location = useLocation()

  function goToAbout() {
    if (location.pathname === '/') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      // Wait for the home page to mount before scrolling to the section.
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <button
      onClick={goToAbout}
      className='bg-orange-400 text-black font-medium px-4 py-2 rounded-full'
    >
      AboutUs
    </button>
  )
}

export default AboutUs
