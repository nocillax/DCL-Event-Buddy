// components/PageContainer.tsx
'use client';

import React from 'react';

const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen px-10 bg-[#FAFAFF]">
      <div className="mx-6">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
