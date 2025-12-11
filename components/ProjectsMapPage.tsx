"use client";

import { useState, useEffect } from "react";
import ProjectsMap from "@/components/ProjectsMap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { MapPin } from "lucide-react";

// Define the project data types based on the actual API responses
interface CategoryProgress {
  completedPercentage: number;
  availablePercentage: number;
  reservedPercentage: number;
  unavailablePercentage: number;
  total: number;
}

interface Category {
  _id: string;
  title: string;
  description?: string;
  Image: {
    secure_url: string;
    public_id: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  location?: string;
  area?: number;
  progress?: CategoryProgress;
  features?: string[];
  type?: string;
}

interface Unit {
  _id: string;
  title: string;
  description?: string;
  images?: {
    secure_url: string;
    public_id: string;
    _id: string;
  }[];
  status?: string;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  parking?: number;
  price?: number;
  location?: string;
  type?: string;
  livingrooms?: number;
  customId?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  maidRoom?: number;
  cameras?: number;
  waterTank?: number;
  guard?: number;
}

// Project structure for the map
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
    total?: number;
  };
  units?: Unit[];
  location?: string;
  rating?: number;
  completionDate?: string;
  developer?: string;
}

// Enhanced Jeddah area coordinates with more realistic project placement and real area names
const JEDDAH_AREAS = [
  { 
    name: "حي الزهراء", 
    lat: 21.6081356, 
    lng: 39.1403372, 
    type: "residential",
    features: ["موقع متميز", "أنظمة منزل ذكية", "حديقة خاصة", "خدمات أمن"],
    area: 120,
    price: 850000
  },
  { 
    name: "حي السلامة", 
    lat: 21.6088056, 
    lng: 39.1511331, 
    type: "residential",
    features: ["تشطيبات فاخرة", "نادي رياضي", "موقف سيارات", "مسبح"],
    area: 95,
    price: 720000
  },
  { 
    name: "حي زهرة النعيم", 
    lat: 21.619518, 
    lng: 39.1537272, 
    type: "residential",
    features: ["موقع استراتيجي", "حديقة مركزية", "مركز تجاري", "مدرسة"],
    area: 150,
    price: 950000
  },
  { 
    name: "حي الروضة", 
    lat: 21.570298, 
    lng: 39.157425, 
    type: "residential",
    features: ["تصميم عصري", "أمن 24/7", "مسبح أولمبي", "صالة رياضية"],
    area: 180,
    price: 1200000
  },
  { 
    name: "حي الروضة", 
    lat: 21.574852, 
    lng: 39.154967, 
    type: "residential",
    features: ["فيلات فاخرة", "حدائق خاصة", "موقف مغطى", "خدمات فندقية"],
    area: 220,
    price: 1500000
  },
  { 
    name: "حي الزهراء", 
    lat: 21.5898037, 
    lng: 39.1402326, 
    type: "residential",
    features: ["موقع بحري", "شاطئ خاص", "مرسى يخوت", "فندق 5 نجوم"],
    area: 300,
    price: 2500000
  },
  { 
    name: "حي الكورنيش", 
    lat: 21.5433, 
    lng: 39.1678, 
    type: "residential",
    features: ["إطلالة بحرية", "كورنيش خاص", "مطاعم فاخرة", "مركز تجاري"],
    area: 140,
    price: 1800000
  },
  { 
    name: "حي الشاطئ", 
    lat: 21.5283, 
    lng: 39.1619, 
    type: "residential",
    features: ["شاطئ خاص", "مرسى", "فيلات فاخرة", "خدمات VIP"],
    area: 250,
    price: 3000000
  },
  { 
    name: "حي النزهة", 
    lat: 21.5854, 
    lng: 39.1723, 
    type: "residential",
    features: ["حدائق واسعة", "ملاعب رياضية", "مركز صحي", "مكتبة"],
    area: 160,
    price: 1100000
  },
  { 
    name: "حي البلد", 
    lat: 21.5433, 
    lng: 39.1678, 
    type: "commercial",
    features: ["موقع تجاري", "موقف كبير", "مخازن", "مكاتب"],
    area: 80,
    price: 800000
  }
];

