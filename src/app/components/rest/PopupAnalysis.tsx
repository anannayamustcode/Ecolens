// import React, { useState, useEffect } from 'react';
// import { X, Leaf, Award, BarChart3, Lightbulb, ChevronDown, ChevronUp, Menu, TrendingUp, TrendingDown, Minus, CheckCircle, AlertCircle, Info } from 'lucide-react';

// const PopUpAnalysis = ({ data, onClose }) => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [expandedSections, setExpandedSections] = useState({});
//   const [isMobile, setIsMobile] = useState(false);
//   const [showMobileNav, setShowMobileNav] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     // Prevent body scroll when modal is open
//     document.body.style.overflow = 'hidden';
    
//     return () => {
//       window.removeEventListener('resize', checkMobile);
//       document.body.style.overflow = 'unset';
//     };
//   }, []);

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const getGradeColor = (grade) => {
//     switch (grade) {
//       case 'A+': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
//       case 'A': return 'bg-green-100 text-green-800 border-green-200';
//       case 'B': return 'bg-lime-100 text-lime-800 border-lime-200';
//       case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
//       case 'F': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getScoreIcon = (score) => {
//     if (score >= 80) return <TrendingUp className="text-green-500" size={16} />;
//     if (score >= 60) return <Minus className="text-yellow-500" size={16} />;
//     return <TrendingDown className="text-red-500" size={16} />;
//   };

//   const getTrendIcon = (winner, productKey) => {
//     if (winner === 'tie') return <Minus className="text-gray-500" size={14} />;
//     if (winner.toLowerCase().includes(productKey === 'product1' ? 'nivea' : 'lakme')) {
//       return <CheckCircle className="text-green-500" size={14} />;
//     }
//     return <AlertCircle className="text-orange-500" size={14} />;
//   };

//   const formatNumber = (num, decimals = 2) => {
//     if (num === undefined || num === null) return 'N/A';
//     return typeof num === 'number' ? num.toFixed(decimals) : num;
//   };

//   if (!data) return null;

//   const { frontend_data, comparison_summary, winner_analysis } = data;
//   const { products, summary, detailed_analysis, actionable_insights } = frontend_data;

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: Award },
//     { id: 'detailed', label: 'Analysis', icon: BarChart3 },
//     { id: 'insights', label: 'Insights', icon: Lightbulb }
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
//       <div className={`bg-white rounded-xl sm:rounded-2xl w-full max-w-7xl ${isMobile ? 'min-h-screen' : 'max-h-[95vh]'} overflow-hidden shadow-2xl my-2 sm:my-4`}>
        
//         {/* Enhanced Header */}
//         <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white p-4 sm:p-6 relative">
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 z-10"
//             aria-label="Close analysis"
//           >
//             <X size={isMobile ? 20 : 24} />
//           </button>
          
//           <div className="flex items-center gap-3 mb-4 sm:mb-0">
//             <div className="p-2 bg-white/20 rounded-lg">
//               <Leaf size={isMobile ? 24 : 32} />
//             </div>
//             <div className="flex-1">
//               <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold leading-tight`}>
//                 Sustainability Analysis
//               </h1>
//               <p className="text-green-100 mt-1 text-sm sm:text-base">
//                 Environmental impact comparison
//               </p>
//             </div>
//           </div>

//           {/* Winner Badge - Mobile Optimized */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4 sm:mt-0">
//             <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-center sm:text-left">
//               <div className="text-xs uppercase tracking-wide text-green-200">Winner</div>
//               <div className="font-bold text-sm sm:text-base">{summary.overall_winner.product_name}</div>
//             </div>
//             <div className="bg-emerald-500 text-white px-3 py-2 rounded-lg text-center">
//               <div className="text-xs font-medium">
//                 {summary.overall_winner.environmental_advantage} advantage
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile-First Tab Navigation */}
//         <div className="border-b border-green-100 bg-white sticky top-0 z-20">
//           {isMobile ? (
//             <div className="relative">
//               <button
//                 onClick={() => setShowMobileNav(!showMobileNav)}
//                 className="w-full flex items-center justify-between p-4 text-left hover:bg-green-50"
//               >
//                 <div className="flex items-center gap-2">
//                   {React.createElement(tabs.find(tab => tab.id === activeTab)?.icon || Award, { size: 18 })}
//                   <span className="font-medium">{tabs.find(tab => tab.id === activeTab)?.label}</span>
//                 </div>
//                 <Menu size={18} className={`transition-transform ${showMobileNav ? 'rotate-180' : ''}`} />
//               </button>
              
