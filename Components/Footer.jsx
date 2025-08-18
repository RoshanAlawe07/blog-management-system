import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div className='bg-black py-4 px-4'>
      <div className='max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8'>
        {/* Logo */}
        <div className='flex-shrink-0'>
          <Image src={assets.logo_light} alt='Blog Logo' width={160} height={60} className='w-32 sm:w-40' />
        </div>
        
        {/* Copyright Text */}
        <div className='text-center sm:text-left flex-shrink-0'>
          <p className='text-base text-white font-semibold'>All rights reserved. Copyright © 2024 Blogger</p>
        </div>
        
        {/* Social Media Icons */}
        <div className='flex gap-3 flex-shrink-0'>
          <Image src={assets.facebook_icon} alt='Facebook' width={24} height={24} className='w-6 h-6 hover:opacity-80 transition-opacity cursor-pointer' />
          <Image src={assets.twitter_icon} alt='Twitter' width={24} height={24} className='w-6 h-6 hover:opacity-80 transition-opacity cursor-pointer' />
          <Image src={assets.googleplus_icon} alt='Google Plus' width={24} height={24} className='w-6 h-6 hover:opacity-80 transition-opacity cursor-pointer' />
        </div>
      </div>
    </div>
  )
}

export default Footer
