'use client'
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Eye, Clock, ArrowRight } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  content: string;
  Image: {
    secure_url: string;
    public_id: string;
  };
  createdAt: string;
  customId: string;
  views: number;
  Keywords: string[];
  description: string;
}

interface BlogResponse {
  message: string;
  blogs: Blog[];
  totalCount: number;
}

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('blog');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const apiUrl = isRTL
          ? `https://raf-backend.vercel.app/blog/ar?page=${1}&size=${6}`
          : `https://raf-backend.vercel.app/blog/en?page=${1}&size=${6}`;

        const response = await fetch(apiUrl);
        const data: BlogResponse = await response.json();
        setBlogs(data.blogs.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [locale, isRTL]);

  if (loading) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#c48765]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 " dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-[#540f6b] mb-4">
            {t('title')}
          </h2>
          <div className="w-32 h-1 bg-[#c48765] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="group bg-white rounded-xl overflow-hidden border border-[#E9ECEF] hover:border-[#c48765] transition-all duration-300"
            >
              <div className="relative aspect-video">
                <Image
                  src={blog.Image.secure_url}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full">
                  <Eye className="w-4 h-4 text-[#c48765]" />
                  <span className="text-sm font-medium text-[#540f6b]">
                    {blog.views || 0}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-[#6C757D]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(blog.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
                  </div>
                  <div className="flex gap-2">
                    {blog.Keywords?.slice(0, 2).map((keyword, index) => (
                      <span key={index} className="bg-[#F8F9FA] px-3 py-1 rounded-full">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className={`text-xl font-bold text-[#540f6b] ${isRTL ? 'text-right' : 'text-left'} line-clamp-2 min-h-[3.5rem]`}>
                  {blog.title}
                </h3>

                <p className={`text-[#6C757D] ${isRTL ? 'text-right' : 'text-left'} leading-relaxed line-clamp-3 min-h-[4.5rem]`}>
                  {blog.description}
                </p>

                <Link
                  href={`/blogs/${blog._id}`}
                  className="group flex items-center justify-center gap-2 w-full py-3 text-center text-[#c48765] bg-[#F8F9FA] rounded-lg hover:bg-[#c48765] hover:text-white transition-all duration-300"
                >
                  <span>{t('readMore')}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-12 py-4 text-lg bg-[#c48765] text-white rounded-lg hover:bg-[#C48765] transition-colors duration-300"
          >
            {t('viewAll')}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}