//               {showMobileNav && (
//                 <div className="absolute top-full left-0 right-0 bg-white border-b border-green-100 shadow-lg">
//                   {tabs.map(tab => {
//                     const Icon = tab.icon;
//                     return (
//                       <button
//                         key={tab.id}
//                         onClick={() => {
//                           setActiveTab(tab.id);
//                           setShowMobileNav(false);
//                         }}
//                         className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
//                           activeTab === tab.id
//                             ? 'bg-green-100 text-green-700 border-l-4 border-green-600'
//                             : 'hover:bg-green-50 text-gray-700'
//                         }`}
//                       >
//                         <Icon size={18} />
//                         {tab.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex overflow-x-auto">
//               {tabs.map(tab => {
//                 const Icon = tab.icon;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all duration-200 ${
//                       activeTab === tab.id
//                         ? 'text-green-700 border-b-2 border-green-700 bg-green-50'
//                         : 'text-gray-600 hover:text-green-600 hover:bg-green-25'
//                     }`}
//                   >
//                     <Icon size={18} />
//                     {tab.label}
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Enhanced Content with Better Spacing */}
//         <div className={`overflow-y-auto ${isMobile ? 'h-[calc(100vh-200px)]' : 'max-h-[65vh]'}`}>
//           {activeTab === 'overview' && (
//             <div className="p-4 sm:p-6 space-y-6">
              
//               {/* Enhanced Winner Summary */}
//               <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-xl p-4 sm:p-6 border border-green-200 shadow-sm">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
//                   <h2 className="text-lg sm:text-xl font-bold text-green-800 flex items-center gap-2">
//                     <Award className="text-green-600" size={isMobile ? 20 : 24} />
//                     Environmental Winner
//                   </h2>
//                   <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
//                     Score: +{formatNumber(summary.overall_winner.score_difference, 1)}
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                   <div className="space-y-2">
//                     <h3 className="font-bold text-lg text-green-700">{summary.overall_winner.product_name}</h3>
//                     <div className="flex items-center gap-2 text-green-600">
//                       <Info size={16} />
//                       <span className="text-sm">Score difference: {formatNumber(summary.overall_winner.score_difference)}</span>
//                     </div>
//                   </div>
//                   <div className="text-sm text-green-700 space-y-2 bg-white/60 rounded-lg p-3">
//                     <p className="flex items-start gap-2">
//                       <span className="font-medium text-green-600">🌍</span>
//                       {winner_analysis.overall_environmental_impact}
//                     </p>
//                     <p className="flex items-start gap-2">
//                       <span className="font-medium text-green-600">♻️</span>
//                       {winner_analysis.carbon_footprint}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Product Cards */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//                 {Object.entries(products).map(([key, product]) => (
//                   <div key={key} className="border border-green-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//                     <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
//                       <h3 className="font-bold text-lg">{product.basic_info.name}</h3>
//                       <p className="text-green-100 text-sm">{product.basic_info.brand} • {product.basic_info.weight}</p>
//                     </div>
                    
//                     <div className="p-4 space-y-4">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm font-medium">Environmental Grade</span>
//                         <div className="flex items-center gap-2">
//                           {getScoreIcon(product.sustainability_scores.overall_environmental_score)}
//                           <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getGradeColor(product.environmental_grade)}`}>
//                             {product.environmental_grade}
//                           </span>
//                         </div>
//                       </div>
                      
