import Image from "next/image";
import Link from "next/link";
import { assets } from "@/Assets/assets";

const BlogItem = ({ id, image, title, description, category }) => {
  const isBase64 = image && image.startsWith('data:image');

  return (
    <div className="blog-card w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/blogs/${id}`}>
        {isBase64 ? (
          // Handle base64 images
          <div className="w-full h-48 flex items-center justify-center bg-gray-50">
            <img
              src={image}
              alt={title}
              className="w-48 h-40 object-contain"
            />
          </div>
        ) : (
          // Handle regular images with Next.js Image component
          <div className="w-full h-48 flex items-center justify-center bg-gray-50">
            <Image
              src={image}
              alt={title}
              width={192}
              height={160}
              className="w-48 h-40 object-contain"
            />
          </div>
        )}
      </Link>
      <div className="p-4 pt-8">
        <div className="flex items-center gap-3 mb-4 mt-6">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
            {category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-4 mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <Link 
            href={`/blogs/${id}`}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2 transition-colors duration-200"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
