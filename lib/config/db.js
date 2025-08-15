import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';

export const ConnectDB = async () =>{
    try {
        let MONGODB_URI = process.env.MONGODB_URI;
        
        // If MONGODB_URI is not loaded from env, try reading from .env.local file
        if (!MONGODB_URI) {
            try {
                const envPath = path.join(process.cwd(), '.env.local');
                const envContent = fs.readFileSync(envPath, 'utf8');
                const match = envContent.match(/MONGODB_URI=(.+)/);
                if (match) {
                    MONGODB_URI = match[1].trim();
                    console.log("Loaded MONGODB_URI from .env.local file");
                }
            } catch (error) {
                console.log("Could not read .env.local file");
            }
        }
        
        // Fallback to local MongoDB if still not found
        MONGODB_URI = MONGODB_URI || 'mongodb://localhost:27017/blog-app';
        
        console.log("Attempting to connect to MongoDB...");
        console.log("Connection string:", MONGODB_URI.substring(0, 50) + "...");
        
        // Modern MongoDB connection options
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        };
        
        await mongoose.connect(MONGODB_URI, options);
        console.log("✅ DB Connected Successfully!");
        
        // Test the connection
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available collections:", collections.map(c => c.name));
        
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        console.error("Full error:", error);
    }
}