//                       <div className="space-y-3">
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">Overall Score</span>
//                           <span className="font-bold text-green-700">
//                             {formatNumber(product.sustainability_scores.overall_environmental_score, 1)}/100
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//                           <div 
//                             className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-700 ease-out"
//                             style={{width: `${product.sustainability_scores.overall_environmental_score}%`}}
//                           />
//                         </div>
//                       </div>
                      
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div className="bg-gray-50 rounded-lg p-3">
//                           <span className="text-gray-600 text-xs uppercase tracking-wide">Carbon Footprint</span>
//                           <p className="font-bold text-gray-800 mt-1">
//                             {formatNumber(product.sustainability_scores.carbon_footprint_kg, 3)} kg CO2e
//                           </p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3">
//                           <span className="text-gray-600 text-xs uppercase tracking-wide">Eco Score</span>
//                           <p className="font-bold text-gray-800 mt-1">
//                             {product.sustainability_scores.eco_score}/100
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Enhanced Quick Metrics */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="font-medium text-green-700">Carbon Impact</h4>
//                     <TrendingUp className="text-green-600" size={20} />
//                   </div>
//                   <p className="text-2xl sm:text-3xl font-bold text-green-800">
//                     {formatNumber(detailed_analysis.carbon_impact.percentage_difference, 1)}%
//                   </p>
//                   <p className="text-sm text-gray-600">Difference</p>
//                 </div>
                
//                 <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="font-medium text-green-700">Recyclability</h4>
//                     <CheckCircle className="text-green-600" size={20} />
//                   </div>
//                   <p className="text-2xl sm:text-3xl font-bold text-green-800">
//                     {comparison_summary.recyclability_comparison.product1_rate}%
//                   </p>
//                   <p className="text-sm text-gray-600">Both Products</p>
//                 </div>
                
//                 <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="font-medium text-green-700">Eco Score</h4>
//                     <Award className="text-green-600" size={20} />
//                   </div>
//                   <p className="text-2xl sm:text-3xl font-bold text-green-800">
//                     {comparison_summary.eco_score_comparison.product1_score}/100
//                   </p>
//                   <p className="text-sm text-gray-600">Both Products</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'detailed' && (
//             <div className="p-4 sm:p-6 space-y-6">
              
//               {/* Enhanced Sustainability Breakdown */}
//               <div className="bg-white rounded-xl border border-green-200 shadow-sm">
//                 <div 
//                   className="flex items-center justify-between p-4 cursor-pointer hover:bg-green-25 transition-colors rounded-t-xl"
//                   onClick={() => toggleSection('breakdown')}
//                 >
//                   <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
//                     <BarChart3 size={20} />
//                     Sustainability Breakdown
//                   </h3>
//                   {expandedSections.breakdown ? 
//                     <ChevronUp className="text-green-600" /> : 
//                     <ChevronDown className="text-green-600" />
//                   }
//                 </div>
                
//                 {expandedSections.breakdown && (
//                   <div className="p-4 border-t border-green-100 space-y-4">
//                     {Object.entries(detailed_analysis.sustainability_breakdown).map(([category, data]) => (
//                       <div key={category} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
//                           <h4 className="font-medium capitalize text-gray-800">
//                             {category.replace('_', ' ')}
//                           </h4>
//                           <div className="flex items-center gap-2">
//                             {getTrendIcon(data.winner, 'product1')}
//                             <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
//                               Winner: {data.winner}
//                             </span>
//                           </div>
//                         </div>
                        
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                           <div className="bg-blue-50 rounded-lg p-3">
//                             <span className="text-gray-600 font-medium">{products.product1.basic_info.name}</span>
//                             <p className="font-bold text-blue-800 mt-1">
//                               {formatNumber(data.product1_emission, 4)} kg CO2e ({formatNumber(data.product1_percentage, 1)}%)
//                             </p>
//                           </div>
//                           <div className="bg-purple-50 rounded-lg p-3">
//                             <span className="text-gray-600 font-medium">{products.product2.basic_info.name}</span>
//                             <p className="font-bold text-purple-800 mt-1">
//                               {formatNumber(data.product2_emission, 4)} kg CO2e ({formatNumber(data.product2_percentage, 1)}%)
//                             </p>
//                           </div>
//                         </div>
                        
