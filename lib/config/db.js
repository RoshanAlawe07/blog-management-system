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
        
        // Modern MongoDB connection options with better error handling
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 15000, // Increased timeout
            socketTimeoutMS: 45000,
            connectTimeoutMS: 15000, // Increased timeout
            heartbeatFrequencyMS: 10000,
            retryWrites: true,
            w: 'majority'
        };
        
        await mongoose.connect(MONGODB_URI, options);
        console.log("✅ DB Connected Successfully!");
        
        // Test the connection safely
        if (mongoose.connection.readyState === 1) {
            console.log("✅ Database connection is ready");
            
            // Test if we can actually perform operations
            try {
                const collections = await mongoose.connection.db.listCollections().toArray();
                console.log(`📚 Database has ${collections.length} collections`);
                
                // Check if blogs collection exists
                const blogsCollection = collections.find(col => col.name === 'blogs');
                if (blogsCollection) {
                    console.log("✅ 'blogs' collection found in database");
                } else {
                    console.log("📝 'blogs' collection not found - will be created when first blog is added");
                }
                
            } catch (testError) {
                console.log("⚠️  Could not test database operations:", testError.message);
            }
            
        } else {
            console.log("⚠️  Database connection state:", mongoose.connection.readyState);
        }
        
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        console.error("Full error:", error);
        
        // Provide helpful error messages
        if (error.message.includes('IP that isn\'t whitelisted') || 
            error.message.includes('Could not connect to any servers')) {
            console.log("🔒 SOLUTION: Add your current IP address to MongoDB Atlas IP whitelist");
            console.log("   1. Go to: https://cloud.mongodb.com/");
            console.log("   2. Click 'Network Access' in the left sidebar");
            console.log("   3. Click '+ ADD IP ADDRESS'");
            console.log("   4. Click 'ADD CURRENT IP ADDRESS'");
            console.log("   5. Click 'Confirm'");
            console.log("   6. Wait a few minutes for the change to take effect");
        } else if (error.message.includes('authentication failed')) {
            console.log("🔐 SOLUTION: Check your MongoDB username/password in the connection string");
        } else if (error.message.includes('ENOTFOUND')) {
            console.log("🌐 SOLUTION: Check your MongoDB connection string and internet connection");
        }
        
        // Re-throw the error so calling code can handle it
        throw error;
    }
}

// Force database connection check on module load
console.log("🔄 Database module loaded, checking connection...");
ConnectDB().then(() => {
    console.log("🎯 Initial database connection attempt completed");
}).catch((error) => {
    console.log("💥 Initial database connection failed:", error.message);
});