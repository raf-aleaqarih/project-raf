'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Error() {
  const t = useTranslations('errors');

  return (
    <div className="min-h-screen bg-[#EFEDEA] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src="/500.svg"
            alt="500"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-[#540f6b] mb-4">
          {t('500.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t('500.message')}
        </p>
        <Link 
          href="/"
          className="inline-block bg-[#C48765] text-white px-8 py-3 rounded-lg
                   hover:bg-[#AA9554] transition-colors duration-300"
        >
          {t('500.tryAgain')}
        </Link>
      </div>
    </div>
  );
}