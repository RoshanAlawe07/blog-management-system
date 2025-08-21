"use client";

import { assets } from '@/Assets/assets'
import axios from 'axios';
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Link from 'next/link';
import AuthButton from './AuthButton';

const Header = () => {

  const [email,setEmail] = useState("");

  const onSubmitHandler = async (e) =>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("email",email);
    const response = await axios.post('/api/email',formData);
    if (response.data.success) {
      toast.success(response.data.msg);
      setEmail("");
    }
    else{
      toast.error("Error")
    }
  }

  const handleGetStarted = () => {
    // Scroll to the blog section
    const blogSection = document.querySelector('.blog-section');
    if (blogSection) {
      blogSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className='py-8 px-8 md:px-16 lg:px-32'>
      <div className='flex justify-between items-center'>
        <Image src={assets.logo} width={180} height={60} alt='Blog Logo' className='w-[130px] sm:w-auto'/>
        <div className='flex gap-4 items-center'>
          <button 
            onClick={handleGetStarted}
            className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000] hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer'
          >
            Get started <Image src={assets.arrow} width={12} height={12} alt="Arrow icon" />
          </button>
          <AuthButton />
        </div>
      </div>
      <div className='text-center my-8'>
        <h1 className='text-3xl sm:text-5xl font-medium mb-4'>Latest Blogs</h1>
        <form onSubmit={onSubmitHandler} className='flex justify-between max-w-[400px] mx-auto mt-8 border border-black shadow-[-7px_7px_0px_#000000] rounded-lg overflow-hidden' action="">
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Enter your email' className='pl-4 py-3 outline-none flex-1 text-sm' required />
            <button type='submit' className='border-l border-black py-3 px-4 active:bg-gray-600 active:text-white font-medium text-sm'>Subscribe</button>
        </form>
      </div>
    </div>
  )
}

export default Header
