'use client'

import Link from "next/link"
import React from "react";
import Button from "./Buttons";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/signin');
  }
  const handleSignUp = () => {
    router.push('/signup');
  }
  const handleHome = () => {
    router.push('/');
  }


  return (
    <div className="mx-6 fixed top-0 left-0 right-0 z-10">
      <nav 
        className="backdrop-blur bg-white/10 text-eb-purple-700 px-5 py-2 flex justify-between items-center max-w-5xl mx-auto"
      >
        <div className="flex items-center space-x-2" onClick={handleHome}>
          <img src="/ticket-2.svg" alt="Event Buddy Logo" className=""/>
          <span className="text-2xl font-bold">Event buddy.</span>
        </div>

        <div className="flex space-x-5">
          <Button className="px-4 py-1" onClick={handleSignIn}>
            Sign In
          </Button>

          <Button className="px-3 py-1" onClick={handleSignUp}>
            Sign Up
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;