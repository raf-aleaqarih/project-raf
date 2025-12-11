'use client';

import { ReactNode } from 'react';
import { useLocale } from 'next-intl';

interface ScrollBarProps {
  children: ReactNode;
  className?: string;
}

const ScrollBar = ({ children, className = '' }: ScrollBarProps) => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div
      className={`${className} overflow-y-auto`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#c48765 #EFEDEA',
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #EFEDEA;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c48765;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a36f4c;
        }
      `}</style>
      {children}
    </div>
  );
};

export default ScrollBar;