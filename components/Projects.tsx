'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {  Layout, List, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface CategoryProgress {
  completedPercentage: number;
  availablePercentage: number;
  reservedPercentage: number;
  unavailablePercentage: number;
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
  isWishlisted?: boolean;
  progress: CategoryProgress;
}

export default function Projects() {
  const locale = useLocale();
  const t = useTranslations('projects');
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'horizontal' | 'compact'>('horizontal');
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'compact' ? 6 : 4;

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
          ? 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageAR/?page=1&size=9'
          : 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageEN?page=1&size=9';

        const response = await fetch(apiUrl);
        const data = await response.json();
        const categories: Category[] = Array.isArray(data.categories) ? data.categories : [];

        // 2. Fetch unit statuses
        let statusesData: { projectId: string; projectName: string; statuses: { status: string; percentage: number; }[]; totalUnits: number; }[] = [];
        try {
          const statusesRes = await fetch('https://dash-board.raf-advanced.sa/api/unit-status');
          const statusesJson = await statusesRes.json();
          if (statusesJson.success && Array.isArray(statusesJson.data)) {
            statusesData = statusesJson.data;
          }
        } catch (error) {
          console.error('Error fetching statuses:', error);
          // إذا فشل جلب النسب، نكمل بدون نسب
          statusesData = [];
        }

        // 3. Map statuses to categories
        const mappedCategories = categories.map((cat: Category) => {
          const statusObj = statusesData.find((s: { projectId: string; projectName: string; statuses: { status: string; percentage: number; }[]; totalUnits: number; }) => s.projectId === cat._id);
          const progress: CategoryProgress = {
            completedPercentage: 0,
            availablePercentage: 0,
            reservedPercentage: 0,
            unavailablePercentage: 0,
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
                case 'unavailable':
                case 'غير متاح':
                  progress.unavailablePercentage = st.percentage;
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
      unavailablePercentage: 0,
      total: 0,
      totalUnits: 0
    };


    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        key={category._id}
        className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform scale-[0.98] hover:scale-[1]"
        onMouseEnter={() => setHoveredCard(category._id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="flex flex-col md:flex-row h-full">
          <div className="relative w-full md:w-1/2 h-[250px] md:h-auto overflow-hidden">
            <Image
              src={category.Image.secure_url}
              alt={category.title}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 blur-[1px]' : ''
              }`}
            />
            <div className={`absolute inset-0 bg-gradient-to-r from-black/70 to-transparent transition-opacity duration-500 ${
              isHovered ? 'opacity-80' : 'opacity-60'
            }`} />
            
            <button
              onClick={(e) => toggleWishlist(category._id, e)}
              className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-md hover:bg-white transition-all duration-300 transform hover:scale-110 z-10"
            >
              <Heart
                className={`w-6 h-6 transition-all duration-300 ${
                  wishlist.has(category._id) 
                    ? 'text-red-500 fill-red-500 scale-110' 
                    : 'text-gray-600 hover:text-red-500'
                }`}
              />
            </button>
          </div>

          <div className="relative w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between bg-white">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#540f6b] mb-4 sm:mb-6 font-cairo">
                {category.title}
              </h3>
              
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{t('sold')}</span>
                    <span className="text-sm font-semibold text-[#540f6b]">
                      {progress.completedPercentage}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
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
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500 ease-out"
                      style={{ width: `${progress.reservedPercentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{t('available')}</span>
                    <span className="text-sm font-semibold text-[#540f6b]">
                      {progress.availablePercentage}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#540f6b] transition-all duration-500 ease-out"
                      style={{ width: `${progress.availablePercentage}%` }}
                    />
                  </div>
                </div>
                {/* <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{t('unavailable')}</span>
                  <span className="text-sm font-semibold text-[#C48765]">
                    {progress.unavailablePercentage || 0}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C48765] transition-all duration-500 ease-out"
                    style={{ width: `${progress.unavailablePercentage || 0}%` }}
                  />
                </div>
              </div> */}
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
              <button className="w-full bg-[#540f6b] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold group">
                {t('viewProject')}
                <ChevronRight className="inline-block ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderCompactView = (category: Category) => {
    const isHovered = hoveredCard === category._id;
    const progress = category.progress || {
      completedPercentage: 0,
      availablePercentage: 0,
      reservedPercentage: 0,
      unavailablePercentage: 0,
      total: 0,
      totalUnits: 0
    };
  
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        key={category._id}
        className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform scale-[0.98] hover:scale-[1]" 
        onMouseEnter={() => setHoveredCard(category._id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="flex items-center p-4">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden">
            <Image
              src={category.Image.secure_url}
              alt={category.title}
              fill
              className={`object-cover transition-all duration-500 ${isHovered ? 'scale-110' : ''}`}
            />
          </div>
  
          <div className="flex-1 ml-4">
            <h3 className="text-lg font-bold text-[#540f6b] mb-2 font-cairo">
              {category.title}
            </h3>
  
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <span className="text-xs text-gray-600">
                  {Math.round(progress.completedPercentage)}% {t('sold')}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                <span className="text-xs text-gray-600">
                  {Math.round(progress.reservedPercentage)}% {t('reserved')}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#540f6b] mr-2" />
                <span className="text-xs text-gray-600">
                  {Math.round(progress.availablePercentage)}% {t('available')}
                </span>
              </div>
            </div>
          </div>
  
          <div className="flex items-center space-x-4">
            <Link
              href={`/projects/${category._id}`}
              className="block"
            >
              <button className="bg-white/95 backdrop-blur-sm text-[#540f6b] px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] font-semibold group">
                {t('viewProject')}
                <ChevronRight className="inline-block ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };
  

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#EFEDEA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl m-auto text-center md:text-4xl font-bold text-[#540f6b] mb-3 ">
              {t('sectionTitle')}
            </h2>
            {/* <div className="w-20 h-1 text-center bg-[#540f6b]"></div> */}
          </div>

          <div className="text-center mt-8 sm:mt-10">
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="bg-white rounded-xl shadow-md p-1 inline-flex">
                <button
                  onClick={() => setViewMode('horizontal')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'horizontal' 
                      ? 'bg-[#c48765] text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={t('horizontalView')}
                >
                  <Layout className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'compact' 
                      ? 'bg-[#c48765] text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={t('compactView')}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={
              viewMode === 'horizontal'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10'
                : 'grid grid-cols-1 gap-4 sm:gap-6'
            }>
              <AnimatePresence>
                {categories
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((category) => (
                    viewMode === 'horizontal' ? renderHorizontalView(category) : 
                    renderCompactView(category)
                  ))}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {categories.length > itemsPerPage && (
              <div className="mt-8 sm:mt-10 flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-[#540f6b] hover:bg-[#c48765] hover:text-white'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-[#540f6b] font-medium">
                  {currentPage} / {Math.ceil(categories.length / itemsPerPage)}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => 
                    Math.min(Math.ceil(categories.length / itemsPerPage), prev + 1)
                  )}
                  disabled={currentPage === Math.ceil(categories.length / itemsPerPage)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    currentPage === Math.ceil(categories.length / itemsPerPage)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-[#540f6b] hover:bg-[#c48765] hover:text-white'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm sm:text-base 
                       text-[#540f6b] font-medium hover:text-[#540f6b]/80 
                       transition-colors duration-300 mt-8 border border-[#540f6b] rounded-full px-6 py-3"
            >
              {t('discover')}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
