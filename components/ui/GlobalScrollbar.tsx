'use client';

import { ReactNode } from 'react';

interface GlobalScrollbarProps {
  children: ReactNode;
}

const GlobalScrollbar = ({ children }: GlobalScrollbarProps) => {
  return (
    <>
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
        html {
          overflow-y: overlay;
          scrollbar-width: thin;
          scrollbar-color: #c48765 #EFEDEA;
        }
      `}</style>
      {children}
    </>
  );
};

export default GlobalScrollbar;