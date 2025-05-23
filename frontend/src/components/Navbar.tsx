'use client'

import Link from "next/link"
import React from "react";
import Button from "./Buttons";

const Navbar = () => {
  const backgroundColor = `rgba(255, 255, 255, 0.1)`; // Set your preferred opacity here (0 to 1)

  return (
    <div className="mx-6 fixed top-0 left-0 right-0 z-10">
      <nav 
        style={{ backgroundColor }} 
        className="text-eb-purple-700 px-5 py-2 flex justify-between items-center max-w-7xl mx-auto"
      >
        <div className="flex items-center space-x-2">
          <img src="/ticket-2.svg" alt="Event Buddy Logo" className=""/>
          <span className="text-2xl font-bold">Event buddy.</span>
        </div>

        {/* Right Side Links */}
        <div className="flex space-x-5">
          <Button className="px-5">
            <Link href="/signin"> Sign In </Link>
          </Button>

          <Button className="px-5">
            <Link href="/signup"> Sign Up </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;