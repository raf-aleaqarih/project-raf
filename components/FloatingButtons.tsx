'use client';

import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { fetchContactSettings, ContactSettings } from '@/lib/api';

const FloatingButtons = () => {
  const locale = useLocale();
  const t = useTranslations('floatingButtons');
  const isRTL = locale === 'ar';
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settings = await fetchContactSettings();
        setContactSettings(settings);
      } catch (error) {
        console.error('Error fetching contact settings:', error);
      }
    };

    fetchData();
  }, []);

  // Use API data with fallback to hardcoded values
  const phoneNumber = contactSettings?.floatingPhone || '0536667967';
  const whatsappNumber = contactSettings?.floatingWhatsapp || '0536667967';

  return (
    <div className={`fixed bottom-8 ${isRTL ? 'right-8' : 'left-8'} flex flex-col gap-4 z-50`}>
      <Link 
        href={`https://wa.me/+966${whatsappNumber}`}
        target="_blank"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={t('whatsapp')}
      >
        <FaWhatsapp size={24} />
      </Link>

      <Link
        href={`tel:${phoneNumber}`}
        className="bg-[#540f6b] hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={t('phone')}
      >
        <FaPhone size={24} />
      </Link>
    </div>
  );
};

export default FloatingButtons;
