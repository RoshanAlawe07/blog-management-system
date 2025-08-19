import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';

export const ConnectDB = async () =>{
    try {
        let MONGODB_URI = process.env.MONGODB_URI;
        
        // Debug: Check what's in process.env
        console.log("🔍 Environment check:");
        console.log("   process.env.MONGODB_URI:", process.env.MONGODB_URI);
        console.log("   process.env.NODE_ENV:", process.env.NODE_ENV);
        
        // Force read from .env.local file
        try {
            const envPath = path.join(process.cwd(), '.env.local');
            console.log("🔍 Looking for .env.local at:", envPath);
            
            if (fs.existsSync(envPath)) {
                console.log("✅ .env.local file found");
                const envContent = fs.readFileSync(envPath, 'utf8');
                console.log("📄 File content length:", envContent.length, "characters");
                console.log("📄 First 200 characters:", envContent.substring(0, 200));
                
                const match = envContent.match(/MONGODB_URI=(.+)/);
                if (match) {
                    MONGODB_URI = match[1].trim();
                    console.log("✅ Loaded MONGODB_URI from .env.local file");
                    console.log("Connection string preview:", MONGODB_URI.substring(0, 50) + "...");
                } else {
                    console.log("❌ MONGODB_URI not found in .env.local file");
                    console.log("🔍 Looking for lines containing 'MONGODB_URI':");
                    const lines = envContent.split('\n');
                    lines.forEach((line, index) => {
                        if (line.includes('MONGODB_URI')) {
                            console.log(`   Line ${index + 1}: "${line}"`);
                        }
                    });
                }
            } else {
                console.log("❌ .env.local file NOT found at:", envPath);
            }
        } catch (error) {
            console.log("❌ Could not read .env.local file:", error.message);
        }
        
        // Use MongoDB Atlas or fallback to local
        if (MONGODB_URI && MONGODB_URI.includes('mongodb+srv://')) {
            console.log("🚀 Using MongoDB Atlas connection");
        } else {
            MONGODB_URI = 'mongodb://localhost:27017/blog-app';
            console.log("⚠️  Using local MongoDB fallback");
        }
        
        console.log("Attempting to connect to MongoDB...");
        console.log("Connection string:", MONGODB_URI.substring(0, 50) + "...");
        
        // Modern MongoDB connection options
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000
        };
        
        await mongoose.connect(MONGODB_URI, options);
        console.log("✅ DB Connected Successfully!");
        
        // Test the connection safely
        if (mongoose.connection.readyState === 1) {
            console.log("✅ Database connection is ready");
        } else {
            console.log("⚠️  Database connection state:", mongoose.connection.readyState);
        }
        
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        console.error("Full error:", error);
        
        // Provide helpful error messages
        if (error.message.includes('IP that isn\'t whitelisted')) {
            console.log("💡 Solution: Add your current IP address to MongoDB Atlas IP whitelist");
            console.log("   Go to: https://cloud.mongodb.com/ → Network Access → Add IP Address");
        }
    }
}

// Force database connection check on module load
console.log("🔄 Database module loaded, checking connection...");
ConnectDB().then(() => {
    console.log("🎯 Initial database connection attempt completed");
}).catch((error) => {
    console.log("💥 Initial database connection failed:", error.message);
});