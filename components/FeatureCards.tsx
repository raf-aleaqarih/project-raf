'use client'

import Image from "next/image"
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

const features = [
  {
    key: "goals",
    icon: "/medal-star.svg",
    style: "bg-[#540f6b]",
    styleText: "text-[#c48765]"
  },
  {
    key: "vision",
    icon: "/shield-tick.png"
  },
  {
    key: "mission",
    icon: "/status-up.svg"
  },
]

export default function FeatureCards() {
  const t = useTranslations('features')

  return (
    <div className="relative z-10 -mt-32">
      <div className="container mx-auto px-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-basic to-secondary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50" />
              
              <div className="
                relative
                backdrop-blur-sm
                bg-[#EFEDEA]/80
                rounded-3xl 
                p-12
                shadow-2xl
                text-center
                w-full 
                max-w-[380px]
                min-h-[400px] 
                flex 
                flex-col
                transform
                transition-all
                duration-500
                hover:-translate-y-4
                hover:shadow-xl
                border
                border-primary/10
                overflow-hidden
              ">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

                {/* Icon Container */}
                <motion.div 
                  className="mb-8 flex justify-center relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg">
                    <Image
                      src={feature.icon}
                      alt={t(`${feature.key}.title`)}
                      width={80}
                      height={80}
                      className="w-20 h-20 transform transition-transform group-hover:scale-110"
                    />
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="
                  text-3xl 
                  font-bold 
                  text-primary 
                  mb-6
                  relative
                  after:content-['']
                  after:absolute
                  after:-bottom-2
                  after:left-1/2
                  after:-translate-x-1/2
                  after:w-12
                  after:h-1
                  after:bg-secondary
                  after:rounded-full
                ">
                  {t(`${feature.key}.title`)}
                </h3>

                <p className="
                  text-primary/80 
                  text-xl 
                  leading-[1.8] 
                  max-w-[280px] 
                  mx-auto 
                  flex-grow
                ">
                  {t(`${feature.key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
