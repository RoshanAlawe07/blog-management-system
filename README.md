# Blog Management System

A full-stack blog platform built with Next.js 14, featuring a modern responsive design and comprehensive content management capabilities.

## 🚀 Features

- **Dynamic Blog Display**: Responsive grid layout showcasing blog posts with category filtering (Technology, Startup, Lifestyle)
- **Admin Dashboard**: Complete content management system with blog creation, editing, and subscription management
- **Email Subscription System**: Integrated newsletter subscription functionality with email notifications
- **User Authentication**: Firebase-powered sign-in/sign-up system with secure user management
- **Modern UI/UX**: Clean, minimalist design with hover effects and smooth animations using Tailwind CSS
- **Database Integration**: MongoDB backend with RESTful API endpoints for data persistence
- **Image Optimization**: Next.js Image component integration for optimized media handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Node.js, MongoDB
- **Authentication**: Firebase Authentication
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Styling**: Tailwind CSS

## 📁 Project Structure

```
blog-app/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── blogs/             # Blog detail pages
│   └── globals.css        # Global styles
├── Components/            # Reusable React components
├── Assets/               # Static assets and configurations
├── lib/                  # Database models, Firebase config, and Auth context
└── public/               # Public static files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or cloud)
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Strsnger07/blog-management-system.git
   cd blog-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=your_mongodb_connection_string
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Firebase Setup**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable Authentication (Email/Password)
   - Get your project credentials from Project Settings > General
   - Copy the values to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### For Users
- Browse blogs by category (Technology, Startup, Lifestyle)
- Subscribe to email newsletter
- Read full blog articles
- Sign up/Sign in to access admin features

### For Admins
- Access admin panel at `/admin` (requires authentication)
- Create and manage blog posts
- View and manage email subscriptions
- Monitor blog analytics

## 🔧 API Endpoints

- `GET /api/blog` - Get all blogs
- `GET /api/blog?id={id}` - Get specific blog
- `POST /api/blog` - Create new blog
- `POST /api/email` - Subscribe to newsletter

## 🔐 Authentication

The application uses Firebase Authentication for user management:
- **Sign Up**: Create new user accounts
- **Sign In**: Access existing accounts
- **Admin Access**: Authenticated users can access admin panel
- **Secure**: All sensitive routes are protected

## 🎨 Design Features

- Responsive design for all devices
- Modern UI with hover effects
- Clean typography and spacing
- Optimized images and performance
- Professional authentication UI

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

Strsnger07 - [@Strsnger07](https://github.com/Strsnger07)

Project Link: [https://github.com/Strsnger07/blog-management-system](https://github.com/Strsnger07/blog-management-system)
