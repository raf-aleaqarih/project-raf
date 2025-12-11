 "use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from 'next-intl';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Partners from "@/components/Partners";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Eye, Calendar, Mail, X } from "lucide-react";

interface BlogData {
  Image: {
    secure_url: string;
    public_id: string;
  };
  _id: string;
  title: string;
  description: string;
  Keywords: string[];
  lang: string;
  views: number;
  customId: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogResponse {
  message: string;
  blog: BlogData;
}

interface RecentBlogsResponse {
  message: string;
  blogs: BlogData[];
}

export default function BlogPost() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<BlogData | null>(null);
  const params = useParams();
  const t = useTranslations('blog');
  const locale = useLocale();

  const [recentBlogs, setRecentBlogs] = useState<BlogData[]>([]);
  const [recentBlogsLoading, setRecentBlogsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!params?.id) return;
        const response = await fetch(`https://raf-backend.vercel.app/blog/findOne/${params?.id}`);
        const data: BlogResponse = await response.json();
        setBlog(data.blog);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setLoading(false);
      }
    };

    const fetchRecentBlogs = async () => {
      try {
        const response = await fetch('https://raf-backend.vercel.app/blog/getLastThree');
        const data: RecentBlogsResponse = await response.json();
        setRecentBlogs(data.blogs);
        setRecentBlogsLoading(false);
      } catch (error) {
        console.error('Error fetching recent blogs:', error);
        setRecentBlogsLoading(false);
      }
    };

    fetchBlog();
    fetchRecentBlogs();
  }, [params?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://raf-backend.vercel.app/newsletter/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to subscribe');
      }

      // Show success modal
      setShowModal(true);
      // Clear the email input
      setEmail("");
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      // You might want to show an error message to the user here
      alert(error.message || 'Failed to subscribe to newsletter');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#EFEDEA]">
        <Navbar />
        <div className="pt-32 px-4">
          <div className="animate-pulse max-w-7xl mx-auto">
            <div className="h-[400px] bg-gray-200 rounded-2xl mb-8" />
            <div className="h-8 bg-gray-200 w-2/3 mb-4" />
            <div className="h-4 bg-gray-200 w-1/4 mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 w-full" />
              <div className="h-4 bg-gray-200 w-full" />
              <div className="h-4 bg-gray-200 w-3/4" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!blog) return null;

  return (
    <main className="min-h-screen bg-[#EFEDEA]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-[#EFEDEA]/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-lg">
        <Navbar />
      </header>

      {/* Hero Section */}
      <section className="relative h-[400px] bg-[url('/landscape_2.jpg')] bg-cover bg-fixed bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              {t('blogDetails')}
            </h1>
            <div className="w-[224px] h-[3px] bg-[#C48765] mx-auto rounded-full shadow-lg" />
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#c48765] transition-colors">
              {t('home')}
            </Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-[#c48765] transition-colors">
              {t('blog')}
            </Link>
            <span>/</span>
            <span className="text-[#540f6b]">{t('details')}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Article Section */}
            <article className={`w-full lg:w-3/4 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Image Container */}
                <div className="relative aspect-video w-full">
                  <Image 
                    src={blog.Image.secure_url}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 70vw"
                    quality={95}
                  />
                </div>

                <div className="p-6 md:p-8 lg:p-10">
                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {blog.title}
                  </h1>

                  {/* Metadata Section */}
                  <div className={`flex items-center gap-6 text-gray-600 mb-8 ${locale === 'ar' ? 'justify-start' : 'justify-start'} border-b border-gray-100 pb-8`}>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#c48765]" />
                      <span dir="ltr" className="text-sm">
                        {new Date(blog.createdAt).toLocaleDateString(
                          locale === 'ar' ? 'ar-SA' : 'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-[#c48765]" />
                      <span className="text-sm">{blog.views} {t('views')}</span>
                    </span>
                  </div>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                      className="text-gray-700 leading-relaxed space-y-6 text-lg"
                    />
                  </div>

                  {/* Keywords */}
                  {blog.Keywords && blog.Keywords.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('tags')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {blog.Keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-[#c48765]/10 text-[#c48765] rounded-full text-sm font-medium hover:bg-[#c48765]/20 transition-colors cursor-pointer"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Section */}
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('share.title')}</h3>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                        className="p-3 rounded-full bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2]/20 transition-colors"
                        aria-label={t('share.facebook')}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
                      </button>
                      <button 
                        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, '_blank')}
                        className="p-3 rounded-full bg-[#1da1f2]/10 text-[#1da1f2] hover:bg-[#1da1f2]/20 transition-colors"
                        aria-label={t('share.twitter')}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.58v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>
                      </button>
                      <button 
                        onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`, '_blank')}
                        className="p-3 rounded-full bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 transition-colors"
                        aria-label={t('share.linkedin')}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </button>
                      <button 
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(blog.title + '\n' + window.location.href)}`, '_blank')}
                        className="p-3 rounded-full bg-[#25d366]/10 text-[#25d366] hover:bg-[#25d366]/20 transition-colors"
                        aria-label={t('share.whatsapp')}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-1/4 space-y-8">
              {/* Recent Posts */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t('recentPosts')}</h3>
                {recentBlogsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded-lg mb-2" />
                        <div className="h-4 bg-gray-200 w-3/4 rounded" />
                        <div className="h-3 bg-gray-200 w-1/2 rounded mt-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recentBlogs.map((recentBlog) => (
                      <Link
                        key={recentBlog._id}
                        href={`/blogs/${recentBlog._id}`}
                        className="group block"
                      >
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3">
                          <Image
                            src={recentBlog.Image.secure_url}
                            alt={recentBlog.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h4 className="font-medium text-gray-900 group-hover:text-[#c48765] transition-colors line-clamp-2 mb-2">
                          {recentBlog.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span dir="ltr">
                            {new Date(recentBlog.createdAt).toLocaleDateString(
                              locale === 'ar' ? 'ar-SA' : 'en-US',
                              { year: 'numeric', month: 'short', day: 'numeric' }
                            )}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Newsletter Subscription */}
              <div className="relative">
                <div className="sticky top-24 bg-gradient-to-br from-[#540f6b] to-[#1a1116] rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-[#c48765]/20 p-4 rounded-full">
                      <Mail className="w-8 h-8 text-[#c48765]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-4">
                    {t('newsletter')}
                  </h3>
                  <p className="text-gray-300 text-center mb-6 text-sm leading-relaxed">
                    {t('newsletterDesc')}
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('emailPlaceholder')}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#c48765] transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#c48765] text-white rounded-xl hover:bg-[#b37955] transition-all duration-300 font-medium"
                    >
                      {t('subscribe')}
                    </button>
                  </form>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative animate-fade-up">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center space-y-4">
              <div className="bg-[#c48765]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-[#c48765]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {t('thankYou')}
              </h3>
              <p className="text-gray-600">
                {t('subscriptionSuccess')}
              </p>
            </div>
          </div>
        </div>
      )}

      <Partners />
      <Contact />
      <Footer />
    </main>
  );
}