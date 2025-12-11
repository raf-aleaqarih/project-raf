
import FloatingButtons from '@/components/FloatingButtons';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import ScrollBar from '@/components/ui/ScrollBar';
import GlobalScrollbar from '@/components/ui/GlobalScrollbar';


export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
 return {
  htmlAttributes: {
   lang: locale,
   dir: locale === 'ar' ? 'rtl' : 'ltr'
  }
 };
}


export default async function LocaleLayout({
 children,
 params: { locale },
}: {
 children: ReactNode;
 params: { locale: string };
}) {
 let messages;


 try {
  // تحميل الرسائل (messages) من ملف JSON
  messages = (await import(`../../messages/${locale}.json`)).default;
 } catch (error) {
  // إذا لم يتم العثور على الرسائل، قم بإرجاع صفحة 404
  notFound();
 }


 return (
  <NextIntlClientProvider locale={locale} messages={messages}>
   <AuthProvider>
    {children}
    <FloatingButtons />
    <Toaster
     position="top-center"
     toastOptions={{
      duration: 2000,
      style: {
       background: '#363636',
       color: '#fff',
       borderRadius: '10px',
      },
      success: {
       iconTheme: {
        primary: '#c48765',
        secondary: '#fff',
       },
      },
     }}
    />
    <GlobalScrollbar children={undefined} />
   </AuthProvider>
  </NextIntlClientProvider>
 );
}