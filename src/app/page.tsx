'use client';

import { useState } from 'react';
import { RefreshCw, Info, ThumbsUp } from 'lucide-react';
import HeroSection from './components/rest/HeroSection';
import SearchMethods from './components/rest/SearchMethods';
import ProductAnalysisPopup from './components/rest/ProductAnalysisPopup';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'upload' | 'camera' | 'url' | 'barcode' | null>(null);

  const handleSearchSubmit = (method: typeof searchMethod) => {
    setSearchMethod(method);
    setTimeout(() => setShowPopup(true), 1000);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSearchMethod(null);
  };

  return (
    <>
      <HeroSection />
      <SearchMethods onSubmit={handleSearchSubmit} />

      {/* Features Section */}
      <section className="py-12 bg-green-50 rounded-xl px-6 mb-12">
        <h3 className="text-2xl font-bold text-green-800 mb-8 text-center">Key Features</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<RefreshCw size={24} className="text-green-600" />}
            title="Eco-Comparison"
            description="Compare products side by side based on their Environmental Footprint Scores."
          />
          <FeatureCard
            icon={<Info size={24} className="text-green-600" />}
            title="Green Alerts"
            description="Receive warnings about harmful ingredients or excessive emissions in products."
          />
          <FeatureCard
            icon={<ThumbsUp size={24} className="text-green-600" />}
            title="Better Alternatives"
            description="Find eco-friendly alternatives to products with high environmental impact."
          />
        </div>
      </section>

      <ProductAnalysisPopup isOpen={showPopup} onClose={closePopup}>
        <ProductAnalysisContent />
      </ProductAnalysisPopup>
    </>
  );
}

// FeatureCard component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-green-700 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// ProductAnalysisContent component
function ProductAnalysisContent() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-green-800">Organic Shampoo</h3>
      <p className="text-gray-500">Brand: EcoClean</p>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <div className="md:w-1/3">
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
            <div className="w-32 h-32 bg-green-200 rounded-lg flex items-center justify-center text-green-700 font-semibold">
              Product Image
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mb-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
              Compare Another
            </button>
            <button className="px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded-lg hover:bg-green-200 transition text-sm">
              Better Alternatives
            </button>
          </div>
        </div>

        <div className="md:w-2/3">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-green-700 mb-2">Environmental Impact Score</h4>
            <div className="h-6 w-full bg-gray-200 rounded-full">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>0</span>
              <span className="font-medium text-green-700">75/100 - Good</span>
              <span>100</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-3 rounded-lg">
              <h5 className="font-medium text-green-800 mb-1">Carbon Footprint</h5>
              <p className="text-2xl font-bold text-green-600">Low</p>
              <p className="text-xs text-gray-600">Equivalent to planting 3 trees</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h5 className="font-medium text-green-800 mb-1">Recyclability</h5>
              <p className="text-2xl font-bold text-green-600">High</p>
              <p className="text-xs text-gray-600">94% recyclable packaging</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h5 className="font-medium text-green-800 mb-1">Water Usage</h5>
              <p className="text-2xl font-bold text-green-600">Medium</p>
              <p className="text-xs text-gray-600">40% less than average</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h5 className="font-medium text-green-800 mb-1">Ingredients</h5>
              <p className="text-2xl font-bold text-green-600">Safe</p>
              <p className="text-xs text-gray-600">No harmful chemicals detected</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Green Alert:</span> This product uses palm oil which can contribute to deforestation.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-green-700 mb-2">Disposal Instructions</h4>
            <p className="text-gray-600 mb-2">
              This product is categorized as: <span className="font-medium text-green-800">Recyclable</span>
            </p>
            <button className="text-green-600 hover:text-green-800 text-sm flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Watch recycling instructions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}