//                         {data.improvement_percentage > 0 && (
//                           <div className="mt-3 bg-green-50 rounded-lg p-2">
//                             <div className="flex items-center gap-2 text-sm text-green-700">
//                               <TrendingUp size={14} />
//                               <span className="font-medium">
//                                 Improvement potential: {formatNumber(data.improvement_percentage, 1)}%
//                               </span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Enhanced Green Qualities Comparison */}
//               <div className="bg-white rounded-xl border border-green-200 shadow-sm">
//                 <div 
//                   className="flex items-center justify-between p-4 cursor-pointer hover:bg-green-25 transition-colors rounded-t-xl"
//                   onClick={() => toggleSection('qualities')}
//                 >
//                   <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
//                     <Leaf size={20} />
//                     Green Qualities Comparison
//                   </h3>
//                   {expandedSections.qualities ? 
//                     <ChevronUp className="text-green-600" /> : 
//                     <ChevronDown className="text-green-600" />
//                   }
//                 </div>
                
//                 {expandedSections.qualities && (
//                   <div className="p-4 border-t border-green-100">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                       {Object.entries(detailed_analysis.green_qualities_comparison).map(([quality, data]) => (
//                         <div key={quality} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
//                           <span className="capitalize text-sm font-medium text-gray-700">
//                             {quality.replace('_', ' ')}
//                           </span>
//                           <div className="flex items-center gap-1">
//                             {getTrendIcon(data.winner, 'product1')}
//                             <span className="text-xs font-medium text-gray-600">
//                               {data.winner === 'tie' ? 'Tie' : 'Winner'}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {activeTab === 'insights' && (
//             <div className="p-4 sm:p-6 space-y-6">
              
//               {/* Enhanced Sustainability Tips */}
//               <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-xl p-4 sm:p-6 border border-green-200 shadow-sm">
//                 <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
//                   <Lightbulb className="text-green-600" />
//                   Sustainability Tips
//                 </h3>
//                 <div className="space-y-3">
//                   {actionable_insights.sustainability_tips.map((tip, index) => (
//                     <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
//                       <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
//                       <p className="text-green-700 text-sm sm:text-base leading-relaxed">{tip}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Enhanced Key Metrics */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white rounded-xl border border-green-200 p-4 sm:p-6 shadow-sm">
//                   <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
//                     <TrendingUp size={20} />
//                     Carbon Intensity Comparison
//                   </h4>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
//                       <span className="font-medium text-gray-700">{products.product1.basic_info.name}</span>
//                       <span className="font-bold text-blue-800">
//                         {formatNumber(data.sustainability_metrics.carbon_intensity.product1_per_kg, 3)} kg CO2e/kg
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
//                       <span className="font-medium text-gray-700">{products.product2.basic_info.name}</span>
//                       <span className="font-bold text-purple-800">
//                         {formatNumber(data.sustainability_metrics.carbon_intensity.product2_per_kg, 3)} kg CO2e/kg
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl border border-green-200 p-4 sm:p-6 shadow-sm">
//                   <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
//                     <Award size={20} />
//                     Packaging Efficiency
//                   </h4>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
//                       <span className="font-medium text-gray-700">{products.product1.basic_info.name}</span>
//                       <span className="font-bold text-blue-800">
//                         {formatNumber(data.sustainability_metrics.packaging_efficiency.product1_ratio * 100, 1)}%
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
//                       <span className="font-medium text-gray-700">{products.product2.basic_info.name}</span>
//                       <span className="font-bold text-purple-800">
//                         {formatNumber(data.sustainability_metrics.packaging_efficiency.product2_ratio * 100, 1)}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Final Assessment */}
//               <div className="bg-white rounded-xl border border-green-200 p-4 sm:p-6 shadow-sm">
//                 <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
//                   <Award size={20} />
//                   Final Assessment
//                 </h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
//                     <p className="font-medium text-green-800 text-sm">Total Emissions Difference</p>
//                     <p className="text-2xl sm:text-3xl font-bold text-green-700 my-2">
//                       {formatNumber(comparison_summary.total_emissions_comparison.percentage_difference, 1)}%
//                     </p>
//                     <div className="flex items-center justify-center gap-1">
//                       <TrendingDown size={16} className="text-green-600" />
//                       <span className="text-xs text-green-600">Lower is better</span>
//                     </div>
//                   </div>
                  
