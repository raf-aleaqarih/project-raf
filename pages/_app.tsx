import React, { useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  // استخدام useEffect لتحميل Google Tag Manager بعد تحميل الصفحة
  useEffect(() => {
    // تحميل Google Tag Manager فقط في جانب العميل
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-MGMC6KSC');
      `;
      document.head.appendChild(script);
      
      // إضافة iframe لـ noscript
      const noscriptIframe = document.createElement('iframe');
      noscriptIframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-MGMC6KSC";
      noscriptIframe.height = "0";
      noscriptIframe.width = "0";
      noscriptIframe.style.display = "none";
      noscriptIframe.style.visibility = "hidden";
      
      const noscript = document.createElement('noscript');
      noscript.appendChild(noscriptIframe);
      
      document.body.prepend(noscript);
    }
  }, []);

  return (
    <>
      <Head>
        <title>RAF Real Estate</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* تمرير الصفحات والمكونات إلى التطبيق */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;