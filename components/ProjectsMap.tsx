'use client';

/**
 * ProjectsMap Component - Wrapper for MapClient with SSR support
 * 
 * هذا المكون يستخدم dynamic import لتحميل MapClient فقط في المتصفح
 * لتجنب مشاكل SSR مع Leaflet
 */

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMediaQuery } from 'react-responsive';

// تحميل MapClient ديناميكياً بدون SSR
// Dynamic import of MapClient without SSR to avoid Leaflet SSR issues
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center w-full h-[600px] md:h-[700px] lg:h-[80vh] rounded-2xl bg-gray-100">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#540f6b]/20 rounded-full animate-ping"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#540f6b] rounded-full animate-spin"></div>
      </div>
    </div>
  ),
});

// Define the type for project data
interface ProjectData {
  _id: string;
  title: string;
  image: string;
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
  area?: number;
  price?: number;
  status?: string;
  features?: string[];
  progress?: {
    completedPercentage: number;
    availablePercentage: number;
    reservedPercentage: number;
    totalUnits?: number;
  };
  units?: {
    _id: string;
    title: string;
    status?: string;
    area?: number;
    price?: number;
  }[];
  location?: string;
}

interface ProjectsMapProps {
  projects?: ProjectData[];
  selectedType?: string;
}

export default function ProjectsMap({ projects = [], selectedType = 'all' }: ProjectsMapProps) {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  
  // تأكد من أن المكون تم تحميله في المتصفح فقط
  // Ensure component is mounted on client side only
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="flex justify-center items-center w-full h-[600px] md:h-[700px] lg:h-[80vh] rounded-2xl bg-gray-100">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#540f6b]/20 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#540f6b] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      <MapClient 
        projects={projects} 
        selectedType={selectedType}
      />
    </div>
  );
}
