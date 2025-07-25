"use client"

interface NFTPlaceholderProps {
  count: number;
  className?: string;
}

export default function NFTPlaceholder({ count, className = "" }: NFTPlaceholderProps) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div 
          key={`placeholder-${index}`} 
          className={`bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg animate-pulse ${className}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Placeholder Image */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
                <svg className="relative w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            {/* Placeholder Token ID Badge */}
            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
              <div className="w-6 h-3 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Placeholder Info */}
          <div className="p-5">
            {/* Title placeholder */}
            <div className="h-5 bg-gray-800 rounded-md mb-3 w-3/4 animate-pulse"></div>
            
            {/* Owner section placeholder */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-3 bg-gray-800 rounded w-16 animate-pulse"></div>
              </div>
              <div className="h-3 bg-gray-800 rounded w-20 animate-pulse"></div>
            </div>
            
            {/* Placeholder attributes */}
            <div className="flex gap-1.5">
              <div className="h-6 bg-gray-800 rounded-md w-16 animate-pulse"></div>
              <div className="h-6 bg-gray-800 rounded-md w-12 animate-pulse"></div>
              <div className="h-6 bg-gray-800 rounded-md w-14 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}