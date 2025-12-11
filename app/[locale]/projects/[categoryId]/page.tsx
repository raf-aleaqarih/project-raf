'use client';
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureSection from "@/components/FeatureSection";
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ClientOnly from "@/components/ClientOnly";
import { motion } from 'framer-motion';
import { MapPin, Home, Bath, Car, Bed, Maximize2, Camera, Shield, Droplet, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Category {
  _id: string;
  title: string;
  description: string;
  Image: {
    secure_url: string;
    public_id: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  area: number;
  location: string;
}

interface Unit {
  _id: string;
  title: string;
  description: string;
  images: {
    secure_url: string;
    public_id: string;
    _id: string;
  }[];
  status: string;
  area: number;
  rooms: number;
  bathrooms: number;
  parking: number;
  price: number;
  location: string;
  type: string;
  livingrooms: number;
  customId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  maidRoom: number;
  cameras: number;
  waterTank: number;
  guard: number;
  nearbyPlaces: [{ place: string, timeInMinutes: number }];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ProjectDetails() {
  const locale = useLocale();
  const t = useTranslations('projectDetails');
  const params = useParams() || {};
  const [units, setUnits] = useState<Unit[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const categoryId = params.categoryId as string;

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      
      try {
        const [unitsResponse, categoryResponse] = await Promise.all([
          fetch(locale === 'ar'
            ? `https://raf-backend.vercel.app/unit/getAllUnitByCategoryIdAR/${categoryId}`
            : `https://raf-backend.vercel.app/unit/getAllUnitByCategoryIdEN/${categoryId}`),
          fetch(`https://raf-backend.vercel.app/category/getOne/${categoryId}`)
        ]);
        const unitsData = await unitsResponse.json();
        const categoryData = await categoryResponse.json();
        setUnits(unitsData.units);
        setCategory(categoryData.category);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [locale, categoryId]);

  const handleCopyLink = (unitId: string) => {
    const url = `${window.location.origin}/projects/${categoryId}/${unitId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(unitId);
    toast.success(t('linkCopied'));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyLocationLink = () => {
    if (category?.coordinates?.latitude && category?.coordinates?.longitude) {
      const mapUrl = `https://www.google.com/maps?q=${category.coordinates.latitude},${category.coordinates.longitude}`;
      navigator.clipboard.writeText(mapUrl);
      toast.success(t('linkCopied'));
    } else if (category?.location) {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(category.location)}`;
      navigator.clipboard.writeText(mapUrl);
      toast.success(t('linkCopied'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#540f6b]/20 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#540f6b] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const renderFeatureIcon = (value: number, Icon: React.ElementType, label: string) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Icon className="w-5 h-5 text-[#540f6b]" />
        <span>{value} {label}</span>
      </div>
    );
  };

  return (
    <ClientOnly>
      <main className="min-h-screen bg-[#EFEDEA]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src={category?.Image.secure_url || './rafweb.jpg'}
            alt={category?.title || ''}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/100 " />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                {category?.title}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-32 h-1 bg-[#540f6b] mx-auto rounded-full"
              />
            </div>
          </div>
        </section>

        <div className="container max-w-[1312px] mx-auto px-4 py-16">
          {/* RTL/LTR content container */}
          <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
                {/* Project details header with location */}
                <div className="relative overflow-hidden bg-gradient-to-r from-[#540f6b]/10 to-[#540f6b]/10 p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md">
                      <MapPin className="w-8 h-8 text-[#540f6b]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">{t('location')}</h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-xl font-semibold text-[#540f6b]">{category?.location}</p>
                        <button
                          onClick={handleCopyLocationLink}
                          className="p-2 bg-white/70 hover:bg-[#540f6b]/20 rounded-lg transition-all duration-300 group relative"
                          aria-label={t('copyLocation')}
                        >
                          <Copy className="w-5 h-5 text-[#540f6b]" />
                          <span className="absolute -top-10 transform -translate-x-1/2 left-1/2 bg-[#540f6b] text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                            {t('copyLocation')}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visual divider */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#540f6b] via-[#540f6b] to-[#540f6b] opacity-50"></div>
                </div>
                
                {/* Project description section */}
                <div className="p-6 md:p-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                  <motion.h3 
                    initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-2xl font-bold text-[#540f6b] mb-5 flex items-center gap-3 ${locale === 'ar' ? 'justify-start' : 'justify-end'}`}
                  >
                    <span className="inline-block w-6 h-1 bg-[#540f6b] rounded-full"></span>
                    {t('projectDescription')}
                    <span className="inline-block w-6 h-1 bg-[#540f6b] rounded-full"></span>
                  </motion.h3>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative overflow-hidden"
                  >
                    <div 
                      className={`prose prose-lg max-w-none ${locale === 'ar' ? 'text-right' : 'text-left'}`}
                      style={{ 
                        direction: locale === 'ar' ? 'rtl' : 'ltr'
                      }}
                    >
                      <p className="text-gray-700 text-base md:text-lg first-letter:text-3xl first-letter:font-bold first-letter:text-[#540f6b] first-line:tracking-wide"
                        style={{ 
                          lineHeight: '1.8em', 
                          textAlign: 'justify',
                          textAlignLast: locale === 'ar' ? 'right' : 'left',
                          textJustify: 'inter-word',
                          maxWidth: '100%',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {category?.description}
                      </p>
                    </div>
                    
                    {/* Subtle decoration */}
                    <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#540f6b]/0 via-[#540f6b]/30 to-[#540f6b]/0 rounded-full" 
                      style={{ [locale === 'ar' ? 'right' : 'left']: '-10px' }}
                    ></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Units Grid */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
            >
              {units.map((unit) => (
                <motion.div
                  key={unit._id}
                  variants={item}
                  className={`group bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl flex flex-col h-full
                    ${(unit.status === 'Sold' || unit.status === 'مباع' || unit.status === 'Rented' || unit.status === 'مؤجر' || unit.status === 'Unavailable' || unit.status === 'غير متاح' || unit.status === 'Reserved' || unit.status === 'محجوز')
                      ? 'opacity-90'
                      : 'hover:scale-[1.02]'}`}
                >
                  <div className="relative h-[300px]">
                    <Image
                      src={unit.images[0].secure_url}
                      alt={unit.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Status Overlays */}
                    {(() => {
                      switch (unit.status) {
                        case 'Sold':
                        case 'مباع':
                          return (
                            <>
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
                              <div className="absolute inset-0 flex items-center justify-center z-20">
                                <Image
                                  src="/sizes/sold.png"
                                  alt="Sold"
                                  width={180}
                                  height={180}
                                  className="object-contain transform scale-125 animate-pulse"
                                />
                              </div>
                            </>
                          );
                        case 'Rented':
                        case 'مؤجر':
                          return (
                            <>
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
                              <div className="absolute inset-0 flex items-center justify-center z-20">
                                <Image
                                  src="/sizes/hagz.png"
                                  alt="Rented"
                                  width={180}
                                  height={180}
                                  className="object-contain transform scale-125 animate-pulse"
                                />
                              </div>
                            </>
                          );
                        case 'Available for sale':
                        case 'متاح للبيع':
                          return (
                            <div className="absolute top-4 left-4 px-6 py-2 bg-emerald-500 text-white font-semibold rounded-full shadow-lg">
                              {t('status.availableForSale')}
                            </div>
                          );
                        case 'Available for rent':
                        case 'متاح للإيجار':
                          return (
                            <div className="absolute top-4 left-4 px-6 py-2 bg-[#540f6b] text-white font-semibold rounded-full shadow-lg">
                              {t('status.availableForRent')}
                            </div>
                          );
                        case 'Reserved':
                        case 'محجوز':
                          return (
                            <>
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
                              <div className="absolute inset-0 flex items-center justify-center z-20">
                                <Image
                                  src="/sizes/reserved.png"
                                  alt="Reserved"
                                  width={180}
                                  height={180}
                                  className="object-contain transform scale-125 animate-pulse"
                                />
                              </div>
                            </>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </div>

                  <div className="p-6 flex flex-col flex-grow" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    <div className={`flex items-center justify-between mb-4`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                      <h3 dir={locale === 'ar' ? 'rtl' : 'ltr'} className="text-lg font-bold text-[#540f6b]">{unit.title}</h3>
                      <div className={`flex items-center gap-2`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                        <button
                          onClick={() => handleCopyLink(unit._id)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                          title={t('copyLink')}
                          dir={locale}
                        >
                          {copiedId === unit._id ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/${locale}/projects/${categoryId}/${unit._id}`;
                            if (navigator.share) {
                              navigator.share({
                                title: unit.title,
                                text: unit.description,
                                url: url,
                              });
                            } else {
                              // Fallback for browsers that don't support Web Share API
                              navigator.clipboard.writeText(url);
                              toast.success(t('linkCopied'));
                            }
                          }}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                          title={t('share')}
                          dir={locale}
                        >
                          <Share2 className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 mb-6`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                      <span className="text-sm font-medium text-gray-500">{t('unitId')}:</span>
                      <span className="text-sm font-medium text-[#540f6b]">{unit.customId}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                      {renderFeatureIcon(unit.rooms, Bed, t('rooms'))}
                      {renderFeatureIcon(unit.livingrooms, Home, t('livingrooms'))}
                      {renderFeatureIcon(unit.bathrooms, Bath, t('bathrooms'))}
                      {renderFeatureIcon(unit.parking, Car, t('parking'))}
                      {renderFeatureIcon(unit.cameras, Camera, t('cameras'))}
                      {renderFeatureIcon(unit.guard, Shield, t('guard'))}
                      {renderFeatureIcon(unit.waterTank, Droplet, t('waterTank'))}
                    </div>

                    <div className={`flex items-center justify-between mb-6`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                      <div className={`flex items-center gap-2`} dir={locale === 'ar' ? 'rtl' : 'ltr'} >
                        <Maximize2 className="w-5 h-5 text-[#540f6b]" />
                        <span className="text-gray-600">{unit.area} {t('areaUnit')}</span>
                      </div>
                    </div>

                    {unit.price && (
                      <div className={`flex items-center gap-2 mb-6`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                        <span className="text-lg font-bold text-[#540f6b]">{t('price')}:</span>
                        <span className="text-xl font-bold text-[#540f6b]">
                          {unit.price.toLocaleString()} {t('currency')}
                        </span>
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      <Link href={`/projects/${categoryId}/${unit._id}`}>
                        <button className={`w-full bg-gradient-to-r ${locale === 'ar' ? 'from-[#540f6b] to-[#540f6b]' : 'from-[#540f6b] to-[#b37654]'} text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
                          {t('viewDetails')}
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>

        <FeatureSection />
        <Footer />
      </main>
    </ClientOnly>
  );
}
