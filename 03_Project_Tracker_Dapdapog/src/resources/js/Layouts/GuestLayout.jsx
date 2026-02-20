export default function GuestLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="bg-white p-8 rounded-lg shadow-lg z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
