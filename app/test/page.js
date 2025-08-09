export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">✅ Blog App is Working!</h1>
        <p className="text-xl mb-4">If you can see this page, the basic setup is working.</p>
        <a 
          href="/" 
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Go to Main Page
        </a>
      </div>
    </div>
  )
}

