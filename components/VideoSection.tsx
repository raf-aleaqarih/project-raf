'use client'

import { useTranslations, useLocale } from 'next-intl'
import VideoShowcase from './VideoShowcase'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

export default function VideoSection() {
  const t = useTranslations()
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const [videoLoaded, setVideoLoaded] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        setVideoLoaded(true)
      }, 500)
    }
  }, [])

  const videoSrc = isMobile ? '/video2.mp4' : '/video1.mp4'

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t('videoSection.title', { default: 'مشاريعنا' })}</h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#681034] to-[#1f0c25]" />
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            {t('videoSection.description', { default: 'شاهد أحدث مشاريعنا العقارية بتقنية الفيديو عالي الجودة' })}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {videoLoaded ? (
            <VideoShowcase 
              src={videoSrc} 
              title={t('videoSection.videoTitle', { default: 'مشروع راف المتطورة الجديد' })}
              description={t('videoSection.videoDescription', { default: 'استمتع بمشاهدة تفاصيل المشروع بجودة عالية وتصميم فريد يعكس رؤيتنا المستقبلية للتطوير العقاري' })}
              className="w-full"
            />
          ) : (
            <div className="w-full h-[50vh] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#681034]/30 border-t-[#681034] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg">{t('videoSection.loading', { default: 'جاري تحميل الفيديو...' })}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
