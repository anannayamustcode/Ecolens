"use client";

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import Link from 'next/link';

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const [avatar, setAvatar] = useState<string | null>(null);

  // Load the saved avatar when component mounts
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    } else {
      // fallback to a simple identicon or leave as null to show User icon
      setAvatar(null);
    }
  }, []);

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Logo */}
          <div className="w-8 h-8">
            <img
              src="/assets/a.png"
              alt="EcoLens Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1>
            <Link href="/" className="text-2xl font-bold">
              EcoLens
            </Link>
          </h1>
        </div>

        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/profile" className="flex items-center space-x-2 hover:underline">
                <div className="w-9 h-9 rounded-full border-2 border-green-400 shadow-md overflow-hidden transition-transform hover:scale-105 bg-white">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-full h-full object-cover transition-opacity duration-300"
                      onError={(e) => {
                        // fallback to null if avatar is broken — triggers User icon
                        setAvatar(null);
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-green-100 text-green-600">
                      <User size={20} />
                    </div>
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
