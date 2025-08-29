"use client";

import React, { useEffect, useState } from 'react';
import { Pencil, Leaf, Camera, Award, BarChart3, Trophy } from 'lucide-react'; // only keep what's used

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [name, setName] = useState('Sakshi Sangle');
  const [email, setEmail] = useState('sakshi.rivera@email.com');
  const [bio, setBio] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  // Mock user data
  const userStats = {
    totalScans: 142,
    ecoScore: 'A-',
    sustainableChoices: 89,
    carbonSaved: '2.4 kg',
    streak: 12,
    level: 'Eco Warrior'
  };

  const achievements = [
    { id: 1, name: 'First Scan', icon: '🔍', unlocked: true },
    { id: 2, name: 'Eco Warrior', icon: '🌿', unlocked: true },
    { id: 3, name: 'Carbon Crusher', icon: '💚', unlocked: true },
    { id: 4, name: 'Sustainable Streak', icon: '🔥', unlocked: false }
  ];

  const recentProducts = [
    { 
      id: 1, 
      name: 'Organic Oat Milk', 
      brand: 'Earth\'s Best', 
      date: '2 hours ago', 
      ecoScore: 'A+',
      impact: '+15 eco points',
      category: 'Dairy Alternative'
    },
    { 
      id: 2, 
      name: 'Bamboo Toothbrush', 
      brand: 'EcoBrush', 
      date: '1 day ago', 
      ecoScore: 'A',
      impact: '+12 eco points',
      category: 'Personal Care'
    },
    { 
      id: 3, 
      name: 'Reusable Food Wrap', 
      brand: 'GreenWrap', 
      date: '3 days ago', 
      ecoScore: 'A+',
      impact: '+18 eco points',
      category: 'Kitchen'
    }
  ];

  const getEcoScoreColor = (score) => {
    if (score.startsWith('A')) return 'from-emerald-400 to-green-600';
    if (score.startsWith('B')) return 'from-lime-400 to-green-500';
    if (score.startsWith('C')) return 'from-yellow-400 to-orange-500';
    return 'from-orange-400 to-red-500';
  };

  const StatCard = ({ icon: Icon, label, value, subtitle, gradient }) => (
    <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="text-white" size={24} />
          </div>
          <TrendingUp className="text-green-400" size={16} />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          {subtitle && <p className="text-xs text-green-600 font-medium">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
   
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center text-4xl font-bold text-green-600">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-green-500 rounded-xl shadow-lg hover:bg-green-600 transition-colors">
                  <Camera className="text-white" size={16} />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">{name}</h2>
                  <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                    <span className="text-white text-sm font-medium flex items-center">
                      <Award size={14} className="mr-1" />
                      {userStats.level}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{email}</p>
                <p className="text-gray-700 mb-4 max-w-2xl leading-relaxed">{bio}</p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BarChart3 className="text-green-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Scans</p>
                      <p className="font-bold text-gray-900">{userStats.totalScans}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="text-green-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Eco Score</p>
                      <p className="font-bold text-green-600">{userStats.ecoScore}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Sparkles className="text-green-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Day Streak</p>
                      <p className="font-bold text-orange-500">{userStats.streak}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setEditingProfile(!editingProfile)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Pencil size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-lg p-2 rounded-2xl mb-8 border border-green-100">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Recent Scans', icon: Camera },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'impact', label: 'Impact', icon: Globe }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={BarChart3}
                label="Products Scanned"
                value={userStats.totalScans}
                subtitle="+12 this week"
                gradient="from-green-500 to-emerald-600"
              />
              <StatCard
                icon={Leaf}
                label="Eco Score"
                value={userStats.ecoScore}
                subtitle="Top 15%"
                gradient="from-emerald-500 to-teal-600"
              />
              <StatCard
                icon={Recycle}
                label="Sustainable Choices"
                value={userStats.sustainableChoices}
                subtitle="Great progress!"
                gradient="from-lime-500 to-green-600"
              />
              <StatCard
                icon={TreePine}
                label="Carbon Saved"
                value={userStats.carbonSaved}
                subtitle="This month"
                gradient="from-green-600 to-emerald-700"
              />
            </div>

            {/* Progress Chart Placeholder */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="text-green-600 mr-3" size={24} />
                Your Eco Journey
              </h3>
              <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center border border-green-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                  <p className="text-gray-600">Interactive chart coming soon!</p>
                  <p className="text-sm text-green-600 mt-2">Track your weekly eco improvements</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Camera className="text-green-600 mr-3" size={24} />
              Recent Scans
            </h3>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="group p-6 border border-green-100 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                        <Leaf className="text-green-600" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-gray-600">{product.brand}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm text-gray-500">{product.date}</span>
                          <span className="text-sm font-medium text-green-600">{product.impact}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getEcoScoreColor(product.ecoScore)} text-white font-bold shadow-lg`}>
                        {product.ecoScore}
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-green-600 transition-colors" size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Trophy className="text-green-600 mr-3" size={24} />
              Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}>
                  <div className="text-center">
                    <div className={`text-4xl mb-3 ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <h4 className={`font-bold mb-2 ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h4>
                    <div className={`w-full h-2 rounded-full ${achievement.unlocked ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="text-green-600 mr-3" size={24} />
              Environmental Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <TreePine className="text-white" size={32} />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-2">2.4 kg</h4>
                <p className="text-gray-600">CO₂ Saved This Month</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Globe className="text-white" size={32} />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-2">127 L</h4>
                <p className="text-gray-600">Water Saved</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Recycle className="text-white" size={32} />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-2">15</h4>
                <p className="text-gray-600">Items Recycled</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

// "use client";

// import React, { useEffect, useState } from 'react';
// import { User, Pencil, Leaf, X, Check, BarChart3, Recycle, Clock } from 'lucide-react';
// import Avatar from 'boring-avatars';

// const ProfilePage = () => {
//   const [avatarSeed, setAvatarSeed] = useState<string>('');
//   const [avatarColors, setAvatarColors] = useState<string[]>([]);
//   const [editingAvatar, setEditingAvatar] = useState<boolean>(false);
//   const [name, setName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [bio, setBio] = useState<string>('');

//   // Green theme palette options
//   const greenPalettes = [
//     ['#1E5128', '#4E9F3D', '#D8E9A8', '#191A19', '#1E5128'],
//     ['#0D1F22', '#2D6E7E', '#3BACB6', '#82DBD8', '#B3E8E5'],
//     ['#4A6C2F', '#73A942', '#92C95C', '#B3E36A', '#D8FFBC'],
//     ['#023020', '#146356', '#2E8B57', '#3CB371', '#90EE90'],
//     ['#053B06', '#137547', '#216869', '#49A078', '#9CC5A1'],
//     ['#1F2F16', '#2E4125', '#556B2F', '#8DB255', '#B2D3A8'],
//   ];

//   // Mock data for recently scanned products
//   const recentProducts = [
//     { 
//       id: 1, 
//       name: 'Organic Milk', 
//       brand: 'Green Farms', 
//       date: '2025-05-20', 
//       ecoScore: 'A', 
//       image: '/api/placeholder/80/80' 
//     },
//     { 
//       id: 2, 
//       name: 'Vegan Granola', 
//       brand: 'EcoGrains', 
//       date: '2025-05-19', 
//       ecoScore: 'A-', 
//       image: '/api/placeholder/80/80' 
//     },
//     { 
//       id: 3, 
//       name: 'Biodegradable Dish Soap', 
//       brand: 'Clean Earth', 
//       date: '2025-05-18', 
//       ecoScore: 'B+', 
//       image: '/api/placeholder/80/80' 
//     },
//     { 
//       id: 4, 
//       name: 'Reusable Water Bottle', 
//       brand: 'EcoHydrate', 
//       date: '2025-05-15', 
//       ecoScore: 'A+', 
//       image: '/api/placeholder/80/80' 
//     },
//   ];

//   // Load saved avatar settings and user info
//   useEffect(() => {
//     let seed = localStorage.getItem('avatarSeed');
//     let colors = localStorage.getItem('avatarColors');
    
//     if (!seed) {
//       // Generate random seed for new users
//       seed = Math.random().toString(36).substring(2, 10);
//       localStorage.setItem('avatarSeed', seed);
//     }
    
//     if (!colors) {
//       // Assign random green palette for new users
//       const randomPalette = greenPalettes[Math.floor(Math.random() * greenPalettes.length)];
//       localStorage.setItem('avatarColors', JSON.stringify(randomPalette));
//       setAvatarColors(randomPalette);
//     } else {
//       setAvatarColors(JSON.parse(colors));
//     }
    
//     setAvatarSeed(seed);
    
//     // Load user info if available
//     const savedName = localStorage.getItem('userName');
//     const savedEmail = localStorage.getItem('userEmail');
//     const savedBio = localStorage.getItem('userBio');
    
//     if (savedName) setName(savedName);
//     if (savedEmail) setEmail(savedEmail);
//     if (savedBio) setBio(savedBio);
//   }, []);

//   // Save avatar settings
//   const handleAvatarChange = (palette: string[]) => {
//     setAvatarColors(palette);
//     localStorage.setItem('avatarColors', JSON.stringify(palette));
//   };
  
//   // Generate a new random avatar
//   const generateRandomAvatar = () => {
//     const newSeed = Math.random().toString(36).substring(2, 10);
//     setAvatarSeed(newSeed);
//     localStorage.setItem('avatarSeed', newSeed);
//   };
  
//   // Save profile information
//   const saveProfile = () => {
//     localStorage.setItem('userName', name);
//     localStorage.setItem('userEmail', email);
//     localStorage.setItem('userBio', bio);
    
//     alert('Profile saved successfully!');
//   };

//   // Get color for eco score
//   const getEcoScoreColor = (score: string) => {
//     if (score.startsWith('A')) return 'bg-green-500';
//     if (score.startsWith('B')) return 'bg-green-400';
//     if (score.startsWith('C')) return 'bg-yellow-500';
//     if (score.startsWith('D')) return 'bg-orange-500';
//     return 'bg-red-500';
//   };

//   return (
//     <div className="bg-green-50 min-h-screen">
//       <div className="container mx-auto px-4 py-8 max-w-4xl">
//         <div className="flex items-center mb-8">
//           <Leaf className="text-green-600 mr-2" size={28} />
//           <h1 className="text-3xl font-bold text-gray-800">Your EcoScan Profile</h1>
//         </div>
        
//         {/* Avatar Section */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-500">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">Your Avatar</h2>
//             <button 
//               onClick={() => setEditingAvatar(!editingAvatar)}
//               className="flex items-center text-green-600 hover:text-green-800 transition-colors"
//             >
//               {editingAvatar ? (
//                 <>
//                   <X size={16} className="mr-1" />
//                   <span className="text-sm font-medium">Cancel</span>
//                 </>
//               ) : (
//                 <>
//                   <Pencil size={16} className="mr-1" />
//                   <span className="text-sm font-medium">Change</span>
//                 </>
//               )}
//             </button>
//           </div>
          
//           {!editingAvatar ? (
//             <div className="flex items-center">
//               <div className="w-24 h-24 rounded-full overflow-hidden bg-white mr-6 shadow-md border-2 border-green-100">
//                 {avatarSeed && (
//                   <Avatar
//                     size={96}
//                     name={avatarSeed}
//                     variant="beam"
//                     colors={avatarColors}
//                   />
//                 )}
//               </div>
              
//               <div>
//                 <h3 className="font-medium text-gray-700 mb-1">
//                   {name || 'EcoScan User'}
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-2">
//                   {email || 'No email provided'}
//                 </p>
//                 <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center">
//                   <Recycle size={14} className="mr-1" />
//                   EcoScanner
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div>
//               <div className="flex flex-wrap items-center mb-6">
//                 <div className="w-24 h-24 rounded-full overflow-hidden mr-6 shadow-md border-2 border-green-100">
//                   {avatarSeed && (
//                     <Avatar
//                       size={96}
//                       name={avatarSeed}
//                       variant="beam"
//                       colors={avatarColors}
//                     />
//                   )}
//                 </div>
                
//                 <button
//                   onClick={generateRandomAvatar}
//                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mb-2 mr-2"
//                 >
//                   Random Avatar
//                 </button>
                
//                 <button
//                   onClick={() => setEditingAvatar(false)}
//                   className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors mb-2"
//                 >
//                   <Check size={16} className="inline mr-1" />
//                   Done
//                 </button>
//               </div>
              
//               <h3 className="font-medium text-gray-700 mb-3">Choose a color palette:</h3>
//               <div className="grid grid-cols-3 gap-4">
//                 {greenPalettes.map((palette, index) => (
//                   <div 
//                     key={index}
//                     className={`p-3 rounded-lg cursor-pointer border-2 ${
//                       JSON.stringify(avatarColors) === JSON.stringify(palette) 
//                         ? 'border-green-500' 
//                         : 'border-gray-200'
//                     } hover:border-green-300 transition-colors`}
//                     onClick={() => handleAvatarChange(palette)}
//                   >
//                     <div className="flex mb-2">
//                       {palette.map((color, i) => (
//                         <div 
//                           key={i}
//                           className="w-6 h-6 rounded-full"
//                           style={{ backgroundColor: color, marginLeft: i > 0 ? '-8px' : '0' }}
//                         />
//                       ))}
//                     </div>
//                     <div className="w-full h-16 rounded-md overflow-hidden">
//                       <Avatar
//                         size={64}
//                         name={avatarSeed}
//                         variant="beam"
//                         colors={palette}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* User Information Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
//           <div className="md:col-span-2">
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                     placeholder="Your name"
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                     placeholder="Your email"
//                   />
//                 </div>
                
//                 <div>
//                   <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
//                     Bio
//                   </label>
//                   <textarea
//                     id="bio"
//                     rows={4}
//                     value={bio}
//                     onChange={(e) => setBio(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                     placeholder="Tell us about your sustainability journey"
//                   ></textarea>
//                 </div>
                
//                 <button
//                   onClick={saveProfile}
//                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//                 >
//                   Save Profile
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Statistics</h2>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center">
//                     <BarChart3 className="text-green-600 mr-2" size={20} />
//                     <span className="text-gray-800 font-medium">Products Scanned</span>
//                   </div>
//                   <span className="text-xl font-bold text-green-700">37</span>
//                 </div>
                
//                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center">
//                     <Leaf className="text-green-600 mr-2" size={20} />
//                     <span className="text-gray-800 font-medium">Eco Score Average</span>
//                   </div>
//                   <span className="px-2 py-1 bg-green-600 text-white font-bold rounded-md">B+</span>
//                 </div>
                
//                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center">
//                     <Recycle className="text-green-600 mr-2" size={20} />
//                     <span className="text-gray-800 font-medium">Sustainable Choices</span>
//                   </div>
//                   <span className="text-xl font-bold text-green-700">28</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Recent Products Section */}
//         <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">Recently Scanned Products</h2>
//             <div className="flex items-center text-green-600">
//               <Clock size={16} className="mr-1" />
//               <span className="text-sm font-medium">Last 30 days</span>
//             </div>
//           </div>
          
//           <div className="overflow-auto">
//             <table className="min-w-full">
//               <thead className="bg-green-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Brand</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
//                   <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Eco Score</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {recentProducts.map((product) => (
//                   <tr key={product.id} className="hover:bg-green-50 transition-colors">
//                     <td className="px-4 py-3">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
//                           <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
//                         </div>
//                         <div className="ml-3">
//                           <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{product.brand}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{product.date}</td>
//                     <td className="px-4 py-3">
//                       <span 
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getEcoScoreColor(product.ecoScore)}`}
//                       >
//                         {product.ecoScore}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           <div className="mt-4 text-center">
//             <a href="/dashboard" className="text-green-600 hover:text-green-800 font-medium text-sm">
//               View All Scanned Products →
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;