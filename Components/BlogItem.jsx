import { assets, blog_data } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogItem = ({title,description,category,image,id}) => {

  return (
    <div className='w-full bg-white border border-black transition-all hover:shadow-[-7px_7px_0px_#000000] rounded-lg overflow-hidden'>
      <Link href={`/blogs/${id}`}>
      <Image src={image} alt={title} width={400} height={250} className='w-full h-48 object-cover border-b border-black' />
      </Link>
      <p className='ml-5 mt-5 px-3 py-1 inline-block bg-black text-white text-sm rounded'>{category}</p>
      <div className="p-5">
        <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900 line-clamp-2'>{title}</h5>
        <p className='mb-3 text-sm tracking-tight text-gray-700 line-clamp-3' dangerouslySetInnerHTML={{"__html":description.slice(0,120)}}></p>
        <Link href={`/blogs/${id}`} className='inline-flex items-center py-2 font-semibold text-center text-blue-600 hover:text-blue-800'>
            Read more <Image src={assets.arrow} className='ml-2' alt='' width={12} height={12} />
        </Link>
      </div>
    </div>
  )
}

export default BlogItem
