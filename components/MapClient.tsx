'use client';

/**
 * MapClient Component - React-Leaflet Map with OpenStreetMap
 *
 * هذا المكون يستخدم react-leaflet مع OpenStreetMap لعرض خريطة تفاعلية
 * يدعم:
 * - Hover على Desktop (يظهر tooltip)
 * - Click على Mobile (يظهر popup)
 * - علامات مخصصة بلون بنفسجي
 * - بطاقات مشاريع بتصميم احترافي
 */

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

// إصلاح مشكلة أيقونات Leaflet في Next.js
// Fix Leaflet default icon paths for Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// تعريف نوع بيانات المشروع
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
  location?: string;
}

interface MapClientProps {
  projects: ProjectData[];
  selectedType?: string;
}

// إنشاء أيقونة مخصصة بلون بنفسجي باستخدام SVG
// Custom purple marker icon using inline SVG
const createCustomIcon = (isHovered: boolean = false) => {
  const size = isHovered ? 48 : 40;
  const color = isHovered ? '#C48765' : '#540f6b'; // Gold on hover, purple default
  
  const svgIcon = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
            fill="${color}" 
            stroke="white" 
            stroke-width="1"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    tooltipAnchor: [0, -size / 2]
  });
};

// مكون لضبط حدود الخريطة تلقائياً لإظهار جميع العلامات
// Component to auto-fit map bounds to show all markers
function MapBoundsHandler({ projects }: { projects: ProjectData[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (projects.length > 0) {
      const bounds = L.latLngBounds(
        projects.map(p => [p.coordinates.lat, p.coordinates.lng])
      );
      
      // ضبط الخريطة لإظهار جميع العلامات
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14 // لا نريد التكبير أكثر من اللازم
      });
    }
  }, [projects, map]);
  
  return null;
}

// مكون البطاقة المعروضة في Tooltip/Popup
// Card component shown in Tooltip/Popup
function ProjectCard({ project, locale }: { project: ProjectData; locale: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-2 rounded-2xl shadow-lg w-52 max-w-[200px] text-center"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="relative h-32 w-full rounded-xl overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="200px"
        />
      </div>
      <h3 className="mt-2 text-[#C48765] font-semibold text-sm line-clamp-2">
        {project.title}
      </h3>
      {project.location && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          {project.location}
        </p>
      )}
    </motion.div>
  );
}

export default function MapClient({ projects = [], selectedType = 'all' }: MapClientProps) {
  const locale = useLocale();
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [clickedMarker, setClickedMarker] = useState<string | null>(null);
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});
  
  // التحقق من نوع الجهاز
  // Check device type
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
  
  // تصفية المشاريع حسب النوع المحدد
  // Filter projects by selected type
  const filteredProjects = selectedType === 'all'
    ? projects
    : projects.filter(project => {
        const projectType = project.type.toLowerCase();
        return selectedType === 'residential' 
          ? projectType.includes('سكني') || projectType.includes('resident')
          : projectType.includes('تجاري') || projectType.includes('commerc');
      });

  // مركز الخريطة على جدة
  // Center map on Jeddah
  const defaultCenter: [number, number] = [21.5433, 39.1728];
  const defaultZoom = 12;

  // ارتفاع الخريطة حسب نوع الجهاز
  // Map height based on device type
  const mapHeight = isMobile ? '600px' : isTablet ? '700px' : '80vh';

  // معالج hover على العلامة (Desktop فقط)
  // Marker hover handler (Desktop only)
  const handleMarkerMouseOver = (projectId: string) => {
    if (!isMobile) {
      setHoveredMarker(projectId);
      // فتح Tooltip تلقائياً
      const marker = markerRefs.current[projectId];
      if (marker) {
        marker.openTooltip();
      }
    }
  };

  const handleMarkerMouseOut = () => {
    if (!isMobile) {
      setHoveredMarker(null);
    }
  };

  // معالج النقر على العلامة (Mobile و Desktop)
  // Marker click handler (Mobile & Desktop)
  const handleMarkerClick = (projectId: string) => {
    setClickedMarker(projectId);
    const marker = markerRefs.current[projectId];
    if (marker) {
      marker.openPopup();
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: mapHeight }}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        className="rounded-2xl"
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={10}
        />
        
        {/* Auto-fit bounds to show all markers */}
        <MapBoundsHandler projects={filteredProjects} />
        
        {/* Markers for each project */}
        {filteredProjects.map((project) => (
          <Marker
            key={project._id}
            position={[project.coordinates.lat, project.coordinates.lng]}
            icon={createCustomIcon(hoveredMarker === project._id)}
            ref={(ref) => {
              markerRefs.current[project._id] = ref;
            }}
            eventHandlers={{
              mouseover: () => handleMarkerMouseOver(project._id),
              mouseout: handleMarkerMouseOut,
              click: () => handleMarkerClick(project._id),
            }}
          >
            {/* Tooltip - يظهر عند hover على Desktop */}
            {!isMobile && (
              <Tooltip
                direction="top"
                offset={[0, -20]}
                opacity={1}
                permanent={false}
                interactive={true}
              >
                <ProjectCard project={project} locale={locale} />
              </Tooltip>
            )}
            
            {/* Popup - يظهر عند النقر (للجميع) */}
            <Popup
              closeButton={true}
              autoClose={true}
              closeOnClick={false}
              maxWidth={220}
              minWidth={200}
            >
              <ProjectCard project={project} locale={locale} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Loading indicator overlay */}
      {filteredProjects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#540f6b]/20 rounded-full animate-ping"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#540f6b] rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* Decorative compass rose */}
      {!isMobile && (
        <div className={`absolute top-4 ${locale === 'ar' ? 'right-4' : 'left-4'} bg-white/80 backdrop-blur-sm rounded-full shadow-lg w-16 h-16 pointer-events-none flex items-center justify-center z-[1000]`}>
          <div className="text-[#540f6b] font-bold text-2xl">N</div>
        </div>
      )}
      
      {/* Location label */}
      <div className={`absolute bottom-4 ${locale === 'ar' ? 'left-4' : 'right-4'} bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 pointer-events-none shadow-md z-[1000]`}>
        <p className="text-xs text-[#540f6b] font-cairo font-medium">
          {locale === 'ar' ? 'جدة، المملكة العربية السعودية' : 'Jeddah, Saudi Arabia'}
        </p>
      </div>
    </div>
  );
}
