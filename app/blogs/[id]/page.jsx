'use client'
import { assets, blog_data } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react'

const Page = ({ params }) => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/blog', {
        params: {
          id: params.id
        }
      });
      setData(response.data);
    } catch (err) {
      console.error('Error fetching blog data:', err);
      setError('Failed to load blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchBlogData();
  }, [fetchBlogData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Blog</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchBlogData}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          <Image 
            className='mx-auto border-4 border-white shadow-lg rounded-lg max-w-full h-auto' 
            src={data.image} 
            alt={data.title}
            width={800}
            height={480}
            style={{ maxHeight: '500px' }}
          />
        ) : (
          // Handle regular images with Next.js Image component
          <Image 
            className='mx-auto border-4 border-white shadow-lg rounded-lg max-w-full h-auto' 
            src={data.image} 
            width={800} 
            height={480} 
            alt={data.title}
            style={{ maxHeight: '500px' }}
          />
        )}
      </div>
      
      <div className='blog-content mt-8 mb-12'>
        <div className='prose prose-lg max-w-none'>
          {data.description && data.description.split('\n').map((paragraph, index) => {
            const trimmedParagraph = paragraph.trim();
            if (!trimmedParagraph) return null;
            
            // Check if it's a bullet point (starts with - or *)
            if (trimmedParagraph.startsWith('-') || trimmedParagraph.startsWith('*')) {
              return (
                <li key={index} className='mb-2 leading-relaxed text-gray-700 text-lg list-disc ml-6'>
                  {trimmedParagraph.substring(1).trim()}
                </li>
              );
            }
            
            // Check if it's a heading (starts with #)
            if (trimmedParagraph.startsWith('#')) {
              const level = trimmedParagraph.match(/^#+/)[0].length;
              const text = trimmedParagraph.replace(/^#+\s*/, '');
              
              if (level === 1) {
                return <h1 key={index} className='text-4xl font-bold mb-6 mt-10 text-gray-900 border-b-2 border-gray-200 pb-2'>{text}</h1>;
              } else if (level === 2) {
                return <h2 key={index} className='text-3xl font-bold mb-6 mt-8 text-gray-900 border-b-2 border-gray-200 pb-2'>{text}</h2>;
              } else if (level === 3) {
                return <h3 key={index} className='text-2xl font-semibold mb-4 mt-6 text-gray-900'>{text}</h3>;
              }
            }
            
            // Regular paragraph
            return (
              <p key={index} className='mb-6 leading-relaxed text-gray-700 text-lg text-justify'>
                {trimmedParagraph}
              </p>
            );
          })}
        </div>
      </div>
      

    </div>
    <Footer />
  </> : (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h1>
        <p className="text-gray-600 mb-4">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        <Link 
          href="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
  )
}

export default Page
