'use client';
import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { 
  AlertTriangle, 
  ThumbsUp, 
  Leaf, 
  Droplet, 
  Recycle, 
  ChevronRight,
  AlertCircle,
  ArrowRight,
  Award,
  Loader2
} from 'lucide-react';

interface ProductData {
  name: string;
  brand: string;
  efsScore: number;
  carbonFootprint: {
    score: string;
    equivalent: string;
    value: number;
  };
  recyclability: {
    score: string;
    percentage: number;
    value: number;
  };
  waterUsage: {
    score: string;
    description: string;
    value: number;
  };
  ingredients: {
    score: string;
    description: string;
    value: number;
  };
  alerts: {
    type: string;
    message: string;
  }[];
  disposal: string;
  alternatives: {
    name: string;
    brand: string;
    efsScore: number;
    improvement: number;
    benefits: string;
  }[];
  categoryBreakdown: {
    name: string;
    value: number;
  }[];
  impactComparison: {
    name: string;
    water: number;
    carbon: number;
    waste: number;
  }[];
}

interface ApiResponse {
  front?: string;
  back?: string;
  folder?: string;
  ecoScore?: any;
  labelData?: any;
  alternatives?: any;
}

export default function DashboardPage() {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get data from URL query parameters
        const params = new URLSearchParams(window.location.search);
        const frontImage = params.get('front');
        const backImage = params.get('back');
        const folder = params.get('folder');
        const ecoScore = params.get('ecoScore') ? JSON.parse(decodeURIComponent(params.get('ecoScore')!)) : null;
        const labelData = params.get('labelData') ? JSON.parse(decodeURIComponent(params.get('labelData')!)) : null;
        const alternatives = params.get('alternatives') ? JSON.parse(decodeURIComponent(params.get('alternatives')!)) : null;

        // Transform API data into dashboard format
        const transformedData: ProductData = {
          name: labelData?.product_name || "Unknown Product",
          brand: labelData?.brand || "Unknown Brand",
          efsScore: ecoScore?.lca_results?.eco_score || 0,
          carbonFootprint: {
            score: ecoScore?.lca_results?.total_emissions_kg_co2e < 0.5 ? "Low" : 
                  ecoScore?.lca_results?.total_emissions_kg_co2e < 1.0 ? "Medium" : "High",
            equivalent: `Equivalent to ${(ecoScore?.lca_results?.total_emissions_kg_co2e * 100).toFixed(0)} km by car`,
            value: 100 - Math.min(ecoScore?.lca_results?.total_emissions_kg_co2e * 100, 100)
          },
          recyclability: {
            score: ecoScore?.recyclability_analysis?.overall_recyclable ? "High" : "Low",
            percentage: ecoScore?.recyclability_analysis?.effective_recycling_rate 
                      ? Math.round(ecoScore.recyclability_analysis.effective_recycling_rate * 100) 
                      : 0,
            value: ecoScore?.recyclability_analysis?.effective_recycling_rate 
                  ? Math.round(ecoScore.recyclability_analysis.effective_recycling_rate * 100) 
                  : 0
          },
          waterUsage: {
            score: "Medium", // This would come from water usage data in a real API
            description: "40% less than average",
            value: 60
          },
          ingredients: {
            score: labelData?.ingredients ? "Safe" : "Unknown",
            description: labelData?.ingredients 
                        ? `${labelData.ingredients.split(',').length} ingredients detected` 
                        : "No ingredient data",
            value: 85 // This would be calculated based on ingredient analysis
          },
          alerts: [
            {
              type: "warning",
              message: "This product contains ingredients that may be harmful to aquatic life"
            }
          ],
          disposal: ecoScore?.recyclability_analysis?.packaging_recyclable ? "Recyclable" : "Not Recyclable",
          alternatives: alternatives?.alternatives?.map((alt: any) => ({
            name: alt.product_name || "Alternative Product",
            brand: alt.brand || "Alternative Brand",
            efsScore: alt.eco_score || 0,
            improvement: alt.eco_score - (ecoScore?.lca_results?.eco_score || 0),
            benefits: "More sustainable packaging and ingredients"
          })) || [],
          categoryBreakdown: [
            { name: 'Packaging', value: ecoScore?.stage_percentages?.packaging || 0 },
            { name: 'Ingredients', value: ecoScore?.stage_percentages?.ingredients || 0 },
            { name: 'Manufacturing', value: ecoScore?.stage_percentages?.manufacturing || 0 },
            { name: 'Transportation', value: ecoScore?.stage_percentages?.transportation || 0 }
          ],
          impactComparison: [
            { 
              name: 'Average Product', 
              water: 100, 
              carbon: 100, 
              waste: 100 
            },
            { 
              name: 'This Product', 
              water: 60, 
              carbon: ecoScore?.lca_results?.total_emissions_kg_co2e 
                    ? Math.round(ecoScore.lca_results.total_emissions_kg_co2e * 100) 
                    : 100,
              waste: 100 - (ecoScore?.recyclability_analysis?.effective_recycling_rate 
                    ? Math.round(ecoScore.recyclability_analysis.effective_recycling_rate * 100) 
                    : 0)
            },
            { 
              name: 'Best Alternative', 
              water: 50, 
              carbon: ecoScore?.lca_results?.total_emissions_kg_co2e 
                    ? Math.round(ecoScore.lca_results.total_emissions_kg_co2e * 80) 
                    : 80,
              waste: 20 
            }
          ]
        };

        setProductData(transformedData);
      } catch (err) {
        console.error("Error processing data:", err);
        setError("Failed to load product data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Colors for the EFS score meter
  const getEfsScoreColor = (score: number) => {
    if (score < 30) return 'bg-red-500';
    if (score < 50) return 'bg-orange-500';
    if (score < 70) return 'bg-yellow-500';
    if (score < 90) return 'bg-green-500';
    return 'bg-green-600';
  };

  const getEfsScoreText = (score: number) => {
    if (score < 30) return 'Poor';
    if (score < 50) return 'Fair';
    if (score < 70) return 'Good';
    if (score < 90) return 'Very Good';
    return 'Excellent';
  };

  const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d'];
  const IMPACT_COLORS = {
    water: '#3b82f6',
    carbon: '#10b981',
    waste: '#f59e0b'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Product Data</h2>
          <p className="text-gray-600">Please scan a product first to view its sustainability data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-green-800">{productData.name}</h2>
              <p className="text-gray-500">Brand: {productData.brand}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                disabled={productData.alternatives.length === 0}
              >
                {productData.alternatives.length === 0 ? 'No Alternatives Available' : 
                 showAlternatives ? 'Hide Alternatives' : 'Show Better Alternatives'}
                {productData.alternatives.length > 0 && (
                  <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${showAlternatives ? 'rotate-90' : ''}`} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Environmental Score */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Environmental Footprint Score
              </h3>
              
              <div className="relative pt-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-red-500">Poor</span>
                  <span className="text-orange-500">Fair</span>
                  <span className="text-yellow-500">Good</span>
                  <span className="text-green-500">Very Good</span>
                  <span className="text-green-600">Excellent</span>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full mb-4">
                  <div 
                    className={`h-full rounded-full ${getEfsScoreColor(productData.efsScore)}`}
                    style={{ width: `${productData.efsScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">0</span>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-green-700">{productData.efsScore}</span>
                    </div>
                    <p className="mt-1 font-medium text-green-700">{getEfsScoreText(productData.efsScore)}</p>
                  </div>
                  <span className="text-sm text-gray-500">100</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium text-green-800 mb-3">Score Breakdown</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={productData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Carbon Footprint Visualization */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-green-700 mb-4">Carbon Footprint</h3>
              
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <svg width="160" height="200" viewBox="0 0 160 200" className="mx-auto">
                    <path 
                      d="M80 0C50 0 30 20 30 60C30 90 0 110 0 140C0 170 30 200 80 200C130 200 160 170 160 140C160 110 130 90 130 60C130 20 110 0 80 0Z" 
                      fill="none" 
                      stroke="#d1d5db" 
                      strokeWidth="2"
                    />
                    <clipPath id="foot-clip">
                      <rect x="0" y={`${100 - productData.carbonFootprint.value}%`} width="100%" height={`${productData.carbonFootprint.value}%`} />
                    </clipPath>
                    <path 
                      d="M80 0C50 0 30 20 30 60C30 90 0 110 0 140C0 170 30 200 80 200C130 200 160 170 160 140C160 110 130 90 130 60C130 20 110 0 80 0Z" 
                      fill="#10b981"
                      clipPath="url(#foot-clip)"
                    />
                    <circle cx="50" cy="25" r="10" fill="#d1d5db" />
                    <circle cx="70" cy="20" r="10" fill="#d1d5db" />
                    <circle cx="90" cy="20" r="10" fill="#d1d5db" />
                    <circle cx="110" cy="25" r="10" fill="#d1d5db" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <p className="text-lg font-bold text-green-700">{productData.carbonFootprint.score}</p>
                <p className="text-sm text-gray-600">{productData.carbonFootprint.equivalent}</p>
              </div>
            </div>
          </div>

          {/* Middle Column - Detailed Metrics */}
          <div className="lg:col-span-1">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">Recyclability</h4>
                    <p className="text-2xl font-bold text-green-600">{productData.recyclability.score}</p>
                    <p className="text-xs text-gray-600">{productData.recyclability.percentage}% recyclable packaging</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Recycle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${productData.recyclability.value}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">Ingredients</h4>
                    <p className="text-2xl font-bold text-green-600">{productData.ingredients.score}</p>
                    <p className="text-xs text-gray-600">{productData.ingredients.description}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${productData.ingredients.value}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">Water Usage</h4>
                    <p className="text-2xl font-bold text-green-600">{productData.waterUsage.score}</p>
                    <p className="text-xs text-gray-600">{productData.waterUsage.description}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Droplet className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${productData.waterUsage.value}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Green Alerts */}
            {productData.alerts.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Green Alerts
                </h3>
                
                <div className="space-y-4">
                  {productData.alerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`border-l-4 p-4 rounded-r-lg ${
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : 
                        alert.type === 'danger' ? 'bg-red-50 border-red-400' : 
                        'bg-blue-50 border-blue-400'
                      }`}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className={`h-5 w-5 ${
                            alert.type === 'warning' ? 'text-yellow-400' : 
                            alert.type === 'danger' ? 'text-red-400' : 
                            'text-blue-400'
                          }`} />
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm ${
                            alert.type === 'warning' ? 'text-yellow-700' : 
                            alert.type === 'danger' ? 'text-red-700' : 
                            'text-blue-700'
                          }`}>
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disposal Instructions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-green-700 mb-4">Disposal Instructions</h3>
              <p className="text-gray-600 mb-2">
                This product is categorized as: <span className="font-medium text-green-800">{productData.disposal}</span>
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

          {/* Right Column - Environmental Impact Comparison */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-green-700 mb-4">Environmental Impact Comparison</h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={productData.impactComparison}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="water" name="Water Usage" fill={IMPACT_COLORS.water} />
                  <Bar dataKey="carbon" name="Carbon Emissions" fill={IMPACT_COLORS.carbon} />
                  <Bar dataKey="waste" name="Waste Production" fill={IMPACT_COLORS.waste} />
                </BarChart>
              </ResponsiveContainer>
              
              <p className="text-sm text-gray-600 mt-4">
                Lower values indicate better environmental performance
              </p>
            </div>

            {/* Better Alternatives Section */}
            {showAlternatives && productData.alternatives.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                  <ThumbsUp className="mr-2 h-5 w-5" />
                  Better Alternative Products
                </h3>
                
                <div className="space-y-6">
                  {productData.alternatives.map((alt, index) => (
                    <div key={index} className="border border-green-100 rounded-lg p-4 hover:bg-green-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-green-800">{alt.name}</h4>
                          <p className="text-sm text-gray-600">by {alt.brand}</p>
                        </div>
                        <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                          <span className="text-sm font-medium text-green-800">EFS: {alt.efsScore}</span>
                          {alt.improvement > 0 && (
                            <span className="ml-1 text-xs text-green-600">+{alt.improvement}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center">
                          <ArrowRight className="h-4 w-4 text-green-600 mr-2" />
                          <p className="text-sm text-gray-700">{alt.benefits}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <button className="text-green-600 text-sm hover:text-green-800 flex items-center">
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>    
    </div>
  );
}



// 'use client';
// import { useState, useEffect } from 'react';
// import { 
//   BarChart, 
//   Bar, 
//   PieChart, 
//   Pie, 
//   Cell, 
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis, 
//   CartesianGrid, 
//   Tooltip,
//   Legend
// } from 'recharts';
// import { 
//   AlertTriangle, 
//   ThumbsUp, 
//   Leaf, 
//   Droplet, 
//   Recycle, 
//   ChevronRight,
//   AlertCircle,
//   ArrowRight,
//   Award
// } from 'lucide-react';

// // Mock data for the dashboard
// const productData = {
//   name: "EcoClean Shampoo",
//   brand: "EcoClean",
//   efsScore: 75, // Out of 100
//   carbonFootprint: {
//     score: "Low",
//     equivalent: "Planting 3 trees",
//     value: 25, // percentage 
//   },
//   recyclability: {
//     score: "High",
//     percentage: 94,
//     value: 94,
//   },
//   waterUsage: {
//     score: "Medium",
//     description: "40% less than average",
//     value: 60,
//   },
//   ingredients: {
//     score: "Safe",
//     description: "No harmful chemicals detected",
//     value: 85,
//   },
//   alerts: [
//     {
//       type: "warning",
//       message: "This product uses palm oil which can contribute to deforestation."
//     }
//   ],
//   disposal: "Recyclable",
//   alternatives: [
//     {
//       name: "Natural Essence Shampoo",
//       brand: "GreenLife",
//       efsScore: 85,
//       improvement: 10,
//       benefits: "Sustainable packaging, locally sourced ingredients"
//     },
//     {
//       name: "Eco-Pure Shampoo",
//       brand: "PlanetFriendly",
//       efsScore: 82,
//       improvement: 7,
//       benefits: "Zero waste packaging, carbon-neutral production"
//     }
//   ],
//   categoryBreakdown: [
//     { name: 'Packaging', value: 25 },
//     { name: 'Ingredients', value: 40 },
//     { name: 'Manufacturing', value: 20 },
//     { name: 'Transportation', value: 15 }
//   ],
//   impactComparison: [
//     { name: 'Average Product', water: 100, carbon: 100, waste: 100 },
//     { name: 'This Product', water: 60, carbon: 25, waste: 15 },
//     { name: 'Best Alternative', water: 50, carbon: 20, waste: 10 }
//   ]
// };

// // Colors for the EFS score meter
// const getEfsScoreColor = (score: number) => {
//   if (score < 30) return 'bg-red-500';
//   if (score < 50) return 'bg-orange-500';
//   if (score < 70) return 'bg-yellow-500';
//   if (score < 90) return 'bg-green-500';
//   return 'bg-green-600';
// };

// const getEfsScoreText = (score: number) => {
//   if (score < 30) return 'Poor';
//   if (score < 50) return 'Fair';
//   if (score < 70) return 'Good';
//   if (score < 90) return 'Very Good';
//   return 'Excellent';
// };

// const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d'];
// const IMPACT_COLORS = {
//   water: '#3b82f6',
//   carbon: '#10b981',
//   waste: '#f59e0b'
// };

// export default function DashboardPage() {
//   const [showAlternatives, setShowAlternatives] = useState(false);
  
//   return (
//     <div className="min-h-screen bg-green-50">
//       {/* Top Navigation Bar */}


//       {/* Main Content */}
//       <div className="container mx-auto py-8 px-4">
        
//         {/* Product Header */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div>
//               <h2 className="text-3xl font-bold text-green-800">{productData.name}</h2>
//               <p className="text-gray-500">Brand: {productData.brand}</p>
//             </div>
//             <div className="mt-4 md:mt-0">
//               <button 
//                 onClick={() => setShowAlternatives(!showAlternatives)}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
//               >
//                 {showAlternatives ? 'Hide Alternatives' : 'Show Better Alternatives'}
//                 <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${showAlternatives ? 'rotate-90' : ''}`} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Environmental Score */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//               <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
//                 <Award className="mr-2 h-5 w-5" />
//                 Environmental Footprint Score
//               </h3>
              
//               <div className="relative pt-5">
//                 <div className="mb-2 flex justify-between text-sm">
//                   <span className="text-red-500">Poor</span>
//                   <span className="text-orange-500">Fair</span>
//                   <span className="text-yellow-500">Good</span>
//                   <span className="text-green-500">Very Good</span>
//                   <span className="text-green-600">Excellent</span>
//                 </div>
//                 <div className="h-4 w-full bg-gray-200 rounded-full mb-4">
//                   <div 
//                     className={`h-full rounded-full ${getEfsScoreColor(productData.efsScore)}`}
//                     style={{ width: `${productData.efsScore}%` }}
//                   ></div>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">0</span>
//                   <div className="text-center">
//                     <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto">
//                       <span className="text-2xl font-bold text-green-700">{productData.efsScore}</span>
//                     </div>
//                     <p className="mt-1 font-medium text-green-700">{getEfsScoreText(productData.efsScore)}</p>
//                   </div>
//                   <span className="text-sm text-gray-500">100</span>
//                 </div>
//               </div>
              
//               <div className="mt-8">
//                 <h4 className="font-medium text-green-800 mb-3">Score Breakdown</h4>
//                 <ResponsiveContainer width="100%" height={200}>
//                   <PieChart>
//                     <Pie
//                       data={productData.categoryBreakdown}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {productData.categoryBreakdown.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip formatter={(value) => `${value}%`} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Carbon Footprint Visualization */}
//             <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//               <h3 className="text-xl font-bold text-green-700 mb-4">Carbon Footprint</h3>
              
//               <div className="flex justify-center mb-4">
//                 <div className="relative">
//                   {/* Foot shape outline */}
//                   <svg width="160" height="200" viewBox="0 0 160 200" className="mx-auto">
//                     <path 
//                       d="M80 0C50 0 30 20 30 60C30 90 0 110 0 140C0 170 30 200 80 200C130 200 160 170 160 140C160 110 130 90 130 60C130 20 110 0 80 0Z" 
//                       fill="none" 
//                       stroke="#d1d5db" 
//                       strokeWidth="2"
//                     />
//                     {/* Filled portion based on carbon footprint value */}
//                     <clipPath id="foot-clip">
//                       <rect x="0" y={`${100 - productData.carbonFootprint.value}%`} width="100%" height={`${productData.carbonFootprint.value}%`} />
//                     </clipPath>
//                     <path 
//                       d="M80 0C50 0 30 20 30 60C30 90 0 110 0 140C0 170 30 200 80 200C130 200 160 170 160 140C160 110 130 90 130 60C130 20 110 0 80 0Z" 
//                       fill="#10b981"
//                       clipPath="url(#foot-clip)"
//                     />
//                     {/* Toes */}
//                     <circle cx="50" cy="25" r="10" fill="#d1d5db" />
//                     <circle cx="70" cy="20" r="10" fill="#d1d5db" />
//                     <circle cx="90" cy="20" r="10" fill="#d1d5db" />
//                     <circle cx="110" cy="25" r="10" fill="#d1d5db" />
//                   </svg>
//                 </div>
//               </div>
              
//               <div className="text-center mb-4">
//                 <p className="text-lg font-bold text-green-700">{productData.carbonFootprint.score}</p>
//                 <p className="text-sm text-gray-600">Equivalent to {productData.carbonFootprint.equivalent}</p>
//               </div>
//             </div>
//           </div>

//           {/* Middle Column - Detailed Metrics */}
//           <div className="lg:col-span-1">
//             {/* Key Metrics Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
//               <div className="bg-white rounded-xl shadow-md p-5">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h4 className="font-medium text-green-800">Recyclability</h4>
//                     <p className="text-2xl font-bold text-green-600">{productData.recyclability.score}</p>
//                     <p className="text-xs text-gray-600">{productData.recyclability.percentage}% recyclable packaging</p>
//                   </div>
//                   <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
//                     <Recycle className="h-6 w-6 text-green-600" />
//                   </div>
//                 </div>
//                 <div className="mt-3 h-2 w-full bg-gray-200 rounded-full">
//                   <div 
//                     className="h-full bg-green-500 rounded-full"
//                     style={{ width: `${productData.recyclability.value}%` }}
//                   ></div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-xl shadow-md p-5">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h4 className="font-medium text-green-800">Water Usage</h4>
//                     <p className="text-2xl font-bold text-green-600">{productData.waterUsage.score}</p>
//                     <p className="text-xs text-gray-600">{productData.waterUsage.description}</p>
//                   </div>
//                   <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
//                     <Droplet className="h-6 w-6 text-green-600" />
//                   </div>
//                 </div>
//                 <div className="mt-3 h-2 w-full bg-gray-200 rounded-full">
//                   <div 
//                     className="h-full bg-blue-500 rounded-full"
//                     style={{ width: `${productData.waterUsage.value}%` }}
//                   ></div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-xl shadow-md p-5">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h4 className="font-medium text-green-800">Ingredients</h4>
//                     <p className="text-2xl font-bold text-green-600">{productData.ingredients.score}</p>
//                     <p className="text-xs text-gray-600">{productData.ingredients.description}</p>
//                   </div>
//                   <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
//                     <Leaf className="h-6 w-6 text-green-600" />
//                   </div>
//                 </div>
//                 <div className="mt-3 h-2 w-full bg-gray-200 rounded-full">
//                   <div 
//                     className="h-full bg-green-500 rounded-full"
//                     style={{ width: `${productData.ingredients.value}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             {/* Green Alerts */}
//             {productData.alerts.length > 0 && (
//               <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//                 <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
//                   <AlertCircle className="mr-2 h-5 w-5" />
//                   Green Alerts
//                 </h3>
                
//                 <div className="space-y-4">
//                   {productData.alerts.map((alert, index) => (
//                     <div 
//                       key={index} 
//                       className={`border-l-4 p-4 rounded-r-lg ${
//                         alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : 
//                         alert.type === 'danger' ? 'bg-red-50 border-red-400' : 
//                         'bg-blue-50 border-blue-400'
//                       }`}
//                     >
//                       <div className="flex">
//                         <div className="flex-shrink-0">
//                           <AlertTriangle className={`h-5 w-5 ${
//                             alert.type === 'warning' ? 'text-yellow-400' : 
//                             alert.type === 'danger' ? 'text-red-400' : 
//                             'text-blue-400'
//                           }`} />
//                         </div>
//                         <div className="ml-3">
//                           <p className={`text-sm ${
//                             alert.type === 'warning' ? 'text-yellow-700' : 
//                             alert.type === 'danger' ? 'text-red-700' : 
//                             'text-blue-700'
//                           }`}>
//                             {alert.message}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Disposal Instructions */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h3 className="text-xl font-bold text-green-700 mb-4">Disposal Instructions</h3>
//               <p className="text-gray-600 mb-2">
//                 This product is categorized as: <span className="font-medium text-green-800">{productData.disposal}</span>
//               </p>
//               <button className="text-green-600 hover:text-green-800 text-sm flex items-center">
//                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                 </svg>
//                 Watch recycling instructions
//               </button>
//             </div>
//           </div>

//           {/* Right Column - Environmental Impact Comparison */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//               <h3 className="text-xl font-bold text-green-700 mb-4">Environmental Impact Comparison</h3>
              
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart
//                   data={productData.impactComparison}
//                   layout="vertical"
//                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis type="number" domain={[0, 100]} />
//                   <YAxis dataKey="name" type="category" />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="water" name="Water Usage" fill={IMPACT_COLORS.water} />
//                   <Bar dataKey="carbon" name="Carbon Emissions" fill={IMPACT_COLORS.carbon} />
//                   <Bar dataKey="waste" name="Waste Production" fill={IMPACT_COLORS.waste} />
//                 </BarChart>
//               </ResponsiveContainer>
              
//               <p className="text-sm text-gray-600 mt-4">
//                 Lower values indicate better environmental performance
//               </p>
//             </div>

//             {/* Better Alternatives Section */}
//             {showAlternatives && (
//               <div className="bg-white rounded-xl shadow-md p-6">
//                 <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
//                   <ThumbsUp className="mr-2 h-5 w-5" />
//                   Better Alternative Products
//                 </h3>
                
//                 <div className="space-y-6">
//                   {productData.alternatives.map((alt, index) => (
//                     <div key={index} className="border border-green-100 rounded-lg p-4 hover:bg-green-50 transition">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h4 className="font-semibold text-green-800">{alt.name}</h4>
//                           <p className="text-sm text-gray-600">by {alt.brand}</p>
//                         </div>
//                         <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
//                           <span className="text-sm font-medium text-green-800">EFS: {alt.efsScore}</span>
//                           <span className="ml-1 text-xs text-green-600">+{alt.improvement}</span>
//                         </div>
//                       </div>
                      
//                       <div className="mt-3">
//                         <div className="flex items-center">
//                           <ArrowRight className="h-4 w-4 text-green-600 mr-2" />
//                           <p className="text-sm text-gray-700">{alt.benefits}</p>
//                         </div>
//                       </div>
                      
//                       <div className="mt-3 flex justify-end">
//                         <button className="text-green-600 text-sm hover:text-green-800 flex items-center">
//                           View Details
//                           <ChevronRight className="ml-1 h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>    
//     </div>
//   );
// }