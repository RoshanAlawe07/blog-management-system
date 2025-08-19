import { blog_data } from '@/Assets/assets'
import React, { useEffect, useState } from 'react'
import BlogItem from './BlogItem'
import axios from 'axios';

const BlogList = () => {

    const [menu,setMenu] = useState("All");
    const [blogs,setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Sample blog data as fallback with correct image paths
    const sampleBlogs = [
        {
            _id: "1",
            title: "Getting Started with Next.js",
            description: "Learn how to build modern web applications with Next.js framework",
            category: "Technology",
            image: "/blog_pic_1.png",
            author: "John Doe",
            authorImg: "/profile_icon.png"
        },
        {
            _id: "2", 
            title: "The Future of Web Development",
            description: "Exploring the latest trends and technologies in web development",
            category: "Technology",
            image: "/blog_pic_2.png",
            author: "Jane Smith",
            authorImg: "/profile_icon.png"
        },
        {
            _id: "3",
            title: "Building a Successful Startup",
            description: "Essential tips and strategies for launching your startup",
            category: "Startup", 
            image: "/blog_pic_3.png",
            author: "Mike Johnson",
            authorImg: "/profile_icon.png"
        },
        {
            _id: "4",
            title: "Healthy Lifestyle Tips",
            description: "Simple ways to maintain a healthy and balanced lifestyle",
            category: "Lifestyle",
            image: "/blog_pic_4.png", 
            author: "Sarah Wilson",
            authorImg: "/profile_icon.png"
        },
        {
            _id: "5",
            title: "Technology for Career Advancement",
            description: "How to advance your career in software development",
            category: "Technology",
            image: "/blog_pic_5.png",
            author: "Alex Bennett",
            authorImg: "/profile_icon.png"
        },
        {
            _id: "6",
            title: "Maximizing Startup Returns",
            description: "Strategies for maximizing returns with minimal resources",
            category: "Startup",
            image: "/blog_pic_6.png",
            author: "Alex Bennett",
            authorImg: "/profile_icon.png"
        }
    ];

    const fetchBlogs = async () =>{
      try {
        console.log("🔍 Fetching blogs from API...");
        // Try to get the current port from window.location
        const port = window.location.port || '3000';
        const apiUrl = `/api/blog`;
        console.log("🌐 Calling API at:", apiUrl);
        
        const response = await axios.get(apiUrl);
        console.log("📊 API Response:", response.data);
        
        if (response.data.blogs && response.data.blogs.length > 0) {
          console.log(`✅ Found ${response.data.blogs.length} blogs from API`);
          setBlogs(response.data.blogs);
          setError(false);
        } else {
          console.log("⚠️ No blogs from API, using sample blogs");
          setBlogs(sampleBlogs);
          setError(false);
        }
        setLoading(false);
      } catch (error) {
        console.log("❌ API Error:", error.message);
        console.log("🔄 API failed, using sample blogs as fallback");
        setBlogs(sampleBlogs);
        setError(false);
        setLoading(false);
      }
    }

    useEffect(()=>{
      fetchBlogs();
    },[])

    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="text-xl">Loading blogs...</div>
        </div>
      );
    }

    console.log("🎯 Current blogs state:", blogs);
    console.log("🎯 Current menu state:", menu);

  return (
    <div className="blog-section">
      {error && (
        <div className="text-center py-4 bg-yellow-100 border border-yellow-400 text-yellow-700 mx-4 rounded">
          {blogs.length === 0 ? "No blogs found. Please try again later." : "Using sample blogs. Database connection not available."}
        </div>
      )}
      <div className='flex justify-center gap-4 my-10'>
        <button 
          onClick={()=>setMenu('All')} 
          className={`py-2 px-6 rounded-md font-medium transition-all duration-200 ${
            menu==="All" 
              ? 'bg-black text-white shadow-lg' 
              : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button 
          onClick={()=>setMenu('Technology')} 
          className={`py-2 px-6 rounded-md font-medium transition-all duration-200 ${
            menu==="Technology" 
              ? 'bg-black text-white shadow-lg' 
              : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Technology
        </button>
        <button 
          onClick={()=>setMenu('Startup')} 
          className={`py-2 px-6 rounded-md font-medium transition-all duration-200 ${
            menu==="Startup" 
              ? 'bg-black text-white shadow-lg' 
              : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Startup
        </button>
        <button 
          onClick={()=>setMenu('Lifestyle')} 
          className={`py-2 px-6 rounded-md font-medium transition-all duration-200 ${
            menu==="Lifestyle" 
              ? 'bg-black text-white shadow-lg' 
              : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Lifestyle
        </button>
      </div>
      <div className="text-center mb-4 text-sm text-gray-600">
        Showing {blogs.filter((item)=> menu==="All"?true:item.category===menu).length} of {blogs.length} blogs ({menu} category)
      </div>
      {blogs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-xl text-gray-500">No blogs available</div>
        </div>
      ) : (
        <div className='blog-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 px-4 max-w-7xl mx-auto' style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(1, 1fr)', 
          gap: '24px',
          width: '100%',
          maxWidth: '100%'
        }} onLoad={(e) => {
          const width = window.innerWidth;
          if (width >= 1280) {
            e.target.style.gridTemplateColumns = 'repeat(4, 1fr)';
          } else if (width >= 1024) {
            e.target.style.gridTemplateColumns = 'repeat(3, 1fr)';
          } else if (width >= 640) {
            e.target.style.gridTemplateColumns = 'repeat(2, 1fr)';
          }
        }}>
          {blogs.filter((item)=> {
            const shouldShow = menu==="All"?true:item.category===menu;
            console.log(`🔍 Blog "${item.title}" (${item.category}) - Menu: ${menu} - Show: ${shouldShow}`);
            return shouldShow;
          }).map((item,index)=>{
              console.log("🎨 Rendering blog item:", item);
              return <BlogItem key={index} id={item._id} image={item.image} title={item.title} description={item.description} category={item.category} />
          })}
        </div>
      )}
    </div>
  )
}

export default BlogList
