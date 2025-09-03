'use client'

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Animated Poetry Circles */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      {/* Animated Text */}
      <div className="flex space-x-1 text-sm text-gray-600">
        <span className="animate-pulse" style={{ animationDelay: '0ms' }}>Inspiring</span>
        <span className="animate-pulse" style={{ animationDelay: '200ms' }}>•</span>
        <span className="animate-pulse" style={{ animationDelay: '400ms' }}>Creating</span>
        <span className="animate-pulse" style={{ animationDelay: '600ms' }}>•</span>
        <span className="animate-pulse" style={{ animationDelay: '800ms' }}>Crafting</span>
      </div>
    </div>
  )
}