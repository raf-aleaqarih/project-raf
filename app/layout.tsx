import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://raf-advanced.sa'),
  title: {
    default: 'راف العقاريه | تطوير عقاري متميز في المملكة العربية السعودية',
    template: '%s | راف العقاريه'
  },
  description: 'راف العقاريه - شركة رائدة في التطوير العقاري في المملكة العربية السعودية، نقدم مشاريع سكنية فاخرة وشقق عصرية وعقارات متميزة في مواقع استراتيجية',
  keywords: [
    'عقارات السعودية',
    'عقارات فاخرة الرياض',
    'مشاريع سكنية',
    'شقق فاخرة السعودية',
    'تطوير عقاري الرياض',
    'منازل عصرية السعودية',
    'استثمار عقاري',
    'عقارات راف العقاريه',
    'عقارات فاخرة',
    'إسكان متميز الرياض',
    'فلل فاخرة الرياض',
    'شقق للبيع الرياض',
    'مجمعات سكنية',
    'تمويل عقاري',
    'مكاتب تجارية الرياض',
    'أراضي للبيع السعودية',
    'تشطيبات فاخرة',
    'مقاولات عامة',
    'تصميم داخلي',
    'استشارات عقارية',
    'وحدات سكنية جاهزة',
    'عقارات تجارية',
    'مشاريع تطوير عقاري',
    'استثمارات عقارية آمنة',
    'تملك حر السعودية',
    'عقارات جدة',
    'شقق فاخرة جدة',
    'فلل للبيع جدة',
    'مشاريع سكنية جدة',
    'استثمار عقاري جدة',
    'تطوير عقاري جدة',
    'مجمعات سكنية جدة',
    'أراضي للبيع جدة',
    'عقارات تجارية جدة',
    'مكاتب للإيجار جدة'
  ],
  authors: [{ name: 'راف العقاريه' }],
  creator: 'راف العقاريه',
  publisher: 'راف العقاريه',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: 'راف العقاريه | تطوير عقاري متميز',
    description: 'اكتشف المشاريع السكنية الفاخرة والعقارات المتميزة في المملكة العربية السعودية مع راف العقاريه',
    url: 'https://raf-advanced.sa',
    siteName: 'راف العقاريه',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'عقارات راف العقاريه',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'راف العقاريه | تطوير عقاري متميز',
    description: 'مشاريع سكنية فاخرة وعقارات متميزة في المملكة العربية السعودية',
    images: ['/twitter-image.jpg'],
    creator: '@raf_advanced',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  return (
    <html 
      suppressHydrationWarning 
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      lang={locale}
      className={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/logo1.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#540f6b" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MGMC6KSC');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MGMC6KSC"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }}
        />
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}