'use client';
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import { useRef, useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
interface Review {
  _id: string
  name: string
  description: string
  country: string
  rate: number
  Image: {
    secure_url: string
    public_id: string
  }
}

interface ReviewResponse {
  message: string
  reviews: Review[] | undefined
}
export default function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
              const apiUrl =
                locale === 'ar'
                  ? 'https://raf-backend.vercel.app/review/ar'
                  : 'https://raf-backend.vercel.app/review/en'
                  const response = await fetch(apiUrl)

              const data: ReviewResponse = await response.json();

 if (Array.isArray(data.reviews)) {
  console.log("REVIEW DATA", data.reviews);
  
          setReviews(data.reviews)
        } else {
          console.error('Invalid reviews data:', data)
        }

        setLoading(false)} catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 bg-[#C48765] rounded-full"
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-[#EFEDEA] via-white to-[#EFEDEA]">
      {/* Animated Background Elements */}
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C48765]/10 to-[#c48765]/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          rotate: -360,
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#540f6b]/10 to-[#c48765]/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/50 backdrop-blur-sm rounded-full mb-6"
          >
            <Sparkles className="w-5 h-5 text-[#C48765]" />
            <span className="text-sm font-medium text-[#540f6b]">{t('subtitle')}</span>
          </motion.div>
          
          <h2 className="text-5xl font-bold text-[#540f6b] mb-6">
            {t('title')}
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "224px" }}
            className="h-1 bg-gradient-to-r from-[#C48765] via-[#E3A587] to-[#C48765] mx-auto rounded-full"
          />
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative max-w-[1400px] mx-auto">
          <Swiper
            modules={[Navigation, Autoplay, EffectCoverflow]}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            centeredSlides={true}
            slidesPerView={3}
            spaceBetween={30}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            dir={isRTL ? 'rtl' : 'ltr'}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            className="testimonials-slider !overflow-visible"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="bg-white/80 backdrop-blur-md rounded-[30px] p-8 shadow-xl border border-[#C48765]/10
                           transform transition-all duration-300 hover:shadow-2xl hover:bg-white/90"
                >
                  {/* Profile Image with Animated Border */}
                  <div className="relative mb-8">
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                      <div className="relative w-24 h-24">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-[#C48765] via-[#E3A587] to-[#C48765] rounded-full"
                        />
                        <div className="absolute inset-[2px] bg-white rounded-full" />
                        <Image
                          src={review.Image.secure_url}
                          alt={review.name}
                          fill
                          className="rounded-full object-cover p-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-16 text-center">
                    <Quote className="w-10 h-10 mx-auto mb-6 text-[#C48765] opacity-30" />
                    
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(review.rate)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 text-[#FFA500] fill-current" />
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-lg text-[#540f6b]/80 mb-6 line-clamp-4">
                      {review.description}
                    </p>

                    <div className="pt-6 border-t border-[#C48765]/10">
                      <h3 className="text-xl font-bold text-[#540f6b] mb-1">{review.name}</h3>
                      <p className="text-[#C48765]">{review.country}</p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <motion.button
            ref={prevRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm
                     rounded-full flex items-center justify-center shadow-lg hover:shadow-xl z-10
                     border border-[#C48765]/10 transition-all duration-300"
          >
            {isRTL ? <ChevronRight className="w-6 h-6 text-[#540f6b]" /> : <ChevronLeft className="w-6 h-6 text-[#540f6b]" />}
          </motion.button>
          <motion.button
            ref={nextRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm
                     rounded-full flex items-center justify-center shadow-lg hover:shadow-xl z-10
                     border border-[#C48765]/10 transition-all duration-300"
          >
            {isRTL ? <ChevronLeft className="w-6 h-6 text-[#540f6b]" /> : <ChevronRight className="w-6 h-6 text-[#540f6b]" />}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
