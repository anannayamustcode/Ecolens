"use client";

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import Link from 'next/link';

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const [avatar, setAvatar] = useState<string>('/api/placeholder/40/40');

  // Load the saved avatar when component mounts
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-green-500" />
          </div>
          <h1><Link href="/" className="text-2xl font-bold">EcoScan</Link></h1>
        </div>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li>
              <Link href="/profile" className="flex items-center space-x-2 hover:underline">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-green-600" size={20} />
                  )}
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </header>
  );
};

export default Navbar;