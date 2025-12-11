'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import ClientOnly from '@/components/ClientOnly';
import axios from 'axios';

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
  Image: {
    secure_url: string;
    public_id: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  area?: number;
  description?: string;
  location?: string;
  customId?: string;
  progress?: CategoryProgress;
  isWishlisted?: boolean;
}

export default function Wishlist() {
  const locale = useLocale();
  const t = useTranslations('wishlist');
  const [wishlistItems, setWishlistItems] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        setIsLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          // If user is not authenticated, use the local storage wishlist
          const savedWishlist = localStorage.getItem('wishlist');
          const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];
          
          if (wishlistIds.length === 0) {
            setIsLoading(false);
            return;
          }
          
          // Fetch all projects
          const apiUrl = locale === 'ar'
            ? 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageAR/?page=1&size=100'
            : 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageEN?page=1&size=100';
          
          const response = await fetch(apiUrl);
          const data = await response.json();
          
          // Filter only wishlisted items
          const wishlisted = data.categories.filter((cat: Category) =>
            wishlistIds.includes(cat._id)
          );
          
          setWishlistItems(wishlisted);
        } else {
          // If user is authenticated, fetch wishlist from server
          const response = await axios.get("https://raf-backend.vercel.app/auth/wishlist", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.data.message === "Done" && response.data.user.wishlist) {
            // The wishlist items are already complete objects, not just IDs
            const wishlistItems = response.data.user.wishlist;
            
            // Fetch progress data for each item if needed
            const apiUrl = locale === 'ar'
              ? 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageAR/?page=1&size=100'
              : 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageEN?page=1&size=100';
            
            const categoriesResponse = await fetch(apiUrl);
            const categoriesData = await categoriesResponse.json();
            
            // Merge progress data with wishlist items
            const enhancedWishlistItems = wishlistItems.map((item: Category) => {
              const matchingCategory = categoriesData.categories.find(
                (cat: Category) => cat._id === item._id
              );
              
              return {
                ...item,
                progress: matchingCategory?.progress || {
                  completedPercentage: 0,
                  availablePercentage: 100,
                  reservedPercentage: 0,
                  unavailablePercentage: 0,
                  total: 0
                }
              };
            });
            
            setWishlistItems(enhancedWishlistItems);
          }
        }
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlistItems();
  }, [locale]);

  const removeFromWishlist = async (categoryId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // If user is authenticated, remove from server
         axios.patch("https://raf-backend.vercel.app/auth/wishlist", 
          { categoryId },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        // If not authenticated, remove from local storage
        const savedWishlist = localStorage.getItem('wishlist');
        const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];
        const newWishlistIds = wishlistIds.filter((id: string) => id !== categoryId);
        localStorage.setItem('wishlist', JSON.stringify(newWishlistIds));
      }
      
      // Update UI
      setWishlistItems(prev => prev.filter(item => item._id !== categoryId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  return (
    <ClientOnly>
      <main className="min-h-screen  bg-[#f8f9fa]">
        <Navbar />
        
        <section className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mt-10 text-[#540f6b] font-cairo mb-4">
                {t('wishlistTitle')}
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-[#c48765] to-[#e2b399] mx-auto rounded-full" />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#c48765]"></div>
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💝</div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('emptyWishlistTitle')}</h2>
                <p className="text-gray-500 mb-8">{t('emptyWishlistDescription')}</p>
                <Link href="/projects">
                  <button className="bg-gradient-to-r from-[#c48765] to-[#b37654] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold">
                    {t('browseProjects')}
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
                {wishlistItems.map((item) => {
                  const isHovered = hoveredCard === item._id;
                  const progress = item.progress || {
                    completedPercentage: 0,
                    availablePercentage: 100,
                    reservedPercentage: 0,
                    unavailablePercentage: 0,
                    total: item.area || 0
                  };
                  
                  return (
                    <div 
                      key={item._id}
                      className="group relative bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.01] border border-gray-100"
                      onMouseEnter={() => setHoveredCard(item._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="flex flex-col lg:flex-row h-full">
                        <div className="relative w-full lg:w-1/2 h-[300px] lg:h-auto overflow-hidden">
                          <Image
                            src={item.Image.secure_url}
                            alt={item.title}
                            fill
                            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-70' : 'opacity-40'}`} />
                          
                          <button
                            onClick={() => removeFromWishlist(item._id)}
                            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/100 transition-all duration-300 transform hover:scale-110 z-10 group-hover:translate-y-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-red-500 fill-red-500 scale-110"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="relative w-full lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between bg-white">
                          <div>
                            <h3 className="text-2xl font-bold text-[#540f6b] mb-4 font-cairo group-hover:text-[#c48765] transition-colors duration-300">
                              {item.title}
                            </h3>
                            
                            {item.location && (
                              <div className="flex items-center mb-4 text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#c48765]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="group-hover:text-[#c48765] transition-colors duration-300">{item.location}</span>
                              </div>
                            )}
                            
                            {item.area && (
                              <div className="flex items-center mb-6 text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#c48765]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                </svg>
                                <span className="group-hover:text-[#c48765] transition-colors duration-300">{item.area} m²</span>
                              </div>
                            )}
                            
                            {/* Progress Stats */}
                            <div className="space-y-6">
                              {/* Sold Progress */}
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

                              {/* Reserved Progress */}
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

                              {/* Available Progress */}
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-600">{t('available')}</span>
                                  <span className="text-sm font-semibold text-[#540f6b]">
                                    {progress.availablePercentage}%
                                  </span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#540f6b] transition-all duration-500 ease-out"
                                    style={{ width: `${progress.availablePercentage}%` }}
                                  />
                                </div>
                                </div>
                              </div>
                              
                              {/* Unavailable Progress */}
                              <div>
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
                              </div>
                              
                              {/* Total Units/Area */}
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-600">{t('total')}</span>
                                  <span className="text-sm font-semibold text-gray-800">
                                    {progress.total || item.area || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* View Project Button */}
                          <Link
                            href={`/projects/${item._id}`}
                            className="mt-8 block"
                          >
                            <button className="w-full bg-[#540f6b] text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold">
                              {t('viewProject')}
                            </button>
                          </Link>
                        </div>
                      </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </ClientOnly>
  );
}
