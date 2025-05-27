'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const hiddenRoutes = ['/signin', '/signup'];
  if (hiddenRoutes.includes(pathname)) return null;
  
  return (
    <footer className="text-eb-purple text-sm font-medium">
      <div className="px-5 py-6 flex justify-between items-center max-w-5xl mx-auto">
        

        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <img src="/ticket-2.svg" alt="Event Buddy Logo" />
          <span className="text-2xl font-bold">Event buddy.</span>
        </div>

        
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/signin" className="hover:underline">Sign in</Link>
          <Link href="/signup" className="hover:underline">Sign up</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>

      
      <div className="flex justify-center">
        <div className="border-t border-gray-300 w-[980px]" />
    </div>


      
      <div className="text-center text-sm text-gray-500 py-4">
        © 2025 Event buddy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
