import { ConnectDB } from "@/lib/config/db"
import BlogModel from "@/lib/models/BlogModel";
const { NextResponse } = require("next/server")
import { writeFile } from 'fs/promises'
const fs = require('fs')
import path from 'path'

let isConnected = false;
let localBlogs = [];

// Initialize with sample blogs for Vercel
const initializeSampleBlogs = () => {
    const sampleBlogs = [
        {
            _id: "sample1",
            title: "Getting Started with Next.js",
            description: "Learn how to build modern web applications with Next.js framework",
            category: "Technology",
            image: "/blog_pic_1.png",
            author: "John Doe",
            authorImg: "/profile_icon.png",
            createdAt: new Date().toISOString()
        },
        {
            _id: "sample2", 
            title: "The Future of Web Development",
            description: "Exploring the latest trends and technologies in web development",
            category: "Technology",
            image: "/blog_pic_2.png",
            author: "Jane Smith",
            authorImg: "/profile_icon.png",
            createdAt: new Date().toISOString()
        },
        {
            _id: "sample3",
            title: "Building a Successful Startup",
            description: "Essential tips and strategies for launching your startup",
            category: "Startup", 
            image: "/blog_pic_3.png",
            author: "Mike Johnson",
            authorImg: "/profile_icon.png",
            createdAt: new Date().toISOString()
        },
        {
            _id: "sample4",
            title: "Healthy Lifestyle Tips",
            description: "Simple ways to maintain a healthy and balanced lifestyle",
            category: "Lifestyle",
            image: "/blog_pic_4.png", 
            author: "Sarah Wilson",
            authorImg: "/profile_icon.png",
            createdAt: new Date().toISOString()
        }
    ];
    
    // Initialize localBlogs with sample blogs
    localBlogs = [...sampleBlogs];
    console.log("📝 Initialized with sample blogs for Vercel");
};

// Load local blogs from file (only in development)
const loadLocalBlogs = () => {
    if (process.env.NODE_ENV === 'development') {
        try {
            const blogsPath = path.join(process.cwd(), 'local-blogs.json');
            if (fs.existsSync(blogsPath)) {
                const data = fs.readFileSync(blogsPath, 'utf8');
                localBlogs = JSON.parse(data);
                console.log(`📁 Loaded ${localBlogs.length} blogs from local storage`);
            }
        } catch (error) {
            console.log("No local blogs file found");
        }
    } else {
        // In production (Vercel), use sample blogs
        initializeSampleBlogs();
    }
};

// Save blogs to local file (only in development)
const saveLocalBlogs = () => {
    if (process.env.NODE_ENV === 'development') {
        try {
            const blogsPath = path.join(process.cwd(), 'local-blogs.json');
            fs.writeFileSync(blogsPath, JSON.stringify(localBlogs, null, 2));
            console.log(`💾 Saved ${localBlogs.length} blogs to local storage`);
        } catch (error) {
            console.log("Error saving local blogs:", error.message);
        }
    } else {
        // In production (Vercel), just log the action
        console.log(`💾 Would save ${localBlogs.length} blogs (Vercel environment)`);
    }
};

const LoadDB = async () => {
  try {
  await ConnectDB();
    isConnected = true;
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
    isConnected = false;
    loadLocalBlogs(); // Load local blogs when DB fails
  }
}

// Initialize database connection and load local blogs
LoadDB();
loadLocalBlogs(); // Always load local blogs

// API Endpoint to get all blogs
export async function GET(request) {
  try {
    console.log("🔍 Blog API GET request received");
    const blogId = request.nextUrl.searchParams.get("id");
    
    // Always try database first
    try {
      if (blogId) {
        const blog = await BlogModel.findById(blogId);
        if (blog) {
          return NextResponse.json(blog);
        }
      } else {
        const dbBlogs = await BlogModel.find({});
        console.log(`📊 Returning ${dbBlogs.length} blogs from database`);
        return NextResponse.json({ blogs: dbBlogs })
      }
    } catch (dbError) {
      console.log("Database GET failed:", dbError.message);
    }
    
    // Fallback to local storage only in development
    if (process.env.NODE_ENV === 'development') {
      if (blogId) {
        const blog = localBlogs.find(b => b._id === blogId);
        return NextResponse.json(blog);
      } else {
        console.log(`📊 Returning ${localBlogs.length} blogs from local storage`);
        return NextResponse.json({ blogs: localBlogs })
      }
    } else {
      // In production (Vercel), return sample blogs if database fails
      console.log("📊 Database failed, returning sample blogs for Vercel");
      return NextResponse.json({ blogs: localBlogs })
    }
  } catch (error) {
    console.log("API Error:", error.message);
    return NextResponse.json({ blogs: localBlogs, error: "Using fallback storage" });
  }
}