//                   <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
//                     <p className="font-medium text-blue-800 text-sm">Environmental Winner</p>
//                     <p className="text-lg font-bold text-blue-700 my-2 leading-tight">
//                       {summary.overall_winner.product_name}
//                     </p>
//                     <div className="flex items-center justify-center gap-1">
//                       <CheckCircle size={16} className="text-blue-600" />
//                       <span className="text-xs text-blue-600">Overall best</span>
//                     </div>
//                   </div>
                  
//                   <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
//                     <p className="font-medium text-purple-800 text-sm">Advantage Level</p>
//                     <p className="text-lg font-bold text-purple-700 my-2 capitalize">
//                       {summary.overall_winner.environmental_advantage}
//                     </p>
//                     <div className="flex items-center justify-center gap-1">
//                       <Info size={16} className="text-purple-600" />
//                       <span className="text-xs text-purple-600">Impact scale</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Enhanced Footer */}
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 p-3 sm:p-4">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-green-700">
//             <div className="flex items-center gap-2">
//               <span className="font-medium">Analysis ID:</span>
//               <span className="font-mono bg-green-100 px-2 py-1 rounded">
//                 {frontend_data.metadata.comparison_id}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="font-medium">Generated:</span>
//               <span>{new Date(frontend_data.metadata.timestamp).toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Enhanced App Component
// const App = () => {
//   const [showPopup, setShowPopup] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const handleShowAnalysis = () => {
//     setIsLoading(true);
//     // Simulate loading time
//     setTimeout(() => {
//       setIsLoading(false);
//       setShowPopup(true);
//     }, 800);
//   };
  
