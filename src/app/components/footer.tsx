import React from 'react';

const Footer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <footer className="bg-green-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-green-500" />
              </div>
              <span className="font-bold text-xl">EcoScan</span>
            </div>
            <p className="text-green-200 mt-2">Making sustainable choices easier.</p>
          </div>
          
          <div className="flex space-x-8">
            <div>
              <h5 className="font-semibold mb-3">Features</h5>
              <ul className="space-y-2 text-green-200">
                <li><a href="#" className="hover:text-white">Eco-Comparison</a></li>
                <li><a href="#" className="hover:text-white">Green Scorecard</a></li>
                <li><a href="#" className="hover:text-white">Product Finder</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Company</h5>
              <ul className="space-y-2 text-green-200">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-200 text-sm">
          <p>© {new Date().getFullYear()} EcoScan. All rights reserved.</p>
        </div>
      </div>
      {children}
    </footer>
  );
};

export default Footer;