'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import ThankYouModal from '@/components/ThankYouModal';
import MapModal from '@/components/MapModal';
import ClientOnly from '@/components/ClientOnly';
import { ChevronLeft, ChevronRight, Phone, MessageCircle} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Unit {
  _id: string;
  title: string;
  type: string;
  area: number;
  price: number;
  description: string;
  rooms: number;
  elevators: number;
  images: {
    secure_url: string;
    public_id: string;
    _id: string;
  }[];
  bathrooms: number;
  parking: number;
  guard: number;
  livingrooms: number;
  waterTank: number;
  maidRoom: number;
  status: string;
  cameras: number;
  nearbyPlaces: {
    place: string;
    timeInMinutes: number;
    _id: string;
  }[];
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
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

const ProjectPage = () => {
  // استخدام useParams بدلاً من props
  const params = useParams() || {};
  const unitId = params.unitId as string;
  
  const [currentImage, setCurrentImage] = useState(0);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const t = useTranslations('unitDetails');

  useEffect(() => {
    const fetchUnit = async () => {
      if (!unitId) return;
      
      try {
        const response = await fetch(`https://raf-backend.vercel.app/unit/getunit/${unitId}`);
        const data = await response.json();
        setUnit(data.returnedData.unit);
      } catch (error) {
        console.error('Error fetching unit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [unitId]);

  const handleImageChange = (direction: 'next' | 'prev'): void => {
    if (!unit?.images.length) return;

    if (direction === 'next') {
      setCurrentImage((prev) => (prev + 1) % unit.images.length);
    } else {
      setCurrentImage((prev) => (prev - 1 + unit.images.length) % unit.images.length);
    }
  };

  const handleCopyLocationLink = () => {
    if (unit?.coordinates?.latitude && unit?.coordinates?.longitude) {
      const mapUrl = `https://www.google.com/maps?q=${unit.coordinates.latitude},${unit.coordinates.longitude}`;
      navigator.clipboard.writeText(mapUrl);
      toast.success(t('linkCopied'), {
        style: {
          background: '#540f6b',
          color: '#fff'
        }
      });
    } else if (unit?.location) {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.location)}`;
      navigator.clipboard.writeText(mapUrl);
      toast.success(t('linkCopied'), {
        style: {
          background: '#540f6b',
          color: '#fff'
        }
      });
    }
  };

  if (loading || !unit) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#EFEDEA]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#c48765]/20 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#c48765] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const features = [
    { icon: "/project/image-4.png", label: t('features.guard'), value: unit.guard.toString() },
    { icon: "/project/image-3.png", label: t('features.maidRoom'), value: unit.maidRoom.toString() },
    { icon: "/project/image-1.png", label: t('features.bathrooms'), value: unit.bathrooms.toString() },
    { icon: "/project/image-9.png", label: t('features.rooms'), value: unit.rooms.toString() },
    { icon: "/project/image.png", label: t('features.area'), value: `${unit.area} ${t('features.areaUnit')}` },
    { icon: "/project/image-5.png", label: t('features.cameras'), value: unit.cameras.toString() },
    { icon: "/project/image-8.png", label: t('features.elevator'), value: unit.elevators.toString() },
    { icon: "/project/image-7.png", label: t('features.parking'), value: unit.parking.toString() },
    { icon: "/project/image-6.png", label: t('features.waterTank'), value: unit.waterTank.toString() },
    { icon: "/project/image-2.png", label: t('features.livingRoom'), value: unit.livingrooms.toString() },
  ].filter(feature => parseInt(feature.value) > 0);

  return (
    <ClientOnly>
      <main className="min-h-screen bg-[#EFEDEA]" dir="rtl">
        <Navbar />
        
        {/* Add spacing after navbar */}
        <div className="h-20"></div>
        
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-8 text-right">
              {/* Title */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-[#540f6b] mb-3">{unit.title}</h1>
                <p className="text-[#c48765] font-medium text-lg">{unit.type}</p>
              </div>

              {/* Image Gallery */}
              <div className="bg-white rounded-2xl p-6 shadow-lg overflow-hidden">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#EFEDEA]">
                  <Image
                    src={unit.images[currentImage].secure_url}
                    alt={unit.title}
                    fill
                    className="object-contain"
                    priority
                  />
                  
                  {/* Navigation Controls - Correctly handling RTL/LTR */}
                  <div 
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6"
                    dir={params.locale === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {/* Previous Button - Always left in LTR, right in RTL */}
                    <button
                      onClick={() => handleImageChange('prev')}
                      className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all transform hover:scale-110"
                      aria-label={params.locale === 'ar' ? 'الصورة السابقة' : 'Previous image'}
                    >
                      {params.locale === 'ar' ? 
                        <ChevronRight className="w-6 h-6" /> : 
                        <ChevronLeft className="w-6 h-6" />}
                    </button>
                    
                    {/* Next Button - Always right in LTR, left in RTL */}
                    <button
                      onClick={() => handleImageChange('next')}
                      className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all transform hover:scale-110"
                      aria-label={params.locale === 'ar' ? 'الصورة التالية' : 'Next image'}
                    >
                      {params.locale === 'ar' ? 
                        <ChevronLeft className="w-6 h-6" /> : 
                        <ChevronRight className="w-6 h-6" />}
                    </button>
                  </div>

                  {/* Image Counter - Properly positioned for RTL/LTR */}
                  <div className={`absolute bottom-6 ${params.locale === 'ar' ? 'left-6' : 'right-6'} bg-black/50 px-4 py-2 rounded-full text-white text-sm`}>
                    {currentImage + 1} / {unit.images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#c48765] scrollbar-track-[#EFEDEA]">
                  {unit.images.map((image, index) => (
                    <button
                      key={image._id}
                      onClick={() => setCurrentImage(index)}
                      className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden ${
                        currentImage === index ? 'ring-2 ring-[#c48765]' : 'hover:ring-2 hover:ring-[#c48765]/50'
                      }`}
                    >
                      <Image
                        src={image.secure_url}
                        alt={`${unit.title} - Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              {/* <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[#540f6b] mb-4">{t('description')}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{unit.description}</p>
              </div> */}

              {/* Features Grid */}
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-[#540f6b] mb-8">{t('feature')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={item}
                      className="flex items-center gap-4 p-4 bg-[#EFEDEA] rounded-xl group hover:bg-[#c48765]/10 transition-colors"
                    >
                      <div className="w-12 h-12 relative">
                        <Image
                          src={feature.icon}
                          alt={feature.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{feature.label}</p>
                        <p className="text-lg font-bold text-[#540f6b]">{feature.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Nearby Places */}
              {unit.nearbyPlaces.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-[#540f6b] mb-8">{t('nearbyPlaces')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unit.nearbyPlaces.map((place, index) => (
                      <div key={index} className="p-6 bg-[#EFEDEA] rounded-xl text-center group hover:bg-[#c48765]/10 transition-colors">
                        <span className="block text-3xl font-bold text-[#c48765] mb-1">
                          {place.timeInMinutes} {t('features.minutes')}
                        </span>
                        <span className="text-base font-medium text-gray-600">
                          {place.place}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Quick Info and Contact */}
            <div className="lg:col-span-1 space-y-6 text-right">
              {/* Price and Status */}

              {/* Contact Options */}
              <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
                <h2 className="text-2xl font-bold text-[#540f6b] mb-6">{t('contact.title')}</h2>
                <div className="space-y-4">
                  <Link href="tel:+966536667967" className="w-full flex items-center justify-center gap-3 p-4 bg-[#540f6b] text-white rounded-xl hover:bg-[#540f6b]/90 transition-colors group">
                    <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-base">{t('contact.callUs')}</span>
                  </Link>
                  <Link className="w-full flex items-center justify-center gap-3  bg-[#25D366] text-white rounded-xl hover:bg-[#25D366]/90 transition-colors group"
                    href="https://wa.me/+966536667967 " target='_blank'>
                    <button className="w-full flex items-center justify-center gap-3 p-4 bg-[#25D366] text-white rounded-xl hover:bg-[#25D366]/90 transition-colors group">
                      <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-base">{t('contact.whatsapp')}</span>
                    </button>
                  </Link>
                  {/* <button 
                    onClick={handleCopyLocationLink}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-[#c48765] text-white rounded-xl hover:bg-[#c48765]/90 transition-colors group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="text-base">{t('copyLocation')}</span>
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add spacing before footer */}
        <div className="h-20"></div>

        {/* Modals */}
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
        <ThankYouModal
          isOpen={isThankYouOpen}
          onClose={() => setIsThankYouOpen(false)}
        />
        {/* <MapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          location={unit.location}
          coordinates={unit.coordinates}
        /> */}

        <Footer />
      </main>
    </ClientOnly>
  );
};

export default ProjectPage;