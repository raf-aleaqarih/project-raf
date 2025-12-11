
'use client';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Building2, Crown, Gem, Star } from 'lucide-react';

const exclusiveFeatures = [
  {
    icon: Crown,
    imageUrl: '/hero_2.jpg',
    ar: {
      title: 'تصاميم عصرية',
      description: 'وحدات سكنية بتصاميم راقية تجمع بين الأصالة والحداثة',
      features: ['مساحات واسعة', 'إضاءة طبيعية', 'تشطيبات فاخرة']
    },
    en: {
      title: 'Modern Designs',
      description: 'Residential units with sophisticated designs combining authenticity and modernity',
      features: ['Spacious areas', 'Natural lighting', 'Luxury finishes']
    }
  },
  {
    icon: Building2,
    imageUrl: '/aboutPage.png',
    ar: {
      title: 'تقنيات ذكية',
      description: 'أنظمة منزلية متكاملة تمنحك تحكماً كاملاً في وحدتك السكنية',
      features: ['أنظمة أمان متطورة', 'تحكم ذكي', 'توفير الطاقة']
    },
    en: {
      title: 'Smart Technologies',
      description: 'Integrated home systems giving you complete control of your residential unit',
      features: ['Advanced security', 'Smart control', 'Energy saving']
    }
  },
  {
    icon: Gem,
    imageUrl: '/desk.jpg',
    ar: {
      title: 'مواقع استراتيجية',
      description: 'اختيار دقيق للمواقع يضمن لك سهولة الوصول لجميع الخدمات',
      features: ['قرب الخدمات', 'مداخل متعددة', 'إطلالات مميزة']
    },
    en: {
      title: 'Strategic Locations',
      description: 'Carefully selected locations ensuring easy access to all services',
      features: ['Near services', 'Multiple entrances', 'Premium views']
    }
  }
];

export default function ExclusiveFeatures() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <section className="py-20 bg-gradient-to-b from-[#540f6b] to-[#1a1114]">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Star className="w-12 h-12 text-[#C48765] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {isRTL ? 'مميزات حصرية' : 'Exclusive Features'}
          </h2>
          <div className="w-24 h-1 bg-[#C48765] mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {exclusiveFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-500">
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={feature.imageUrl}
                    alt={isRTL ? feature.ar.title : feature.en.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#540f6b] to-transparent opacity-60" />
                  <feature.icon className="absolute bottom-4 right-4 w-8 h-8 text-[#C48765]" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {isRTL ? feature.ar.title : feature.en.title}
                </h3>
                
                <p className="text-gray-300 mb-6">
                  {isRTL ? feature.ar.description : feature.en.description}
                </p>

                <ul className="space-y-3">
                  {(isRTL ? feature.ar.features : feature.en.features).map((item, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <span className="w-2 h-2 bg-[#C48765] mx-3 rounded-full mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
