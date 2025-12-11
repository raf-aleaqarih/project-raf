import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function MaintenancePage() {
  const t = useTranslations('Maintenance');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-8">
          <Image 
            src="/finallogo.png" 
            alt="RAF Logo" 
            width={200} 
            height={80} 
            className="mx-auto"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {t('title')}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {t('message')}
        </p>
        
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-6">
          <div className="bg-blue-600 h-full w-3/4 animate-pulse"></div>
        </div>
{/*         
        <p className="text-sm text-gray-500">
          {t('contact')}
        </p> */}
      </div>
    </div>
  );
} 