import React from 'react'
import Logo from './Logo'
import Synora from './Synora'
import Jharkhand from './Jharkhand'
import JharkhandLogo from './JharkhandLogo'
import Button from './Button'

const Navbar1 = () => {
  return (
    <div className='w-full h-26.25 bg-linear-to-r from-orange-500 via-white to-green-600 flex items-center justify-between px-8 shadow-md'>
      <div className='flex items-center gap-5'>
        <Logo/>
        <div className='flex flex-col'>
          <Synora/>
          <Jharkhand/>
        </div>
      </div>
      <div className='flex items-center gap-5'>
        <JharkhandLogo/>
        <Button/>
      </div>
    </div>
  )
}

export default Navbar1