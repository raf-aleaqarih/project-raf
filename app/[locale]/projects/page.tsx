'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import ClientOnly from '@/components/ClientOnly';
import { Layout } from 'lucide-react';
import axios from 'axios';

interface CategoryProgress {
  completedPercentage: number;
  availablePercentage: number;
  reservedPercentage: number;
  total: number;
  totalUnits: number;
}

interface Category {
  _id: string;
  title: string;
  Image: {
    secure_url: string;
    public_id: string;
  };
  progress: CategoryProgress;
  isWishlisted?: boolean;
}

export default function Projects() {
  const locale = useLocale();
  const t = useTranslations('projects');
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'horizontal'>('horizontal');

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(new Set(JSON.parse(savedWishlist)));
    }
  }, []);

  useEffect(() => {
    const fetchCategoriesAndStatuses = async () => {
      try {
        // 1. Fetch categories
        const apiUrl = locale === 'ar'
          ? 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageAR/?page=1&size=100'
          : 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageEN?page=1&size=100';
        const response = await fetch(apiUrl);
        const data = await response.json();
        const categories: Category[] = Array.isArray(data.categories) ? data.categories : [];

        // 2. Fetch unit statuses from the new endpoint
        let statusesData: { projectId: string; projectName: string; statuses: { status: string; percentage: number; }[]; totalUnits: number; }[] = [];
        try {
          const statusesRes = await fetch('https://dash-board.raf-advanced.sa/api/unit-status');
          const statusesJson = await statusesRes.json();
          if (statusesJson.success && Array.isArray(statusesJson.data)) {
            statusesData = statusesJson.data;
          }
        } catch (error) {
          console.error('Error fetching statuses:', error);
          statusesData = [];
        }

        // 3. Map statuses to categories
        const mappedCategories = categories.map((cat: Category) => {
          const statusObj = statusesData.find((s: { projectId: string; projectName: string; statuses: { status: string; percentage: number; }[]; totalUnits: number; }) => s.projectId === cat._id);
          const progress: CategoryProgress = {
            completedPercentage: 0,
            availablePercentage: 0,
            reservedPercentage: 0,
            total: 0,
            totalUnits: 0
          };
          if (statusObj && Array.isArray(statusObj.statuses)) {
            // استخدام totalUnits من البيانات الجديدة
            progress.totalUnits = statusObj.totalUnits || 0;
            progress.total = progress.totalUnits; // إجمالي الوحدات
            
            for (const st of statusObj.statuses) {
              switch (st.status) {
                case 'sold':
                case 'مباع':
                  progress.completedPercentage = st.percentage;
                  break;
                case 'reserved':
                case 'محجوز':
                  progress.reservedPercentage = st.percentage;
                  break;
                case 'available':
                case 'متاح للبيع':
                  progress.availablePercentage = st.percentage;
                  break;
              }
            }
          }
          return {
            ...cat,
            isWishlisted: wishlist.has(cat._id),
            progress,
          };
        });
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching categories or statuses:', error);
      }
    };
    fetchCategoriesAndStatuses();
  }, [locale, wishlist]);

  const toggleWishlist = async (categoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // If user is authenticated, use the API
        await axios.post(
          "https://raf-backend.vercel.app/auth/wishlist", 
          { category: categoryId },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Update local state after successful API call
        const newWishlist = new Set(wishlist);
        if (wishlist.has(categoryId)) {
          newWishlist.delete(categoryId);
        } else {
          newWishlist.add(categoryId);
        }
        setWishlist(newWishlist);
        
      } catch (error) {
        console.error('Error toggling wishlist item:', error);
      }
    } else {
      // If not authenticated, use local storage
      const newWishlist = new Set(wishlist);
      if (wishlist.has(categoryId)) {
        newWishlist.delete(categoryId);
      } else {
        newWishlist.add(categoryId);
      }
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(Array.from(newWishlist)));
    }
  };
  

  const renderHorizontalView = (category: Category) => {
    const isHovered = hoveredCard === category._id;
    const progress = category.progress || {
      completedPercentage: 0,
      availablePercentage: 0,
      reservedPercentage: 0,
      total: 0,
      totalUnits: 0
    };
    
    return (
      <div 
        key={category._id}
        className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
        onMouseEnter={() => setHoveredCard(category._id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="flex flex-col md:flex-row h-full">
          <div className="relative w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
            <Image
              src={category.Image.secure_url}
              alt={category.title}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 blur-[2px]' : ''
              }`}
            />
            <div className={`absolute inset-0 bg-gradient-to-r from-black/60 to-transparent transition-opacity duration-500 ${
              isHovered ? 'opacity-80' : 'opacity-50'
            }`} />
            
            <button
              onClick={(e) => toggleWishlist(category._id, e)}
              className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-md hover:bg-white transition-all duration-300 transform hover:scale-110 z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-6 h-6 transition-all duration-300 ${
                  wishlist.has(category._id) 
                    ? 'text-red-500 fill-red-500 scale-110' 
                    : 'text-gray-600 hover:text-red-500'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={wishlist.has(category._id) ? "0" : "2"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
          <div className="relative w-full md:w-1/2 p-8 flex flex-col justify-between bg-white">
            <div>
              <h3 className="text-2xl font-bold text-[#540f6b] mb-6 font-cairo text-center">
                {category.title}
              </h3>
              
              <div className="space-y-6">
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-600">{t('sold')}</span>
      <span className="text-sm font-semibold text-[#540f6b]">
        {progress.completedPercentage}%
      </span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#540f6b] transition-all duration-500 ease-out"
        style={{ width: `${progress.completedPercentage}%` }}
      />
    </div>
  </div>
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-600">{t('reserved')}</span>
      <span className="text-sm font-semibold text-yellow-600">
        {progress.reservedPercentage}%
      </span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500 ease-out"
        style={{ width: `${progress.reservedPercentage}%` }}
      />
    </div>
  </div>
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-600">{t('available')}</span>
      <span className="text-sm font-semibold text-[#1D0728]">
        {progress.availablePercentage}%
      </span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#1D0728] transition-all duration-500 ease-out"
        style={{ width: `${progress.availablePercentage}%` }}
      />
    </div>
  </div>
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-600">{t('total')}</span>
      <span className="text-sm font-semibold text-gray-800">
        {progress.total}
      </span>
    </div>
  </div>
</div>

            </div>
            <Link
              href={`/projects/${category._id}`}
              className="mt-8 block"
            >
              <button className="w-full bg-[#540f6b] text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold">
                {t('viewProject')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ClientOnly>
      <main className="min-h-screen bg-[#f8f9fa]">
        <Navbar />
        
        <section className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mt-10 text-[#540f6b] font-cairo mb-4">
                {t('sectionTitle')}
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-[#c48765] to-[#e2b399] mx-auto rounded-full" />
            </div>
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-8">
              <Link
                href="/projects-map"
                className="flex items-center gap-2 text-sm font-medium bg-white rounded-xl px-4 py-2 shadow-md text-[#540f6b] hover:bg-[#540f6b] hover:text-white transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {t('viewOnMap')}
              </Link>
              
              <div className="bg-white rounded-xl shadow-md p-1 inline-flex">
                <button
                  onClick={() => setViewMode('horizontal')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'horizontal' 
                      ? 'bg-[#c48765] text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Layout className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {categories.map((category) => renderHorizontalView(category))}
            </div>
          </div>
        </section>
        <FAQ />
        <Footer />
      </main>
    </ClientOnly>
  );
}
