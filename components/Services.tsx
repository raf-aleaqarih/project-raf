'use client';
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';

import { Home, Phone, Wrench, Droplet, Users, Zap } from 'lucide-react';

const services = [
  { id: 1, key: 'rental', icon: Home },
  { id: 2, key: 'communication', icon: Phone },
  { id: 3, key: 'maintenance', icon: Wrench },
  { id: 4, key: 'water', icon: Droplet },
  { id: 5, key: 'staff', icon: Users },
  { id: 6, key: 'electricity', icon: Zap }
];

export default function Services() {
  const t = useTranslations('services');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-[#f4ede9] via-white to-[#f4ede9]">
      <div className={`container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 ${isArabic ? 'text-right' : 'text-left'}`} 
           dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Header Section - Smaller Typography for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20"
        >
          <span className="text-[#1f0c25] text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-2 sm:mb-3 md:mb-4 block">
            {t('ourServices')}
          </span>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1d0728] leading-tight mb-3 sm:mb-4 md:mb-6">
            {t('afterSaleTitle')}
          </h2>
          
          <div className="w-20 sm:w-24 md:w-32 lg:w-40 h-0.5 sm:h-1 md:h-1.5 bg-gradient-to-r from-[#1f0c25] to-[#1d0728] mx-auto mb-3 sm:mb-4 md:mb-6 rounded-full" />
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#1d0728]/70 max-w-3xl mx-auto font-medium leading-relaxed px-2 sm:px-4">
            {t('freeServices')}
          </p>
        </motion.div>

        {/* Services Grid - Adjusted Spacing and Typography */}
        <div className="grid grid-cols-2 auto-rows-fr gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: Math.floor(index / 2) * 0.2
              }}
              style={{
                gridRow: `${Math.floor(index / 2) + 1}`,
                height: '100%'
              }}
              className="group"
            >
              <div className={`relative h-full bg-[#f4ede9] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl 
                            overflow-hidden p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8
                            shadow-sm hover:shadow-lg transition-all duration-500 
                            border border-gray-100 ${isArabic ? 'text-right' : 'text-left'}`} 
                   dir={isArabic ? 'rtl' : 'ltr'}>
                
                {/* Decorative Corner - Smaller for Mobile */}
                <div className={`absolute top-0 ${isArabic ? 'left-0' : 'right-0'} 
                              w-12 xs:w-14 sm:w-20 md:w-24 lg:w-32 
                              h-12 xs:h-14 sm:h-20 md:h-24 lg:h-32 
                              bg-gradient-to-b from-[#1d0728]/5 to-transparent 
                              ${isArabic ? 'rounded-br-full' : 'rounded-bl-full'}`} />
                
                <div className="relative">
                  {/* Icon and Line - Smaller for Mobile */}
                  <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
  <div className="relative group-hover:scale-110 transition-transform duration-300">
    <span className="absolute inset-0 bg-[#540f6b]/20 rounded-full blur-sm transform scale-110 group-hover:scale-125 transition-all duration-300"></span>
    <span className="relative flex items-center justify-center text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-br from-[#540f6b] to-[#8a1dab] rounded-full p-2 text-white shadow-md group-hover:shadow-lg group-hover:from-[#8a1dab] group-hover:to-[#540f6b] transition-all duration-300">
      {React.createElement(service.icon, { className: "w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" })}
    </span>
  </div>
  <div className={`flex-1 h-0.5 bg-gradient-to-r from-[#1f0c25] to-[#540f6b] rounded-full transform origin-${isArabic ? 'right' : 'left'} scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
</div>

                  
                  {/* Title - Smaller for Mobile */}
                  <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#1d0728] 
                               mb-1.5 xs:mb-2 sm:mb-3 md:mb-4 group-hover:text-[#1f0c25] 
                               transition-colors duration-300 line-clamp-2">
                    {t(`items.${service.key}`)}
                  </h3>
                  
                  {/* Description - Smaller for Mobile */}
                  <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 
                               leading-relaxed line-clamp-2 xs:line-clamp-3 sm:line-clamp-4">
                    {t(`descriptions.${service.key}`)}
                  </p>
                </div>
                
                {/* Bottom Gradient Line */}
                <div className="absolute bottom-0 left-0 w-full h-0.5
                              bg-gradient-to-r from-[#1d0728] to-[#1f0c25] 
                              transform scale-x-0 group-hover:scale-x-100 
                              transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Elements - Responsive Sizing */}
      <div className={`absolute top-0 ${isArabic ? 'right-0' : 'left-0'} 
                    w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 
                    bg-[#1f0c25]/5 rounded-full 
                    ${isArabic ? 'translate-x-1/2' : '-translate-x-1/2'} -translate-y-1/2 
                    blur-2xl sm:blur-3xl`} />
      <div className={`absolute bottom-0 ${isArabic ? 'left-0' : 'right-0'} 
                    w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 
                    bg-[#1d0728]/5 rounded-full 
                    ${isArabic ? '-translate-x-1/2' : 'translate-x-1/2'} translate-y-1/2 
                    blur-2xl sm:blur-3xl`} />
    </section>
  );
}