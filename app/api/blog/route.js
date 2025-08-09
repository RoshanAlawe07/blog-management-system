import { ConnectDB } from "@/lib/config/db"
import BlogModel from "@/lib/models/BlogModel";
const { NextResponse } = require("next/server")
import { writeFile } from 'fs/promises'
const fs = require('fs')
import path from 'path'

let isConnected = false;
let localBlogs = [];

// Load local blogs from file
const loadLocalBlogs = () => {
    try {
        const blogsPath = path.join(process.cwd(), 'local-blogs.json');
        if (fs.existsSync(blogsPath)) {
            const data = fs.readFileSync(blogsPath, 'utf8');
            localBlogs = JSON.parse(data);
            console.log(`📁 Loaded ${localBlogs.length} blogs from local storage`);
        }
        
        // Check if sample blogs exist, if not add them
        const sampleBlogIds = ["sample1", "sample2", "sample3", "sample4"];
        const hasSampleBlogs = sampleBlogIds.some(id => localBlogs.some(blog => blog._id === id));
        
        if (!hasSampleBlogs) {
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
            
            // Add sample blogs to existing blogs
            localBlogs = [...localBlogs, ...sampleBlogs];
            saveLocalBlogs();
            console.log("📝 Added sample blogs to local storage");
        }
    } catch (error) {
        console.log("No local blogs file found");
    }
};

// Save blogs to local file
const saveLocalBlogs = () => {
    try {
        const blogsPath = path.join(process.cwd(), 'local-blogs.json');
        fs.writeFileSync(blogsPath, JSON.stringify(localBlogs, null, 2));
        console.log(`💾 Saved ${localBlogs.length} blogs to local storage`);
    } catch (error) {
        console.log("Error saving local blogs:", error.message);
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
    
    if (isConnected) {
      try {
        if (blogId) {
          const blog = await BlogModel.findById(blogId);
          return NextResponse.json(blog);
        } else {
          const dbBlogs = await BlogModel.find({});
          // Combine database blogs with local blogs
          const allBlogs = [...dbBlogs, ...localBlogs];
          console.log(`📊 Returning ${allBlogs.length} blogs (${dbBlogs.length} from DB, ${localBlogs.length} from local)`);
          return NextResponse.json({ blogs: allBlogs })
        }
      } catch (dbError) {
        console.log("Database GET failed, using local storage");
        isConnected = false;
      }
    }
    
    // Fallback to local storage
    if (blogId) {
      const blog = localBlogs.find(b => b._id === blogId);
      return NextResponse.json(blog);
    } else {
      console.log(`📊 Returning ${localBlogs.length} blogs from local storage`);
      console.log("📋 Local blogs:", localBlogs);
      return NextResponse.json({ blogs: localBlogs })
    }
  } catch (error) {
    console.log("API Error:", error.message);
    return NextResponse.json({ blogs: localBlogs, error: "Using local storage" });
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
  const path = `./public/${timestamp}_${image.name}`;
  await writeFile(path, buffer);
  const imgUrl = `/${timestamp}_${image.name}`;

  const blogData = {
    title: `${formData.get('title')}`,
    description: `${formData.get('description')}`,
    category: `${formData.get('category')}`,
    author: `${formData.get('author')}`,
    image: `${imgUrl}`,
    authorImg: `${formData.get('authorImg')}`
  }

    // Try database first
    if (isConnected) {
      try {
  await BlogModel.create(blogData);
        console.log("Blog Saved Successfully to Database!");
        return NextResponse.json({ success: true, msg: "Blog Added Successfully!" })
      } catch (dbError) {
        console.log("Database operation failed, using local storage");
        isConnected = false;
      }
    }
    
    // Fallback to local storage
    const localBlogData = {
      _id: Date.now().toString(),
      ...blogData,
      createdAt: new Date().toISOString()
    };
    
    localBlogs.push(localBlogData);
    saveLocalBlogs();
    
    console.log("Blog Saved Successfully to Local Storage!");
    return NextResponse.json({ success: true, msg: "Blog Added Successfully! (Local Storage)" })
    
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