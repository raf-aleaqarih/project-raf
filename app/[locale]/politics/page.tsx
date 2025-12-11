// import { useTranslations } from 'next-intl';
// import { Container } from '@/components/ui/container';
// import Footer from '@/components/Footer';
// import Navbar from '@/components/Navbar';

// export default function PrivacyPolicy() {
//   const t = useTranslations('privacy');
  
//   return (
//     <div className="bg-gradient-to-b from-white to-gray-50">
//         <Navbar />
//       <Container className="py-16">
//         <div className="max-w-4xl mx-auto py-16 px-4">
//           <div>
//             <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
//               {t('title')}
//             </h1>
            
//             <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full"/>
            
//             <p className="text-gray-600 mb-12 text-center italic">
//               {t('lastUpdated', { date: new Date().toLocaleDateString() })}
//             </p>
//           </div>

//           <div className="space-y-12">
//             <section className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
//               <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6 border-b border-gray-100 pb-4">
//                 {t('sections.intro.title')}
//               </h2>
//               <p className="text-gray-700 leading-relaxed text-lg">
//                 {t('sections.intro.content')}
//               </p>
//             </section>

//             <section className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
//               <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6 border-b border-gray-100 pb-4">
//                 {t('sections.collection.title')}
//               </h2>
//               <p className="text-gray-700 mb-6 text-lg">
//                 {t('sections.collection.content')}
//               </p>
//               <ul className="space-y-4">
//                 {t.raw('sections.items').map((item: string, index: number) => (
//                   <li key={index} className="flex items-center text-gray-700">
//                     <span className="w-2 h-2 bg-primary rounded-full mr-4"/>
//                     <span className="text-lg">{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </section>
//           </div>
//         </div>
//       </Container>
//       <Footer />
//     </div>
//   );
// }
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { useLocale } from 'next-intl';
import { ChevronRight, Shield, Lock, Eye, UserCheck, Bell, FileCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  const t = useTranslations('privacy');
  const locale = useLocale();
  
  const privacyFeatures = [
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description')
    },
    {
      icon: Lock,
      title: t('features.data.title'),
      description: t('features.data.description')
    },
    {
      icon: Eye,
      title: t('features.transparency.title'),
      description: t('features.transparency.description')
    }
  ];

  // const privacyRights = [
  //   {
  //     icon: UserCheck,
  //     title: t('rights.access.title'),
  //     description: t('rights.access.description')
  //   },
  //   {
  //     icon: Bell,
  //     title: t('rights.control.title'),
  //     description: t('rights.control.description')
  //   },
  //   {
  //     icon: FileCheck,
  //     title: t('rights.delete.title'),
  //     description: t('rights.delete.description')
  //   }
  // ];

  const sections = [
    {
      title: t('sections.privacyPolicy.title'),
      content: t('sections.privacyPolicy.content'),
      items: t.raw('sections.privacyPolicy.items')
    },
    {
      title: t('sections.termsOfUse.title'),
      content: t('sections.termsOfUse.content'),
      items: t.raw('sections.termsOfUse.items')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
      <Container className="py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto py-16 px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {t('lastUpdated', { date: new Date().toLocaleDateString() })}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {t('title')}
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full"/>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          {/* Privacy Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {privacyFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Main Content Sections */}
          <div className="space-y-12" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {sections.map((section, index) => (
              <section key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6 border-b border-gray-100 pb-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {section.content}
                </p>
                <ul className="space-y-4">
                  {section.items.map((item: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-700 group">
                      <ChevronRight className={`w-5 h-5 text-primary ${locale === 'ar' ? 'rotate-180' : ''} 
                        group-hover:translate-x-1 transition-transform`}/>
                      <span className="text-lg ms-3">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
