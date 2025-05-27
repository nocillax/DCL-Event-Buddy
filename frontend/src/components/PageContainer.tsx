'use client';

import React from 'react';

const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen px-10 bg-[#FAFAFF]">
      <div className="mx-6 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
