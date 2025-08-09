import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

let isConnected = false;
let localEmails = [];

// Load local emails from file
const loadLocalEmails = () => {
    try {
        const emailsPath = path.join(process.cwd(), 'local-emails.json');
        if (fs.existsSync(emailsPath)) {
            const data = fs.readFileSync(emailsPath, 'utf8');
            localEmails = JSON.parse(data);
            console.log(`📧 Loaded ${localEmails.length} emails from local storage`);
        }
    } catch (error) {
        console.log("No local emails file found");
    }
};

// Save emails to local file
const saveLocalEmails = () => {
    try {
        const emailsPath = path.join(process.cwd(), 'local-emails.json');
        fs.writeFileSync(emailsPath, JSON.stringify(localEmails, null, 2));
        console.log(`💾 Saved ${localEmails.length} emails to local storage`);
    } catch (error) {
        console.log("Error saving local emails:", error.message);
    }
};

const LoadDB = async () =>{
    try {
        await ConnectDB();
        isConnected = true;
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.log("❌ Database connection failed:", error.message);
        isConnected = false;
        loadLocalEmails(); // Load local emails when DB fails
    }
}

// Initialize database connection and load local emails
LoadDB();
loadLocalEmails(); // Always load local emails

export async function POST(request){
    try {
        const formData = await request.formData();
        const email = formData.get('email');
        
        if (!email) {
            return NextResponse.json({success:false,msg:"Email is required"})
        }
        
        // Try database first
        if (isConnected) {
            try {
                const emailData = { email: `${email}` };
                await EmailModel.create(emailData);
                return NextResponse.json({success:true,msg:"Email Subscribed Successfully!"})
            } catch (dbError) {
                console.log("Database operation failed, using local storage");
                isConnected = false;
            }
        }
        
        // Fallback to local storage
        const emailData = { 
            _id: Date.now().toString(),
            email: `${email}`,
            createdAt: new Date().toISOString()
        };
        
        localEmails.push(emailData);
        saveLocalEmails();
        
        return NextResponse.json({success:true,msg:"Email Subscribed Successfully! (Local Storage)"})
        
    } catch (error) {
        console.log("Email POST Error:", error.message);
        return NextResponse.json({success:false,msg:"Failed to subscribe email. Please try again."})
    }
}

export async function GET(request){
    try {
        if (isConnected) {
            try {
                const dbEmails = await EmailModel.find({});
                // Combine database emails with local emails
                const allEmails = [...dbEmails, ...localEmails];
                console.log(`📧 Returning ${allEmails.length} emails (${dbEmails.length} from DB, ${localEmails.length} from local)`);
                return NextResponse.json({emails: allEmails});
            } catch (dbError) {
                console.log("Database GET failed, using local storage");
                isConnected = false;
            }
        }
        
        // Return local emails
        console.log(`📧 Returning ${localEmails.length} emails from local storage`);
        return NextResponse.json({emails: localEmails});
    } catch (error) {
        console.log("Email GET Error:", error.message);
        return NextResponse.json({emails: localEmails});
    }
}

export async function DELETE(request){
    try {
        const id = await request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({success:false,msg:"Email ID is required"})
        }
        
        if (isConnected) {
            try {
                await EmailModel.findByIdAndDelete(id);
                return NextResponse.json({success:true,msg:"Email Deleted"})
            } catch (dbError) {
                console.log("Database DELETE failed, using local storage");
                isConnected = false;
            }
        }
        
        // Delete from local storage
        localEmails = localEmails.filter(email => email._id !== id);
        saveLocalEmails();
        
        return NextResponse.json({success:true,msg:"Email Deleted (Local Storage)"})
    } catch (error) {
        console.log("Email DELETE Error:", error.message);
        return NextResponse.json({success:false,msg:"Failed to delete email"})
    }
}