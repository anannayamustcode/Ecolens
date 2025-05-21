import React from 'react';

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-green-500" />
          </div>
          <h1 className="text-2xl font-bold">EcoScan</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Dashboard</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
          </ul>
        </nav>
      </div>
      {children}
    </header>
  );
};

export default Navbar;