//   const sampleData = {
//     "success": true,
//     "comparison_id": "bf7553ba-3450-4e01-a9ec-c04863571298",
//     "frontend_data": {
//       "metadata": {
//         "comparison_id": "comp_1754973717",
//         "timestamp": "2025-08-12T10:11:57.275972",
//         "model_version": "ProductComparisonLCA_v2.0",
//         "focus": "comprehensive_sustainability_analysis"
//       },
//       "summary": {
//         "overall_winner": {
//           "product_name": "Lakme Moisturizer",
//           "score_difference": 1.342301776361829,
//           "is_significant_difference": false,
//           "environmental_advantage": "minimal"
//         }
//       },
//       "products": {
//         "product1": {
//           "basic_info": {
//             "name": "Nivea Body Lotion",
//             "brand": "Nivea",
//             "category": "Skin Care",
//             "weight": "250ml",
//             "packaging": "Plastic"
//           },
//           "sustainability_scores": {
//             "overall_environmental_score": 55.8,
//             "carbon_footprint_kg": 0.3472,
//             "eco_score": 88,
//             "recyclability_score": 17,
//             "ingredient_sustainability": 0,
//             "biodegradability_score": 38,
//             "renewable_content_score": 32
//           },
//           "green_qualities": {
//             "organic_ingredients": 0,
//             "sustainable_sourcing": 0,
//             "chemical_free": 0,
//             "eco_packaging": 0,
//             "renewable_ingredients": 0,
//             "cruelty_free": 0,
//             "water_conservation": 0,
//             "climate_positive": 0
//           },
//           "environmental_grade": "B"
//         },
//         "product2": {
//           "basic_info": {
//             "name": "Lakme Moisturizer",
//             "brand": "Lakme",
//             "category": "Skin Care",
//             "weight": "250ml",
//             "packaging": "Plastic"
//           },
//           "sustainability_scores": {
//             "overall_environmental_score": 57.2,
//             "carbon_footprint_kg": 0.3987,
//             "eco_score": 88,
//             "recyclability_score": 17,
//             "ingredient_sustainability": 0,
//             "biodegradability_score": 50,
//             "renewable_content_score": 40
//           },
//           "green_qualities": {
//             "organic_ingredients": 0,
//             "sustainable_sourcing": 0,
//             "chemical_free": 0,
//             "eco_packaging": 0,
//             "renewable_ingredients": 0,
//             "cruelty_free": 0,
//             "water_conservation": 0,
//             "climate_positive": 0
//           },
//           "environmental_grade": "B"
//         }
//       },
//       "detailed_analysis": {
//         "carbon_impact": {
//           "winner": "product1",
//           "reduction_potential": 0.051539644727634615,
//           "percentage_difference": 12.9
//         },
//         "sustainability_breakdown": {
//           "ingredients": {
//             "product1_emission": 0.1571680739155,
//             "product2_emission": 0.208466173264,
//             "product1_percentage": 45.26972924037377,
//             "product2_percentage": 52.28371633814339,
//             "winner": "Nivea Body Lotion",
//             "improvement_percentage": 24.607397231557787
//           },
//           "packaging": {
//             "product1_emission": 0.10855079999999998,
//             "product2_emission": 0.10855079999999998,
//             "product1_percentage": 31.26630747837482,
//             "product2_percentage": 27.224748968223256,
//             "winner": "Tie",
//             "improvement_percentage": 0
//           },
//           "transportation": {
//             "product1_emission": 0.022345191,
//             "product2_emission": 0.022345191,
//             "product1_percentage": 6.436171934882228,
//             "product2_percentage": 5.604216787181686,
//             "winner": "Tie",
//             "improvement_percentage": 0
//           },
//           "manufacturing": {
//             "product1_emission": 0.0301,
//             "product2_emission": 0.0301,
//             "product1_percentage": 8.669819615323721,
//             "product2_percentage": 7.549137767234512,
//             "winner": "Tie",
//             "improvement_percentage": 0
//           },
//           "use_phase": {
//             "product1_emission": 0,
//             "product2_emission": 0,
//             "product1_percentage": 0,
//             "product2_percentage": 0,
//             "winner": "Tie",
//             "improvement_percentage": 0
//           },
//           "end_of_life": {
//             "product1_emission": 0.026909999999999996,
//             "product2_emission": 0.026909999999999996,
//             "product1_percentage": 7.750991556423964,
//             "product2_percentage": 6.74907964505916,
//             "winner": "Tie",
//             "improvement_percentage": 0
//           }
//         },
//         "green_qualities_comparison": {
//           "organic_ingredients": {
//             "winner": "tie",
//             "advantage_score": 0,
//             "product1_score": 0,
//             "product2_score": 0
//           },
//           "sustainable_sourcing": {
//             "winner": "tie",
//             "advantage_score": 0,
//             "product1_score": 0,
//             "product2_score": 0
//           },
//           "chemical_free": {
//             "winner": "tie",
//             "advantage_score": 0,
//             "product1_score": 0,
//             "product2_score": 0
//           },
//           "eco_packaging": {
//             "winner": "tie",
//             "advantage_score": 0,
//             "product1_score": 0,
//             "product2_score": 0
//           },
//           "renewable_ingredients": {
//             "winner": "tie",
//             "advantage_score": 0,
//             "product1_score": 0,
//             "product2_score": 0
//           },
//           "cruelty_free": {
//             "winner": "tie",
//             "advantage_score": 0,
//             "product1_score": 0,
//             "product2_score": 0
//           },
//           "water_conservation": {
//             "winner": "tie",
//             "advantage_score": 0,
//             "product1_score": 0,
//             "product2_score": 0
//           },
//           "climate_positive": {
//             "winner": "tie",
//             "advantage_score": 0,
//             "product1_score": 0,
//             "product2_score": 0
//           }
//         }
//       },
//       "actionable_insights": {
//         "key_differentiators": [],
//         "improvement_opportunities": {
//           "Nivea Body Lotion": [],
//           "Lakme Moisturizer": []
//         },
//         "sustainability_tips": [
//           "Choose products with minimal, recyclable packaging",
//           "Look for organic and plant-based ingredients",
//           "Consider concentrated formulas to reduce packaging waste",
//           "Support brands with transparent sustainability practices",
//           "Recycle packaging according to local guidelines"
//         ]
//       }
//     },
//     "comparison_summary": {
//       "total_emissions_comparison": {
//         "product1_emissions": 0.34718138710520446,
//         "product2_emissions": 0.3987210318328391,
//         "difference": 0.051539644727634615,
//         "percentage_difference": 12.926241811403177
//       },
//       "eco_score_comparison": {
//         "product1_score": 88,
//         "product2_score": 88,
//         "difference": 0
//       },
//       "recyclability_comparison": {
//         "product1_recyclable": true,
//         "product2_recyclable": true,
//         "product1_rate": 17,
//         "product2_rate": 17
//       },
//       "overall_winner": {
//         "product_name": "Lakme Moisturizer",
//         "score_difference": 1.342301776361829,
//         "is_significant_difference": false,
//         "environmental_advantage": "minimal"
//       }
//     },
//     "winner_analysis": {
//       "carbon_footprint": "🌍 Nivea Body Lotion has 12.9% lower carbon emissions (0.347 vs 0.399 kg CO2e). More efficient ingredient sourcing reduces emissions by 24.6%",
//       "overall_environmental_impact": "🏆 Lakme Moisturizer is more environmentally sustainable (Environmental Score: 57.2 vs 55.8). Better overall environmental performance"
//     },
//     "improvement_recommendations": {
//       "Nivea Body Lotion": [],
//       "Lakme Moisturizer": []
//     },
//     "sustainability_metrics": {
//       "carbon_intensity": {
//         "product1_per_kg": 1.3887255484208179,
//         "product2_per_kg": 1.5948841273313563
//       },
//       "packaging_efficiency": {
//         "product1_ratio": 0.3126630747837482,
//         "product2_ratio": 0.27224748968223256
//       },
//       "manufacturing_efficiency": {
//         "product1_ratio": 0.08669819615323722,
//         "product2_ratio": 0.07549137767234512
//       },
//       "recyclability_score": {
//         "product1_score": 17,
//         "product2_score": 17
//       }
//     },
//     "message": "Enhanced product comparison completed successfully with comprehensive analysis"
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
//       {!showPopup && !isLoading && (
//         <div className="text-center max-w-md">
//           <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-200">
//             <div className="mb-6">
//               <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Leaf size={40} className="text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 Sustainability Analysis
//               </h2>
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 Get comprehensive environmental impact comparison between products with actionable insights.
//               </p>
//             </div>
            
//             <button
//               onClick={handleShowAnalysis}
//               className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//             >
//               <BarChart3 size={20} />
//               Show Analysis Report
//             </button>
            
//             <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
//               <div>
//                 <div className="text-green-600 font-bold text-lg">98%</div>
//                 <div className="text-gray-500">Accuracy</div>
//               </div>
//               <div>
//                 <div className="text-green-600 font-bold text-lg">2s</div>
//                 <div className="text-gray-500">Analysis</div>
//               </div>
//               <div>
//                 <div className="text-green-600 font-bold text-lg">24/7</div>
//                 <div className="text-gray-500">Available</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {isLoading && (
//         <div className="text-center">
//           <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-200">
//             <div className="flex flex-col items-center gap-4">
//               <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
//               <div>
//                 <h3 className="text-lg font-bold text-gray-800 mb-2">
//                   Analyzing Sustainability Data
//                 </h3>
//                 <p className="text-gray-600 text-sm">
//                   Processing environmental impact metrics...
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {showPopup && !isLoading && (
//         <PopUpAnalysis
//           data={sampleData}
//           onClose={() => setShowPopup(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default App;