// API Endpoint For Uploading Blogs
export async function POST(request) {
  try {
  const formData = await request.formData();
  const timestamp = Date.now();

  const image = formData.get('image');
    if (!image) {
      return NextResponse.json({ success: false, msg: "No image provided" });
    }

  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);
  
  // For Vercel, we can't write files, so use a placeholder or skip
  let imgUrl = "/blog_pic_1.png"; // Default image for Vercel
  
  if (process.env.NODE_ENV === 'development') {
    try {
      const path = `./public/${timestamp}_${image.name}`;
      await writeFile(path, buffer);
      imgUrl = `/${timestamp}_${image.name}`;
    } catch (error) {
      console.log("Error saving image file:", error.message);
    }
  }

  const blogData = {
    title: `${formData.get('title')}`,
    description: `${formData.get('description')}`,
    category: `${formData.get('category')}`,
    author: `${formData.get('author')}`,
    image: `${imgUrl}`,
    authorImg: `${formData.get('authorImg')}`
  }

    // Always try database first
    try {
      const newBlog = await BlogModel.create(blogData);
      console.log("Blog Saved Successfully to Database!");
      return NextResponse.json({ success: true, msg: "Blog Added Successfully!" })
    } catch (dbError) {
      console.log("Database operation failed:", dbError.message);
      
      // Fallback to local storage only in development
      if (process.env.NODE_ENV === 'development') {
        const localBlogData = {
          _id: Date.now().toString(),
          ...blogData,
          createdAt: new Date().toISOString()
        };
        
        localBlogs.push(localBlogData);
        saveLocalBlogs();
        
        console.log("Blog Saved Successfully to Local Storage!");
        return NextResponse.json({ success: true, msg: "Blog Added Successfully! (Local Storage)" })
      } else {
        // In production (Vercel), return error if database fails
        return NextResponse.json({ 
          success: false, 
          msg: "Database connection failed. Please check your MongoDB connection." 
        });
      }
    }
    
  } catch (error) {
    console.log("POST Error:", error.message);
    return NextResponse.json({ success: false, msg: "Failed to add blog. Please try again." });
  }
}

// Creating API Endpoint to delete Blog
export async function DELETE(request) {
  try {
  const id = await request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ msg: "No blog ID provided" });
    }
    
    if (isConnected) {
      try {
  const blog = await BlogModel.findById(id);
        if (blog && blog.image) {
          try {
  fs.unlink(`./public${blog.image}`, () => { });
          } catch (error) {
            console.log("Error deleting image file:", error.message);
          }
        }
        
  await BlogModel.findByIdAndDelete(id);
        return NextResponse.json({ msg: "Blog Deleted Successfully!" });
      } catch (dbError) {
        console.log("Database DELETE failed, using local storage");
        isConnected = false;
      }
    }
    
    // Delete from local storage
    const blogToDelete = localBlogs.find(b => b._id === id);
    if (blogToDelete && blogToDelete.image) {
      try {
        fs.unlink(`./public${blogToDelete.image}`, () => { });
      } catch (error) {
        console.log("Error deleting image file:", error.message);
      }
    }
    
    localBlogs = localBlogs.filter(blog => blog._id !== id);
    saveLocalBlogs();
    
    return NextResponse.json({ msg: "Blog Deleted Successfully! (Local Storage)" });
  } catch (error) {
    console.log("DELETE Error:", error.message);
    return NextResponse.json({ msg: "Failed to delete blog" });
  }
}