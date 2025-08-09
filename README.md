# Blog Management System

A full-stack blog platform built with Next.js 14, featuring a modern responsive design and comprehensive content management capabilities.

## 🚀 Features

- **Dynamic Blog Display**: Responsive grid layout showcasing blog posts with category filtering (Technology, Startup, Lifestyle)
- **Admin Dashboard**: Complete content management system with blog creation, editing, and subscription management
- **Email Subscription System**: Integrated newsletter subscription functionality with email notifications
- **Modern UI/UX**: Clean, minimalist design with hover effects and smooth animations using Tailwind CSS
- **Database Integration**: MongoDB backend with RESTful API endpoints for data persistence
- **Image Optimization**: Next.js Image component integration for optimized media handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Node.js, MongoDB
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
├── lib/                  # Database models and configuration
└── public/               # Public static files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or cloud)

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
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### For Users
- Browse blogs by category (Technology, Startup, Lifestyle)
- Subscribe to email newsletter
- Read full blog articles

### For Admins
- Access admin panel at `/admin`
- Create and manage blog posts
- View and manage email subscriptions
- Monitor blog analytics

## 🔧 API Endpoints

- `GET /api/blog` - Get all blogs
- `GET /api/blog?id={id}` - Get specific blog
- `POST /api/blog` - Create new blog
- `POST /api/email` - Subscribe to newsletter

## 🎨 Design Features

- Responsive design for all devices
- Modern UI with hover effects
- Clean typography and spacing
- Optimized images and performance

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
