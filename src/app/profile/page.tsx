"use client";

import React, { useEffect, useState } from 'react';
import { User, Pencil, Leaf, X, Check, BarChart3, Recycle, Clock } from 'lucide-react';
import Avatar from 'boring-avatars';

const ProfilePage = () => {
  const [avatarSeed, setAvatarSeed] = useState<string>('');
  const [avatarColors, setAvatarColors] = useState<string[]>([]);
  const [editingAvatar, setEditingAvatar] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [bio, setBio] = useState<string>('');

  // Green theme palette options
  const greenPalettes = [
    ['#1E5128', '#4E9F3D', '#D8E9A8', '#191A19', '#1E5128'],
    ['#0D1F22', '#2D6E7E', '#3BACB6', '#82DBD8', '#B3E8E5'],
    ['#4A6C2F', '#73A942', '#92C95C', '#B3E36A', '#D8FFBC'],
    ['#023020', '#146356', '#2E8B57', '#3CB371', '#90EE90'],
    ['#053B06', '#137547', '#216869', '#49A078', '#9CC5A1'],
    ['#1F2F16', '#2E4125', '#556B2F', '#8DB255', '#B2D3A8'],
  ];

  // Mock data for recently scanned products
  const recentProducts = [
    { 
      id: 1, 
      name: 'Organic Milk', 
      brand: 'Green Farms', 
      date: '2025-05-20', 
      ecoScore: 'A', 
      image: '/api/placeholder/80/80' 
    },
    { 
      id: 2, 
      name: 'Vegan Granola', 
      brand: 'EcoGrains', 
      date: '2025-05-19', 
      ecoScore: 'A-', 
      image: '/api/placeholder/80/80' 
    },
    { 
      id: 3, 
      name: 'Biodegradable Dish Soap', 
      brand: 'Clean Earth', 
      date: '2025-05-18', 
      ecoScore: 'B+', 
      image: '/api/placeholder/80/80' 
    },
    { 
      id: 4, 
      name: 'Reusable Water Bottle', 
      brand: 'EcoHydrate', 
      date: '2025-05-15', 
      ecoScore: 'A+', 
      image: '/api/placeholder/80/80' 
    },
  ];

  // Load saved avatar settings and user info
  useEffect(() => {
    let seed = localStorage.getItem('avatarSeed');
    let colors = localStorage.getItem('avatarColors');
    
    if (!seed) {
      // Generate random seed for new users
      seed = Math.random().toString(36).substring(2, 10);
      localStorage.setItem('avatarSeed', seed);
    }
    
    if (!colors) {
      // Assign random green palette for new users
      const randomPalette = greenPalettes[Math.floor(Math.random() * greenPalettes.length)];
      localStorage.setItem('avatarColors', JSON.stringify(randomPalette));
      setAvatarColors(randomPalette);
    } else {
      setAvatarColors(JSON.parse(colors));
    }
    
    setAvatarSeed(seed);
    
    // Load user info if available
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedBio = localStorage.getItem('userBio');
    
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedBio) setBio(savedBio);
  }, []);

  // Save avatar settings
  const handleAvatarChange = (palette: string[]) => {
    setAvatarColors(palette);
    localStorage.setItem('avatarColors', JSON.stringify(palette));
  };
  
  // Generate a new random avatar
  const generateRandomAvatar = () => {
    const newSeed = Math.random().toString(36).substring(2, 10);
    setAvatarSeed(newSeed);
    localStorage.setItem('avatarSeed', newSeed);
  };
  
  // Save profile information
  const saveProfile = () => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userBio', bio);
    
    alert('Profile saved successfully!');
  };

  // Get color for eco score
  const getEcoScoreColor = (score: string) => {
    if (score.startsWith('A')) return 'bg-green-500';
    if (score.startsWith('B')) return 'bg-green-400';
    if (score.startsWith('C')) return 'bg-yellow-500';
    if (score.startsWith('D')) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-green-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-8">
          <Leaf className="text-green-600 mr-2" size={28} />
          <h1 className="text-3xl font-bold text-gray-800">Your EcoScan Profile</h1>
        </div>
        
        {/* Avatar Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Avatar</h2>
            <button 
              onClick={() => setEditingAvatar(!editingAvatar)}
              className="flex items-center text-green-600 hover:text-green-800 transition-colors"
            >
              {editingAvatar ? (
                <>
                  <X size={16} className="mr-1" />
                  <span className="text-sm font-medium">Cancel</span>
                </>
              ) : (
                <>
                  <Pencil size={16} className="mr-1" />
                  <span className="text-sm font-medium">Change</span>
                </>
              )}
            </button>
          </div>
          
          {!editingAvatar ? (
            <div className="flex items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white mr-6 shadow-md border-2 border-green-100">
                {avatarSeed && (
                  <Avatar
                    size={96}
                    name={avatarSeed}
                    variant="beam"
                    colors={avatarColors}
                  />
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-1">
                  {name || 'EcoScan User'}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {email || 'No email provided'}
                </p>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center">
                  <Recycle size={14} className="mr-1" />
                  EcoScanner
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mr-6 shadow-md border-2 border-green-100">
                  {avatarSeed && (
                    <Avatar
                      size={96}
                      name={avatarSeed}
                      variant="beam"
                      colors={avatarColors}
                    />
                  )}
                </div>
                
                <button
                  onClick={generateRandomAvatar}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mb-2 mr-2"
                >
                  Random Avatar
                </button>
                
                <button
                  onClick={() => setEditingAvatar(false)}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors mb-2"
                >
                  <Check size={16} className="inline mr-1" />
                  Done
                </button>
              </div>
              
              <h3 className="font-medium text-gray-700 mb-3">Choose a color palette:</h3>
              <div className="grid grid-cols-3 gap-4">
                {greenPalettes.map((palette, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer border-2 ${
                      JSON.stringify(avatarColors) === JSON.stringify(palette) 
                        ? 'border-green-500' 
                        : 'border-gray-200'
                    } hover:border-green-300 transition-colors`}
                    onClick={() => handleAvatarChange(palette)}
                  >
                    <div className="flex mb-2">
                      {palette.map((color, i) => (
                        <div 
                          key={i}
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color, marginLeft: i > 0 ? '-8px' : '0' }}
                        />
                      ))}
                    </div>
                    <div className="w-full h-16 rounded-md overflow-hidden">
                      <Avatar
                        size={64}
                        name={avatarSeed}
                        variant="beam"
                        colors={palette}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* User Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Tell us about your sustainability journey"
                  ></textarea>
                </div>
                
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <BarChart3 className="text-green-600 mr-2" size={20} />
                    <span className="text-gray-800 font-medium">Products Scanned</span>
                  </div>
                  <span className="text-xl font-bold text-green-700">37</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Leaf className="text-green-600 mr-2" size={20} />
                    <span className="text-gray-800 font-medium">Eco Score Average</span>
                  </div>
                  <span className="px-2 py-1 bg-green-600 text-white font-bold rounded-md">B+</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Recycle className="text-green-600 mr-2" size={20} />
                    <span className="text-gray-800 font-medium">Sustainable Choices</span>
                  </div>
                  <span className="text-xl font-bold text-green-700">28</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Products Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recently Scanned Products</h2>
            <div className="flex items-center text-green-600">
              <Clock size={16} className="mr-1" />
              <span className="text-sm font-medium">Last 30 days</span>
            </div>
          </div>
          
          <div className="overflow-auto">
            <table className="min-w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Brand</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Eco Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{product.brand}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{product.date}</td>
                    <td className="px-4 py-3">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getEcoScoreColor(product.ecoScore)}`}
                      >
                        {product.ecoScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center">
            <a href="/dashboard" className="text-green-600 hover:text-green-800 font-medium text-sm">
              View All Scanned Products →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;