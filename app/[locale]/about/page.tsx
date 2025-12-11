'use client';
import ClientOnly from '@/components/ClientOnly';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Partners from '@/components/Partners';
import Contact from '@/components/Contact';
import { useTranslations, useLocale } from 'next-intl';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic", "latin"] });

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardHoverVariants = {
  rest: { scale: 1, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
  hover: { 
    scale: 1.03, 
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    transition: { type: "spring", stiffness: 400, damping: 17 }
  }
};

export default function AboutPage() {
  const t = useTranslations('aboutPage');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const containerRef = useRef(null);

  const sectionRefs = {
    hero: useRef(null),
    whoWeAre: useRef(null),
    values: useRef(null),
    vision: useRef(null),
    mission: useRef(null),
    goals: useRef(null),
    products: useRef(null),
    services: useRef(null),
    design: useRef(null)
  };

  const navItems = [
    { id: 'whoWeAre', icon: '👥' },
    { id: 'values', icon: '⭐' },
    { id: 'vision', icon: '🎯' },
    { id: 'mission', icon: '🚀' },
    { id: 'goals', icon: '🎉' },
    { id: 'products', icon: '🏠' },
    { id: 'services', icon: '🛠️' },
    { id: 'design', icon: '🎨' }
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [isNavOpen, setIsNavOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const yOffset = -90; // Account for fixed navbar
    const element = sectionRefs[sectionId].current;
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-20% 0px -20% 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.dataset.section);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        ref.current.dataset.section = key;
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const values = ['integrity', 'responsibility', 'teamwork', 'sustainability'];
  const products = ['luxuryBathrooms', 'qualityDoors', 'modernMajlis', 'luxuryBedrooms', 'marbleDesign', 'modernEntrance'];
  const services = ['development', 'construction', 'design', 'marketing'];
  const goals = ['goal1', 'goal2', 'goal3'];

  return (
    <ClientOnly>
      <main ref={containerRef} className="min-h-screen bg-[#EFEDEA]">
        <header className="bg-[#EFEDEA] top-0 left-0 right-0 shadow-md">
          <Navbar />
        </header>

        {/* Hero Section */}
        <section 
          ref={sectionRefs.hero}
          data-section="hero"
          className="relative mt-[90px] h-[285px] bg-[url('/aboutPage.png')] bg-cover bg-center"
          aria-labelledby="hero-title"
        >
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
              className="text-center"
            >
              <h1 
                id="hero-title"
                className={`text-4xl md:text-5xl font-bold text-white ${isRTL ? 'font-cairo' : 'font-cairo'}`}
              >
                {t('hero.title')}
              </h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <a 
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  aria-label={t('hero.cta')}
                >
                  {t('hero.cta')}
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-50"
          style={{ 
            scaleX: scrollYProgress,
            transformOrigin: isRTL ? "right" : "left" 
          }}
        />

        {/* Section Navigation Menu */}
        <motion.nav 
          className={`fixed ${isRTL ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg py-4 px-2 hidden md:block`}
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          aria-label={t('sections.navigation')}
        >
          <div className="flex flex-col gap-4">
            {navItems.map(({ id, icon }) => (
              <motion.button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeSection === id 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-110'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: activeSection === id ? 1.15 : 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={t(`sections.${id}`)}
                aria-label={t(`sections.${id}`)}
                aria-current={activeSection === id ? 'true' : 'false'}
              >
                <span 
                  role="img" 
                  aria-hidden="true"
                  className="text-lg"
                >
                  {icon}
                </span>
                <span className="sr-only">{t(`sections.${id}`)}</span>
              </motion.button>
            ))}
          </div>

          {/* Mobile Toggle Button */}
          <motion.button
            className="md:hidden fixed ${isRTL ? 'left-4' : 'right-4'} bottom-4 z-[100] w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary backdrop-blur-sm shadow-lg flex items-center justify-center"
            onClick={() => setIsNavOpen(!isNavOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label={t('sections.toggleNavigation')}
          >
            <motion.span
              className="text-2xl text-white"
              animate={{ rotate: isNavOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isNavOpen ? '×' : '☰'}
            </motion.span>
          </motion.button>

          {/* Skip to Content Button */}
          <button
            onClick={() => scrollToSection('hero')}
            className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:mt-2 focus:ml-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg"
          >
            {t('sections.skipToContent')}
          </button>
        </motion.nav>

        <AnimatePresence>
          {isNavOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-[99] p-6 shadow-xl"
              aria-label={t('sections.navigation')}
            >
              <button
                className="absolute top-4 right-4"
                onClick={() => setIsNavOpen(false)}
                aria-label={t('sections.closeNavigation')}
              >
                <span className="text-2xl">×</span>
              </button>
              <div className="flex flex-col gap-4 mt-12">
                {navItems.map(({ id, icon }) => (
                  <motion.button
                    key={id}
                    onClick={() => {
                      scrollToSection(id);
                      setIsNavOpen(false);
                    }}
                    className={`w-full h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeSection === id 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-110'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: activeSection === id ? 1.15 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={t(`sections.${id}`)}
                    aria-label={t(`sections.${id}`)}
                    aria-current={activeSection === id ? 'true' : 'false'}
                  >
                    <span 
                      role="img" 
                      aria-hidden="true"
                      className="text-lg"
                    >
                      {icon}
                    </span>
                    <span className="sr-only">{t(`sections.${id}`)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Who We Are Section */}
        <section 
          ref={sectionRefs.whoWeAre}
          data-section="whoWeAre"
          className="py-20 px-4 md:px-0"
        >
          <div className="container mx-auto">
            <div className={`flex flex-col ${isRTL ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 mb-24`}>
              <div className="w-full md:w-1/2">
                <Image
                  src="/aboutPage.png"
                  alt={t('whoWeAre.title')}
                  width={657}
                  height={430}
                  className="rounded-[30px] transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className={`w-full md:w-1/2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                  <h2 className={`text-[30px] md:text-[35px] font-bold text-[#540f6b] mb-2 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                    {t('whoWeAre.title')}
                  </h2>
                  <div className="w-[115px] h-[4px] bg-[#C48765] mb-6"></div>
                </div>
                <p className={`text-[22px] md:text-[25px] leading-[35px] md:leading-[40px] text-gray-700 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                  {t('whoWeAre.description')}
                </p>
              </div>
            </div>

            {/* Values Section */}
            <div 
              ref={sectionRefs.values}
              data-section="values"
              className="mb-24"
            >
              <div className={`text-center mb-12`}>
                <h2 className={`text-[30px] md:text-[35px] font-bold text-[#540f6b] mb-2 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                  {t('values.title')}
                </h2>
                <div className="w-[83px] h-[4px] bg-[#C48765] mx-auto"></div>
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {values.map((value) => (
                  <motion.div
                    key={value}
                    initial="hidden"
                    animate="visible"
                    variants={scaleInVariants}
                    className="bg-white rounded-[20px] p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <h3 className={`text-[24px] font-bold text-[#540f6b] mb-4 ${isRTL ? 'font-cairo text-right' : 'font-cairo'}`}>
                      {t(`values.${value}.title`)}
                    </h3>
                    <p className={`text-[18px] text-gray-700 ${isRTL ? 'font-cairo text-right' : 'font-cairo'}`}>
                      {t(`values.${value}.description`)}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Vision & Goals Section */}
            <div 
              ref={sectionRefs.vision}
              data-section="vision"
              className={`flex flex-col ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 mb-24`}
            >
              <div className="w-full md:w-1/2">
                <Image
                  src="/landscape_2.jpg"
                  alt={t('vision.title')}
                  width={666}
                  height={430}
                  className="rounded-[30px] transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className={`w-full md:w-1/2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                  <h2 className={`text-[30px] md:text-[35px] font-bold text-[#540f6b] mb-2 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                    {t('vision.title')}
                  </h2>
                  <div className="w-[83px] h-[4px] bg-[#C48765] mb-6"></div>
                </div>
                <p className={`text-[22px] md:text-[25px] leading-[35px] md:leading-[40px] text-gray-700 mb-8 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                  {t('vision.description')}
                </p>
                <h3 
                  ref={sectionRefs.goals}
                  data-section="goals"
                  className={`text-[24px] font-bold text-[#540f6b] mb-4 ${isRTL ? 'font-cairo' : 'font-cairo'}`}
                >
                  {t('goals.title')}
                </h3>
                <ul className={`list-disc ${isRTL ? 'mr-6' : 'ml-6'} space-y-4`}>
                  {goals.map((goal) => (
                    <li key={goal} className={`text-[18px] list-none text-gray-700 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                      {t(`goals.${goal}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mission Section */}
            <div 
              ref={sectionRefs.mission}
              data-section="mission"
              className={`flex flex-col ${isRTL ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 mb-24`}
            >
              <div className="w-full md:w-1/2">
                <Image
                  src="/desk.jpg"
                  alt={t('mission.title')}
                  width={667}
                  height={430}
                  className="rounded-[30px] transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className={`w-full md:w-1/2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                  <h2 className={`text-[30px] md:text-[35px] font-bold text-[#540f6b] mb-2 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                    {t('mission.title')}
                  </h2>
                  <div className="w-[112px] h-[4px] bg-[#C48765] mb-6"></div>
                </div>
                <p className={`text-[22px] md:text-[25px] leading-[35px] md:leading-[40px] text-gray-700 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                  {t('mission.description')}
                </p>
              </div>
            </div>

            {/* Products Section */}
            <div 
              ref={sectionRefs.products}
              data-section="products"
              className="mb-24"
            >
              <div className={`text-center mb-12`}>
                <h2 className={`text-[30px] md:text-[35px] font-bold text-[#540f6b] mb-2 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                  {t('products.title')}
                </h2>
                <div className="w-[83px] h-[4px] bg-[#C48765] mx-auto"></div>
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {products.map((product) => (
                  <motion.div
                    key={product}
                    initial="hidden"
                    animate="visible"
                    variants={scaleInVariants}
                    className="bg-white rounded-[20px] p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <h3 className={`text-[24px] font-bold text-[#540f6b] mb-4 ${isRTL ? 'font-cairo text-right' : 'font-cairo'}`}>
                      {t(`products.items.${product}.title`)}
                    </h3>
                    <p className={`text-[18px] text-gray-700 ${isRTL ? 'font-cairo text-right' : 'font-cairo'}`}>
                      {t(`products.items.${product}.description`)}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Services Section */}
            <div 
              ref={sectionRefs.services}
              data-section="services"
              className="mb-24"
            >
              <div className={`text-center mb-12`}>
                <h2 className={`text-[30px] md:text-[35px] font-bold text-[#540f6b] mb-2 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                  {t('services.title')}
                </h2>
                <div className="w-[83px] h-[4px] bg-[#C48765] mx-auto"></div>
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {services.map((service) => (
                  <motion.div
                    key={service}
                    initial="hidden"
                    animate="visible"
                    variants={scaleInVariants}
                    className="bg-white rounded-[20px] p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <h3 className={`text-[24px] font-bold text-[#540f6b] mb-4 ${isRTL ? 'font-cairo text-right' : 'font-cairo'}`}>
                      {t(`services.items.${service}.title`)}
                    </h3>
                    <p className={`text-[18px] text-gray-700 ${isRTL ? 'font-cairo text-right' : 'font-cairo'}`}>
                      {t(`services.items.${service}.description`)}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Architectural Design Section */}
            <div 
              ref={sectionRefs.design}
              data-section="design"
              className={`flex flex-col ${isRTL ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10`}
            >
              <div className="w-full md:w-1/2">
                <Image
                  src="/hero_2.jpg"
                  alt={t('design.title')}
                  width={667}
                  height={430}
                  className="rounded-[30px] transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className={`w-full md:w-1/2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                  <h2 className={`text-[30px] md:text-[35px] font-bold text-[#540f6b] mb-2 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                    {t('design.title')}
                  </h2>
                  <div className="w-[112px] h-[4px] bg-[#C48765] mb-6"></div>
                </div>
                <p className={`text-[22px] md:text-[25px] leading-[35px] md:leading-[40px] text-gray-700 ${isRTL ? 'font-cairo' : 'font-cairo'}`}>
                  {t('design.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-20">
          <div className="container mx-auto">
            <Partners />
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <Contact />
          </div>
        </section>

        <Footer />
      </main>
    </ClientOnly>
  );
}