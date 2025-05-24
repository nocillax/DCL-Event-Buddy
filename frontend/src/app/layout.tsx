import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ['latin'] }); 

export const metadata: Metadata = {
  title: "Event Buddy",
  description: "Event Booking System - Frontend",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="max-w-6xl mx-auto p-4 min-h-screen">
        {children}
        </main>
      </body>
    </html>
  );
}
