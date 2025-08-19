'use client'
import { assets, blog_data } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const Page = ({ params }) => {

  const [data, setData] = useState(null);

  const fetchBlogData = async () => {
    const response = await axios.get('/api/blog', {
      params: {
        id: params.id
      }
    })
    setData(response.data);
  }

  useEffect(() => {
    fetchBlogData();
  }, [])

  return (data ? <>
    <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
      <div className='flex justify-between items-center'>
        <Link href='/'>
          <Image src={assets.logo} width={180} height={60} alt='Blog Logo' className='w-[130px] sm:w-auto' />
        </Link>
        <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
          Get started <Image src={assets.arrow} width={20} height={20} alt='Arrow icon' />
        </button>
      </div>
      <div className='text-center my-24'>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto'>{data.title}</h1>
        <Image className='mx-auto mt-6 border border-white rounded-full' src={data.authorImg} width={60} height={60} alt={data.author} />
        <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
      </div>
    </div>
    <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
      <div className='text-center mb-12 w-full'>
        {data.image && data.image.startsWith('data:image') ? (
          // Handle base64 images
          <img 
            className='border-4 border-white shadow-lg rounded-lg inline-block' 
            src={data.image} 
            alt={data.title}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        ) : (
          // Handle regular images with Next.js Image component
          <Image 
            className='border-4 border-white shadow-lg rounded-lg inline-block' 
            src={data.image} 
            width={800} 
            height={480} 
            alt={data.title}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
      </div>
      
      <div className='blog-content mt-8 mb-12' dangerouslySetInnerHTML={{__html:data.description}}>
        
      </div>
      

    </div>
    <Footer />
  </> : <></>
  )
}

export default Page
