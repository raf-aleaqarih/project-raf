'use client'

import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import Link from "next/link"

export default function Hero() {
  const t = useTranslations()
  const locale = useLocale()
  const isRTL = locale === 'ar'

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <section className="relative h-full w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Background Video Layer */}
        <div className="absolute inset-0">
          <video
            autoPlay
    loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          
          {/* Dark Overlay Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/10" />
          
          {/* Additional Dark Layer for Better Text Readability */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />

        {/* Main Content Container */}
        <div className="relative z-10 h-full container mx-auto px-4">
          <div className="h-full flex flex-col justify-center items-start max-w-5xl">
            
            {/* Logo Section */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-12"
            >
              {/* Logo can be added here if needed */}
            </motion.div>

            {/* Main Title Section */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="mb-8"
            >
              <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight ${isRTL ? 'font-arabic' : ''}`}>
                {t('hero.title')}
              </h1>
              
              {/* Decorative Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                className="h-1 w-40 bg-gradient-to-r from-[#681034] via-[#1f0c25] to-[#681034] mb-8"
              />
            </motion.div>

            {/* Description Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="mb-12"
            >
              <div className="flex items-start gap-6 max-w-3xl">
                <p className="text-xl md:text-2xl text-gray-100 leading-relaxed flex-1">
                  {t('hero.description')}
                </p>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                  className="flex-shrink-0"
                >
                  {/* Vision icon can be added here */}
                </motion.div>
              </div>
            </motion.div>

            {/* CTA Buttons Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
              className="flex flex-wrap gap-6"
            >
              <Link 
                href="/projects" 
                className="group px-10 py-4 bg-[#1D0728] hover:bg-[#2a0f3a] text-white rounded-lg transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('hero.exploreProjects')}
              </Link>
              <Link 
                href="/contact" 
                className="group px-10 py-4 bg-[#540f6b] hover:bg-[#6a1487] text-white rounded-lg transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('hero.contactUs')}
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
    
        </div>

   
      </section>
    </div>
  )
}