export default function ProjectsMapPage() {
  const locale = useLocale();
  const t = useTranslations('projects');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = locale === 'ar'
          ? "https://raf-backend.vercel.app/category/getAllCategoryTitleImageAR/?page=1&size=20"
          : "https://raf-backend.vercel.app/category/getAllCategoryTitleImageEN?page=1&size=20";
        
        const categoriesResponse = await axios.get(apiUrl);
        const categoriesData = categoriesResponse.data;
        
        if (Array.isArray(categoriesData.categories)) {
          const projectsData: ProjectData[] = categoriesData.categories.map((category: Category, index: number) => {
            const areaIndex = index % JEDDAH_AREAS.length;
            const area = JEDDAH_AREAS[areaIndex];
            
            // استخراج اسم المنطقة من عنوان المشروع
            const extractLocationFromTitle = (title: string): string => {
              // البحث عن نمط "مشروع XXX - حي YYY" أو "حي YYY - مشروع XXX"
              const patterns = [
                /مشروع\s+\d+\s*-\s*(.+)/,           // "مشروع 029 - حي الروضة"
                /(.+)\s*-\s*مشروع\s+\d+/,           // "حي الروضة - مشروع 029"
                /(.+)/                              // أي نص آخر
              ];
              
              for (const pattern of patterns) {
                const match = title.match(pattern);
                if (match && match[1]) {
                  return match[1].trim();
                }
              }
              
              return title; // إذا لم يتم العثور على نمط، استخدم العنوان كاملاً
            };
            
            // استخراج اسم المنطقة من العنوان
            const extractedLocation = extractLocationFromTitle(category.title);
            
            // Generate realistic progress data
            const progress = category.progress || {
              completedPercentage: Math.floor(Math.random() * 40) + 10,
              availablePercentage: Math.floor(Math.random() * 30) + 20,
              reservedPercentage: Math.floor(Math.random() * 30) + 5,
              unavailablePercentage: Math.floor(Math.random() * 20) + 5,
              total: 100
            };
            
            // Generate realistic area and price data
            const projectArea = category.area || area.area + Math.floor(Math.random() * 50) - 25;
            const projectPrice = area.price + Math.floor(Math.random() * 200000) - 100000;
            
            return {
              _id: category._id,
              title: category.title,
              image: category.Image?.secure_url || "/images/placeholder.jpg",
              type: area.type,
              coordinates: { lat: area.lat, lng: area.lng },
              description: category.description || `مشروع سكني فاخر في ${extractedLocation} يوفر نمط حياة عصري ومتطور مع جميع الخدمات والمرافق الحديثة.`,
              area: projectArea,
              price: projectPrice,
              features: ['وحدات سكنية حديثة', 'تشطيبات فاخرة', 'موقف سيارات'],
              progress: {
                completedPercentage: progress.completedPercentage,
                availablePercentage: progress.availablePercentage,
                reservedPercentage: progress.reservedPercentage,
                total: progress.total
              },
              location: extractedLocation, // استخدام المنطقة المستخرجة من العنوان
              status: progress.completedPercentage > 50 ? "مكتمل" : "قيد الإنشاء",
              rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
              completionDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
              developer: "شركة RAF للتطوير العقاري"
            };
          });
          
          setProjects(projectsData);
        } else {
          setError("Invalid data format received from API");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [locale]);


  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen w-full bg-gray-50">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#540f6b]/20 rounded-full animate-ping"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#540f6b] rounded-full animate-spin"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen w-full bg-gray-50">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️</div>
            <p className="text-gray-600 font-cairo">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-[#540f6b] text-white rounded-lg hover:bg-[#540f6b]/90 transition-colors"
            >
              {locale === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#540f6b] via-[#681034] to-[#540f6b] text-white py-16 md:py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/2.png"
            alt="Real Estate Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#540f6b]/10 via-[#681034]/10 to-[#540f6b]/10"></div>
        </div>
        
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            // backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
          }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <MapPin className="w-8 h-8 text-[#C48765]" />
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-cairo">
              {locale === 'ar' ? 'خريطة المشاريع العقارية' : 'Real Estate Projects Map'}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-cairo">
              {locale === 'ar' 
                ? 'استكشف مشاريعنا العقارية المتميزة في جدة على الخريطة التفاعلية' 
                : 'Explore our premium real estate projects in Jeddah on the interactive map'}
            </p>
            
    
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 overflow-hidden">
          <div className="h-[600px] md:h-[700px] lg:h-[80vh]">
            <ProjectsMap projects={projects} />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 