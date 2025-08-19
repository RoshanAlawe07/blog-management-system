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
                const fileBlogs = JSON.parse(data);
                // Merge file blogs with sample blogs
                localBlogs = [...fileBlogs, ...localBlogs.filter(sample => 
                    !fileBlogs.find(file => file._id === sample._id)
                )];
                console.log(`📁 Loaded ${localBlogs.length} blogs from local storage`);
            } else {
                // If no local file, use sample blogs
                initializeSampleBlogs();
            }
        } catch (error) {
            console.log("No local blogs file found, using sample blogs");
            initializeSampleBlogs();
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
    // Debug: Check environment variable
    console.log("🔍 API Route Environment Check:");
    console.log("   process.env.MONGODB_URI:", process.env.MONGODB_URI);
    console.log("   process.env.NODE_ENV:", process.env.NODE_ENV);
    
    await ConnectDB();
    isConnected = true;
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
    isConnected = false;
    // Don't call loadLocalBlogs here as it's called separately
  }
}

// Initialize database connection and load local blogs
LoadDB();
loadLocalBlogs(); // Always load local blogs

// API Endpoint For Getting Blogs
export async function GET(request) {
  try {
    console.log("🔍 Blog API GET request received");
    
    // Always try to connect to database first
    await ConnectDB();
    
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('id');
    
    // Try to get blogs from database first
    try {
      if (blogId) {
        // Get specific blog by ID
        const blog = await BlogModel.findById(blogId);
        if (blog) {
          console.log("✅ Blog found in database:", blog._id);
          return NextResponse.json(blog);
        } else {
          console.log("❌ Blog not found in database, checking local storage");
        }
      } else {
        // Get all blogs from database
        const dbBlogs = await BlogModel.find({}).sort({ createdAt: -1 });
        if (dbBlogs && dbBlogs.length > 0) {
          console.log(`✅ Retrieved ${dbBlogs.length} blogs from MongoDB database`);
          return NextResponse.json({ blogs: dbBlogs });
        } else {
          console.log("📭 No blogs found in database, using local storage");
        }
      }
    } catch (dbError) {
      console.log("❌ Database GET failed:", dbError.message);
      
      // Check if it's a connection issue
      if (dbError.message.includes('IP that isn\'t whitelisted') || 
          dbError.message.includes('Could not connect to any servers')) {
        console.log("🔒 MongoDB connection issue - IP not whitelisted");
        console.log("💡 Solution: Add your current IP address to MongoDB Atlas IP whitelist");
        console.log("   Go to: https://cloud.mongodb.com/ → Network Access → Add IP Address");
      }
    }
    
    // Fallback to local storage
    console.log(`📊 Returning ${localBlogs.length} blogs from local storage`);
    console.log("📋 Local blogs:", localBlogs);
    
    if (blogId) {
      const blog = localBlogs.find(b => b._id === blogId);
      if (blog) {
        return NextResponse.json(blog);
      }
    } else {
      return NextResponse.json({ blogs: localBlogs });
    }
    
    // If we get here, return empty array
    return NextResponse.json({ blogs: [] });
    
  } catch (error) {
    console.log("❌ API Error:", error.message);
    console.log("📊 Error occurred, returning local blogs as fallback");
    return NextResponse.json({ 
      blogs: localBlogs, 
      error: "Using fallback storage",
      message: "Database connection failed, showing local blogs"
    });
  }
}

// API Endpoint For Uploading Blogs
export async function POST(request) {
  try {
    // Ensure database connection
    await ConnectDB();
    
    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get('image');
    if (!image) {
      return NextResponse.json({ success: false, msg: "No image provided" });
    }

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    
    // Generate unique image name for each blog
    const imageName = `${timestamp}_${image.name}`;
    let imgUrl = `/${imageName}`;
    
    // Try to save image file (works in both development and production)
    try {
      const imagePath = `./public/${imageName}`;
      await writeFile(imagePath, buffer);
      console.log("✅ Image saved successfully:", imagePath);
    } catch (error) {
      console.log("⚠️  Could not save image file:", error.message);
      // Use a fallback image if file saving fails
      imgUrl = "/blog_pic_1.png";
    }

    const blogData = {
      title: `${formData.get('title')}`,
      description: `${formData.get('description')}`,
      category: `${formData.get('category')}`,
      author: `${formData.get('author')}`,
      image: `${imgUrl}`,
      authorImg: `${formData.get('authorImg')}`,
      createdAt: new Date().toISOString()
    }

    // Try to save to database first
    try {
      const newBlog = await BlogModel.create(blogData);
      console.log("✅ Blog Saved Successfully to MongoDB Database!");
      console.log("📝 Blog ID:", newBlog._id);
      
      // Also add to local storage for consistency
      localBlogs.push({
        _id: newBlog._id.toString(),
        ...blogData
      });
      
      return NextResponse.json({ 
        success: true, 
        msg: "Blog Added Successfully to Database!",
        blogId: newBlog._id 
      });
      
    } catch (dbError) {
      console.log("❌ Database operation failed:", dbError.message);
      
      // Check if it's a connection issue
      if (dbError.message.includes('IP that isn\'t whitelisted') || 
          dbError.message.includes('Could not connect to any servers')) {
        console.log("🔒 MongoDB connection issue - IP not whitelisted");
        return NextResponse.json({ 
          success: false, 
          msg: "Database connection failed. Please whitelist your IP address in MongoDB Atlas.",
          error: "IP_NOT_WHITELISTED"
        });
      }
      
      // For other database errors, try to save locally as fallback
      const localBlogData = {
        _id: Date.now().toString(),
        ...blogData
      };
      
      localBlogs.push(localBlogData);
      
      if (process.env.NODE_ENV === 'development') {
        saveLocalBlogs();
      }
      
      console.log("💾 Blog Saved to Local Storage as fallback");
      return NextResponse.json({ 
        success: true, 
        msg: "Blog Added Successfully! (Local Storage - Database unavailable)",
        blogId: localBlogData._id,
        warning: "Database connection failed, saved locally"
      });
    }
    
  } catch (error) {
    console.log("❌ POST Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      msg: "Failed to add blog. Please try again.",
      error: error.message
    });
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