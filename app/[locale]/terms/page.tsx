import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { useLocale } from 'next-intl';
import { ChevronRight, FileText, Scale, Shield, BookOpen, FileCheck, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsAndConditions() {
  const t = useTranslations('condition');
  const locale = useLocale();
  
  const termsFeatures = [
    {
      icon: FileText,
      title: t('features.agreement.title'),
      description: t('features.agreement.description')
    },
    {
      icon: Scale,
      title: t('features.compliance.title'),
      description: t('features.compliance.description')
    },
    {
      icon: Shield,
      title: t('features.protection.title'),
      description: t('features.protection.description')
    }
  ];

  const termsRights = [
    {
      icon: BookOpen,
      title: t('rights.intellectual.title'),
      description: t('rights.intellectual.description')
    },
    {
      icon: FileCheck,
      title: t('rights.termination.title'),
      description: t('rights.termination.description')
    },
    {
      icon: AlertTriangle,
      title: t('rights.modification.title'),
      description: t('rights.modification.description')
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

          {/* Terms Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {termsFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Main Content Sections */}
          <div className="space-y-12" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <section className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6 border-b border-gray-100 pb-4">
                {t('sections.intro.title')}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t('sections.intro.content')}
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6 border-b border-gray-100 pb-4">
                {t('sections.usage.title')}
              </h2>
              <p className="text-gray-700 mb-6 text-lg">
                {t('sections.usage.content')}
              </p>
              <ul className="space-y-4">
                {t.raw('sections.items').map((item: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-700 group">
                    <ChevronRight className={`w-5 h-5 text-primary ${locale === 'ar' ? 'rotate-180' : ''} 
                      group-hover:translate-x-1 transition-transform`}/>
                    <span className="text-lg ms-3">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Your Rights Section */}
            <div className="grid md:grid-cols-3 gap-8">
              {termsRights.map((right, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <right.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{right.title}</h3>
                  <p className="text-gray-600">{right.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}