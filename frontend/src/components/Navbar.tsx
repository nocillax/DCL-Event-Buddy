'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Button from './Buttons';
import { FaSignOutAlt } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

interface JwtPayload {
  name?: string;
  email?: string;
  username?: string;
  role?: string;
  [key: string]: any;
}

const Navbar = () => {


  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/signup';



  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  const syncAuth = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('JWT token not found');
      setUserName(null);
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      setUserName(decoded.name || decoded.username || decoded.email || 'User');
    } catch (err) {
      console.error('Failed to decode JWT:', err);
      setUserName(null);
    }
  };

  useEffect(() => {

    syncAuth(); 

    window.addEventListener('authChange', syncAuth);
    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('authChange', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserName(null);
    window.dispatchEvent(new Event('authChange')); 
    router.push('/signin');
  };

  return (
    <div className="mx-6 fixed top-0 left-0 right-0 z-10">
      <nav className="backdrop-blur bg-white/10 text-eb-purple-700 px-5 py-2 flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
          <img src="/ticket-2.svg" alt="Event Buddy Logo" />
          <span className="text-2xl font-bold">Event buddy.</span>
        </div>
        {!isAuthPage && (
          userName ? (
            <div className="flex items-center space-x-5">
              <span className="text-sm text-eb-purple">Hello, {userName}</span>
              <Button className="px-3 py-1 flex items-center gap-2 text-sm" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex space-x-5">
              <Button className="px-4 py-1 text-sm" onClick={() => router.push('/signin')}>
                Sign In
              </Button>
              <Button className="px-3 py-1 text-sm" onClick={() => router.push('/signup')}>
                Sign Up
              </Button>
            </div>
          )
        )}

      </nav>
    </div>
  );
};

export default Navbar;
