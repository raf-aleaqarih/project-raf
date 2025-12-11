'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoPlayerProps {
  src: string
  type?: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  overlay?: boolean
  caption?: string
}

export default function VideoPlayer({
  src,
  type = 'video/mp4',
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  overlay = false,
  caption = ''
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Ensure src has the correct format
  const videoSrc = src.startsWith('/') ? src : `/${src}`

  useEffect(() => {
    // التأكد من أن الكود يعمل فقط في المتصفح
    if (typeof window === 'undefined' || !videoRef.current) return

    const videoElement = videoRef.current

    const handleLoadedData = () => {
      setIsLoaded(true)
      setHasError(false)
      console.log('Video loaded successfully:', videoSrc)
    }

    const handleError = (e: any) => {
      setHasError(true)
      setIsLoaded(false)
      console.error('Error loading video:', videoSrc, e)
    }

    videoElement.addEventListener('loadeddata', handleLoadedData)
    videoElement.addEventListener('error', handleError)
    
    // محاولة تحميل الفيديو مرة أخرى في حالة الخطأ
    if (hasError) {
      const retryTimeout = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load()
        }
      }, 1000)
      
      return () => {
        clearTimeout(retryTimeout)
        videoElement.removeEventListener('loadeddata', handleLoadedData)
        videoElement.removeEventListener('error', handleError)
      }
    }
    
    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData)
      videoElement.removeEventListener('error', handleError)
    }
  }, [videoSrc, hasError])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error)
        setHasError(true)
      })
    }
    
    setIsPlaying(!isPlaying)
  }

  return (
    <div className={`relative w-full h-full overflow-hidden group ${className}`}>
      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 text-white p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-center">خطأ في تحميل الفيديو. تأكد من أن المسار صحيح: {videoSrc}</p>
          <button 
            onClick={() => {
              setHasError(false)
              if (videoRef.current) {
                videoRef.current.load()
              }
            }}
            className="mt-4 px-4 py-2 bg-[#681034] text-white rounded-md hover:bg-[#7a1a42] transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
      
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        controls={controls}
        onClick={togglePlay}
        className={`w-full h-full object-contain transition-transform duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${!controls && 'cursor-pointer'} group-hover:scale-105`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={videoSrc} type={type} />
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
      
      {/* Play/Pause Button */}
      {!controls && isLoaded && !hasError && (
        <button
          onClick={togglePlay}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'} group-hover:opacity-100 z-20`}
          aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}
      
      {/* Optional Overlay */}
      {overlay && <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-none" />}
      
      {/* Optional Caption */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-center text-lg font-medium">{caption}</p>
        </div>
      )}
    </div>
  )
}
