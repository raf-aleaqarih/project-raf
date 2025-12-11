'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { fetchContactSettings, ContactSettings } from '@/lib/api';


// تعريف مكونات الأيقونات
const SocialIcons = {
  Snapchat: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.075-.046-.15-.046-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
    </svg>
  ),
  Instagram: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
    </svg>
  ),
  Twitter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  TikTok: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
};

const socialLinks = [
  { 
    icon: 'Snapchat',
    name: 'snap',
    url: 'https://www.snapchat.com/add/rafgrope?share_id=sbvKTrzVRA8&locale=ar-EG'
  },
  { 
    icon: 'Instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/rafgrope/'
  },
  { 
    icon: 'Twitter',
    name: 'X',
    url: 'https://x.com/Rafgrope'
  },
  { 
    icon: 'TikTok',
    name: 'TikTok',
    url: 'https://www.tiktok.com/@rafgrope'
  }
];

const quickLinks = [
  // { text: 'nav.home', href: '/' },
  { text: 'nav.projects', href: '/projects' },
  { text: 'nav.about', href: '/about' },
  // { text: 'nav.contact', href: '/contact' },
  { text: 'nav.privacy', href: '/politics' },
  {text: 'nav.condition', href: '/terms'}  // Added privacy policy link

];

const Footer = () => {
  const locale = useLocale();

  const t = useTranslations();

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


  return (
    <footer className="bg-[#540f6b] text-[#EFEDEA]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Main Footer Content */}
      <div className="border-t border-[#EFEDEA]/10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Company Info */}
                    {/* Company Info */}
                    <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
              <div className="flex items-center gap-4">
                <Image
                  src="/logo_3.png"
                  alt="Logo"
                  width={120}
                  height={70}
                  className="object-contain rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                />
                <p className="text-[#EFEDEA] leading-relaxed">
                  {t('footer.companyDescription')}
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-6 mt-8">
                {socialLinks.map((social, index) => {
                  const Icon = SocialIcons[social.icon as keyof typeof SocialIcons];
                  return (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl border-2 border-[#EFEDEA]/20 flex items-center justify-center
                               hover:bg-[#EFEDEA] hover:text-[#540f6b] hover:scale-110 group transition-all duration-300 shadow-md"
                    >
                      <Icon />
                    </Link>
                  );
                })}
              </div>
            </div>


            {/* Quick Links */}
            <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
              <h4 className="text-xl font-bold mb-6">{t('footer.quickLinks')}</h4>
              <ul className="space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {quickLinks.map((link) => (
                  <li key={link.href} className="group">
                    <Link
                      href={link.href}
                      className="text-[#EFEDEA]/80 hover:text-[#EFEDEA] transition-all duration-300
                               flex items-center gap-3"
                      dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#EFEDEA]/10 flex items-center justify-center
                                  group-hover:bg-[#EFEDEA] transition-all duration-300">
                        <ArrowUpRight className={`w-4 h-4 group-hover:text-[#540f6b] transition-all
                          ${locale === 'ar' ? 'rotate-180' : ''}`} />
                      </div>
                      <span className="block text-base">{t(link.text)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
              <h4 className="text-xl font-bold mb-6">{t('footer.contactUs')}</h4>
              <ul className="space-y-4">
                {[
                  { icon: Phone, text: contactSettings?.marketingPhone || '0536667967', subtext: t('footer.mainNumber'), href: `tel:${contactSettings?.marketingPhone || '0536667967'}` },
                  { icon: Phone, text: contactSettings?.unifiedPhone || '920031103', subtext: t('footer.unifiedNumber'), href: `tel:${contactSettings?.unifiedPhone || '920031103'}`, isUnified: true },
                  { icon: Mail, text: 'info@rafco.sa', subtext: t('footer.email'), href: 'mailto:info@rafco.sa' },
                  { icon: MapPin, text: t('footer.address'), subtext: t('footer.country') },
                ].map((item, index) => (
                  <li key={index} className="group">
                    {item.href ? (
                      <Link href={item.href} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${item.isUnified ? 'bg-[#EFEDEA]/20' : 'bg-[#EFEDEA]/10'} flex items-center justify-center
                                    group-hover:bg-[#EFEDEA] transition-all duration-300`}>
                          <item.icon className="w-4 h-4 group-hover:text-[#540f6b] transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className={`block text-base text-[#EFEDEA]/80 group-hover:text-[#EFEDEA] transition-colors ${item.isUnified ? 'font-bold' : ''}`}>
                            {item.text}
                          </span>
                          <span className="text-sm text-[#EFEDEA]/60">{item.subtext}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EFEDEA]/10 flex items-center justify-center">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="block text-base text-[#EFEDEA]/80">{item.text}</span>
                          <span className="text-sm text-[#EFEDEA]/60">{item.subtext}</span>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Real Estate License */}
          <div className="mt-12 pt-8 border-t border-[#EFEDEA]/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              {/* Fal License with Logo */}
              <div className="flex items-center gap-4">
                <Image
                  src="/fal.svg"
                  alt="Fal Real Estate License"
                  width={100}
                  height={100}
                  className="object-contain bg-white p-1.5 rounded-lg"
                />
                <div className="flex flex-col items-start">
                  <span className="text-sm text-[#EFEDEA]/80">رخصة فال للوساطة العقارية</span>
                  <span className="text-xs text-[#EFEDEA]/60">Fal Real Estate License</span>
                </div>
              </div>

              {/* License Number */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-bold text-[#EFEDEA]">I20002693</span>
                <span className="text-xs text-[#EFEDEA]/60">رقم الترخيص | License No.</span>
              </div>

              {/* QR Code */}
              <div className="flex items-center gap-4">
                <Image
                  src="/qr.png"
                  alt="License QR Code"
                  width={90}
                  height={90}
                  className="object-contain bg-white p-1.5 rounded-lg"
                />
                <div className="flex flex-col items-start">
                  <span className="text-sm text-[#EFEDEA]/80">امسح الرمز للتحقق</span>
                  <span className="text-xs text-[#EFEDEA]/60">Scan to verify</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-[#EFEDEA]/20 text-center">
            <p className="text-[#EFEDEA]/60">
              {t('footer.copyright')}
            </p>
            {/* <p className="text-[#EFEDEA]/80 text-sm mt-4">
              تم التطوير بواسطة <a href="https://goldenmoonads.com/" className="text-[#EFEDEA] underline">Golden Moon Ads</a>
            </p> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
