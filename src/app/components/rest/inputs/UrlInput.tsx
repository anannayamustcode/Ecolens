"use client";

import { FormEvent, useState } from 'react';
import { Search, ExternalLink, X, Star, ShoppingCart, TrendingUp, Shield, FileText, Sparkles } from 'lucide-react';

interface UrlInputProps {
  onSubmit?: (url: string) => void;
}

interface ProductReport {
  name: string;
  category: string;
  subcategory: string;
  avgRating: number;
  priceRange: string;
  popularBrands: string[];
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  buyingTips: string[];
  ingredients: string[];
  suitableFor: string[];
  notRecommendedFor: string[];
  shades?: string[];
  application?: string[];
}

const COSMETICS_DATABASE = {
  // PERFUMES & FRAGRANCES
  'perfume': {
    brands: ['Plum', 'Forest Essentials', 'Kama Ayurveda', 'The Body Shop', 'Bath & Body Works', 'Nykaa Cosmetics', 'Bella Vita Organic', 'Engage', 'Wild Stone', 'Fogg', 'Denver', 'Axe', 'Park Avenue', 'Set Wet', 'Godrej No.1'],
    subcategory: 'Eau de Parfum',
    keyFeatures: ['Long-lasting fragrance', 'Premium glass bottle', 'Natural ingredients', 'Alcohol-based formula', 'Layered scent notes'],
    ingredients: ['Essential oils', 'Alcohol denat', 'Aqua', 'Fragrance oils', 'Natural extracts'],
    priceRange: '₹299 - ₹3,500',
    suitableFor: ['All skin types', 'Day & evening wear', 'Special occasions'],
    shades: ['Floral', 'Woody', 'Oriental', 'Fresh', 'Citrus', 'Musky']
  },
  'fragrance': {
    brands: ['Chanel', 'Dior', 'Tom Ford', 'Versace', 'Hugo Boss', 'Calvin Klein', 'Paco Rabanne', 'Giorgio Armani', 'Yves Saint Laurent', 'Burberry', 'Dolce & Gabbana', 'Marc Jacobs'],
    subcategory: 'Luxury Fragrance',
    keyFeatures: ['Premium ingredients', 'Designer packaging', 'Complex scent profile', 'Long wear time', 'Signature scents'],
    ingredients: ['Rare essential oils', 'Synthetic molecules', 'Natural absolutes', 'Alcohol', 'Fixatives'],
    priceRange: '₹3,000 - ₹15,000',
    suitableFor: ['Luxury enthusiasts', 'Gift occasions', 'Professional settings']
  },

  // LIPSTICKS
  'lipstick': {
    brands: ['MAC', 'Maybelline', 'Lakme', 'Nykaa', 'Sugar Cosmetics', 'Colorbar', 'Revlon', 'L\'Oreal', 'Faces Canada', 'Wet n Wild', 'Blue Heaven', 'Insight Cosmetics', 'Miss Claire', 'Swiss Beauty'],
    subcategory: 'Color Cosmetics',
    keyFeatures: ['Creamy texture', 'Rich pigmentation', 'Moisturizing formula', 'Long-lasting wear', 'Wide shade range'],
    ingredients: ['Wax', 'Oils', 'Pigments', 'Emollients', 'Antioxidants', 'SPF (some variants)'],
    priceRange: '₹99 - ₹2,500',
    suitableFor: ['All lip types', 'Daily wear', 'Professional makeup'],
    shades: ['Nude', 'Red', 'Pink', 'Coral', 'Berry', 'Brown', 'Orange', 'Plum'],
    application: ['Apply from center outward', 'Use lip liner for precision', 'Blot and reapply for longevity']
  },
  'lip gloss': {
    brands: ['Fenty Beauty', 'Rare Beauty', 'Glossier', 'Charlotte Tilbury', 'Huda Beauty', 'Kylie Cosmetics', 'Nykaa', 'Sugar Cosmetics', 'Maybelline', 'L\'Oreal'],
    subcategory: 'Lip Enhancement',
    keyFeatures: ['High shine finish', 'Non-sticky formula', 'Plumping effect', 'Versatile application', 'Comfortable wear'],
    ingredients: ['Hyaluronic acid', 'Vitamin E', 'Peptides', 'Oils', 'Shine enhancers'],
    priceRange: '₹199 - ₹3,000',
    suitableFor: ['Casual wear', 'Layering over lipstick', 'Natural look enthusiasts']
  },

  // FOUNDATION & BASE
  'foundation': {
    brands: ['Estee Lauder', 'Giorgio Armani', 'NARS', 'Urban Decay', 'Too Faced', 'Tarte', 'Lakme', 'L\'Oreal', 'Maybelline', 'Revlon', 'Colorbar', 'Faces Canada', 'Blue Heaven'],
    subcategory: 'Base Makeup',
    keyFeatures: ['Even coverage', 'Buildable formula', 'Natural finish', 'Long-wearing', 'Shade-inclusive range'],
    ingredients: ['Titanium dioxide', 'Iron oxides', 'Silicones', 'Emollients', 'SPF protection'],
    priceRange: '₹399 - ₹6,000',
    suitableFor: ['All skin types', 'Professional photography', 'Daily wear'],
    shades: ['Fair', 'Light', 'Medium', 'Tan', 'Deep', 'Rich'],
    application: ['Use primer first', 'Apply in thin layers', 'Blend with damp beauty sponge', 'Set with powder']
  },
  'concealer': {
    brands: ['Tarte Shape Tape', 'NARS', 'Urban Decay', 'Too Faced', 'Maybelline Fit Me', 'L\'Oreal', 'NYX', 'Lakme', 'Sugar Cosmetics', 'Colorbar'],
    subcategory: 'Color Correction',
    keyFeatures: ['High coverage', 'Crease-resistant', 'Brightening effect', 'Multi-use formula', 'Skin-matching technology'],
    ingredients: ['Light-reflecting particles', 'Hyaluronic acid', 'Peptides', 'Color-correcting pigments'],
    priceRange: '₹299 - ₹3,500',
    suitableFor: ['Under-eye area', 'Blemish coverage', 'Highlighting']
  },

  // EYE MAKEUP
  'eyeshadow': {
    brands: ['Urban Decay', 'Too Faced', 'Anastasia Beverly Hills', 'Morphe', 'Huda Beauty', 'Pat McGrath', 'Lakme', 'Maybelline', 'L\'Oreal', 'Nykaa', 'Sugar Cosmetics', 'Colorbar', 'Miss Claire'],
    subcategory: 'Eye Color',
    keyFeatures: ['Highly pigmented', 'Blendable formula', 'Long-lasting wear', 'Versatile finishes', 'Easy application'],
    ingredients: ['Mica', 'Talc', 'Color pigments', 'Binding agents', 'Preservatives'],
    priceRange: '₹199 - ₹8,000',
    suitableFor: ['All eye shapes', 'Day to night looks', 'Creative expression'],
    shades: ['Neutral', 'Smoky', 'Colorful', 'Metallic', 'Matte', 'Shimmer'],
    application: ['Use primer', 'Start with transition shade', 'Build intensity gradually', 'Blend upward and outward']
  },
  'mascara': {
    brands: ['Benefit', 'Too Faced', 'Urban Decay', 'Maybelline', 'L\'Oreal', 'Lakme', 'Revlon', 'Max Factor', 'Colorbar', 'Sugar Cosmetics', 'Blue Heaven'],
    subcategory: 'Lash Enhancement',
    keyFeatures: ['Volume boost', 'Length enhancement', 'Curl holding', 'Smudge-proof', 'Easy removal'],
    ingredients: ['Waxes', 'Polymers', 'Fibers', 'Pigments', 'Conditioning agents'],
    priceRange: '₹299 - ₹3,000',
    suitableFor: ['All lash types', 'Daily wear', 'Waterproof options available']
  },
  'eyeliner': {
    brands: ['Stila', 'Kat Von D', 'Urban Decay', 'NYX', 'Maybelline', 'L\'Oreal', 'Lakme', 'Colorbar', 'Sugar Cosmetics', 'Miss Claire', 'Insight'],
    subcategory: 'Eye Definition',
    keyFeatures: ['Precise application', 'Intense pigmentation', 'Waterproof formula', 'Smooth glide', 'Various tip sizes'],
    ingredients: ['Carbon black', 'Waxes', 'Film formers', 'Emollients', 'Preservatives'],
    priceRange: '₹149 - ₹2,500',
    suitableFor: ['Eye definition', 'Winged looks', 'Dramatic effects'],
    application: ['Start thin, build thickness', 'Use tape for straight lines', 'Connect dots for smooth curves']
  },

  // FACE MAKEUP
  'blush': {
    brands: ['NARS', 'Tarte', 'Milani', 'Glossier', 'Rare Beauty', 'Lakme', 'Maybelline', 'L\'Oreal', 'Colorbar', 'Sugar Cosmetics', 'Faces Canada'],
    subcategory: 'Face Color',
    keyFeatures: ['Natural flush effect', 'Buildable coverage', 'Long-lasting color', 'Skin-enhancing', 'Multiple finishes'],
    ingredients: ['Mica', 'Talc', 'Color pigments', 'Silica', 'Binding agents'],
    priceRange: '₹299 - ₹3,500',
    suitableFor: ['All skin tones', 'Natural enhancement', 'Professional makeup'],
    shades: ['Peachy', 'Rosy', 'Berry', 'Coral', 'Mauve', 'Bronzy'],
    application: ['Smile and apply to apples', 'Blend upward toward temples', 'Use light hand for natural look']
  },
  'bronzer': {
    brands: ['Benefit', 'Too Faced', 'Physician\'s Formula', 'Milani', 'Lakme', 'Maybelline', 'L\'Oreal', 'Colorbar', 'NYX'],
    subcategory: 'Contouring',
    keyFeatures: ['Sun-kissed glow', 'Matte or shimmer finish', 'Buildable intensity', 'Natural-looking', 'Multi-use formula'],
    ingredients: ['Mica', 'Iron oxides', 'Talc', 'Silica', 'Light-reflecting particles'],
    priceRange: '₹399 - ₹4,000',
    suitableFor: ['Fair to deep skin tones', 'Contouring', 'All-over warmth']
  },
  'highlighter': {
    brands: ['Fenty Beauty', 'Becca', 'Anastasia Beverly Hills', 'Jeffree Star', 'Huda Beauty', 'Lakme', 'Sugar Cosmetics', 'Nykaa', 'Colorbar', 'Miss Claire'],
    subcategory: 'Glow Enhancement',
    keyFeatures: ['Intense luminosity', 'Finely milled texture', 'Buildable glow', 'Complementary undertones', 'Multi-dimensional shine'],
    ingredients: ['Mica', 'Synthetic fluorphlogopite', 'Light-reflecting particles', 'Binding agents'],
    priceRange: '₹299 - ₹4,500',
    suitableFor: ['High points of face', 'Body highlighting', 'Photography'],
    shades: ['Champagne', 'Gold', 'Rose gold', 'Pearl', 'Bronze', 'Rainbow'],
    application: ['Apply to cheekbones', 'Bridge of nose', 'Cupid\'s bow', 'Inner corners of eyes']
  },

  // SKINCARE COSMETICS
  'serum': {
    brands: ['The Ordinary', 'Paula\'s Choice', 'Skinceuticals', 'Drunk Elephant', 'Minimalist', 'Plum', 'Dot & Key', 'The Derma Co', 'Pilgrim', 'Mamaearth'],
    subcategory: 'Targeted Treatment',
    keyFeatures: ['Concentrated actives', 'Lightweight texture', 'Fast absorption', 'Targeted benefits', 'Layerable formula'],
    ingredients: ['Hyaluronic acid', 'Vitamin C', 'Retinol', 'Niacinamide', 'Peptides'],
    priceRange: '₹399 - ₹8,000',
    suitableFor: ['Specific skin concerns', 'Anti-aging', 'Hydration', 'Brightening']
  },
  'moisturizer': {
    brands: ['Cetaphil', 'Neutrogena', 'Olay', 'Nivea', 'Pond\'s', 'Himalaya', 'Biotique', 'Mamaearth', 'Plum', 'The Body Shop'],
    subcategory: 'Hydration',
    keyFeatures: ['Deep hydration', 'Non-comedogenic', 'Suitable for daily use', 'Multiple formulations', 'Anti-aging benefits'],
    ingredients: ['Hyaluronic acid', 'Ceramides', 'Glycerin', 'SPF (day creams)', 'Retinol (night creams)'],
    priceRange: '₹199 - ₹3,500',
    suitableFor: ['All skin types', 'Daily skincare routine', 'Climate adaptation']
  },

  // NAIL PRODUCTS
  'nail polish': {
    brands: ['OPI', 'Essie', 'Sally Hansen', 'Maybelline', 'Lakme', 'Colorbar', 'Sugar Cosmetics', 'Miss Claire', 'Blue Heaven', 'Insight'],
    subcategory: 'Nail Color',
    keyFeatures: ['Chip-resistant formula', 'High-gloss finish', 'Quick-drying', 'Wide color range', 'Easy application'],
    ingredients: ['Nitrocellulose', 'Plasticizers', 'Color pigments', 'Solvents', 'UV filters'],
    priceRange: '₹99 - ₹1,500',
    suitableFor: ['All nail types', 'Professional manicures', 'DIY nail art'],
    shades: ['Classic Red', 'Nude Pink', 'Deep Berry', 'Metallic', 'Pastel', 'Dark Gothic']
  }
};

export default function UrlInput({ onSubmit }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [validatedUrl, setValidatedUrl] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [productReport, setProductReport] = useState<ProductReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isValidUrl = validateUrl(url);
    setIsValid(isValidUrl);
    
    if (isValidUrl) {
      setValidatedUrl(url);
      if (onSubmit) {
        onSubmit(url);
      }
    }
  };

  const validateUrl = (inputUrl: string) => {
    try {
      new URL(inputUrl);
      return true;
    } catch {
      return false;
    }
  };

  const generateProductReport = async () => {
    if (!url.trim()) return;
    
    setIsGeneratingReport(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const report = generateDetailedCosmeticReport(url.trim());
    setProductReport(report);
    setShowReport(true);
    setIsGeneratingReport(false);
  };

  const generateDetailedCosmeticReport = (productName: string): ProductReport => {
    const name = productName.toLowerCase();
    
    // Find matching product in database
    let matchedProduct = null;
    let productKey = '';
    
    for (const [key, data] of Object.entries(COSMETICS_DATABASE)) {
      if (name.includes(key) || key.includes(name.split(' ')[0])) {
        matchedProduct = data;
        productKey = key;
        break;
      }
    }
    
    // If no specific match, try partial matches
    if (!matchedProduct) {
      const keywords = ['lip', 'eye', 'face', 'skin', 'nail', 'fragrance'];
      for (const keyword of keywords) {
        if (name.includes(keyword)) {
          // Find related products
          for (const [key, data] of Object.entries(COSMETICS_DATABASE)) {
            if (key.includes(keyword) || data.subcategory.toLowerCase().includes(keyword)) {
              matchedProduct = data;
              productKey = key;
              break;
            }
          }
          if (matchedProduct) break;
        }
      }
    }
    
    // Default fallback for cosmetics
    if (!matchedProduct) {
      matchedProduct = {
        brands: ['Generic Brand', 'Local Brand', 'Imported Brand'],
        subcategory: 'Beauty Product',
        keyFeatures: ['Good quality', 'Affordable price', 'Easy to use'],
        ingredients: ['Safe ingredients', 'Tested formula', 'Quality assured'],
        priceRange: '₹199 - ₹1,500',
        suitableFor: ['General use', 'All skin types'],
        shades: ['Multiple variants available']
      };
      productKey = 'cosmetic product';
    }
    
    const generateRating = () => Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
    
    const commonPros = [
      'Good pigmentation and color payoff',
      'Long-lasting formula',
      'Suitable for Indian skin tones',
      'Value for money',
      'Easy availability online and offline',
      'Cruelty-free options available',
      'Suitable for beginners',
      'Wide shade range'
    ];
    
    const commonCons = [
      'May not suit all skin types',
      'Limited shade range in some variants',
      'Price can be high for premium brands',
      'May require touch-ups',
      'Packaging could be better',
      'Some shades may oxidize',
      'Strong fragrance in some products',
      'Limited availability of certain shades'
    ];
    
    const universalBuyingTips = [
      'Always check ingredients if you have sensitive skin',
      'Read reviews from verified buyers',
      'Compare prices across different platforms',
      'Look for seasonal sales and offers',
      'Check expiration dates before purchase',
      'Start with drugstore brands before investing in luxury',
      'Consider your skin undertone when choosing shades',
      'Buy from authorized retailers to avoid fakes'
    ];
    
    return {
      name: productName,
      category: 'Beauty & Cosmetics',
      subcategory: matchedProduct.subcategory,
      avgRating: generateRating(),
      priceRange: matchedProduct.priceRange,
      popularBrands: matchedProduct.brands,
      keyFeatures: matchedProduct.keyFeatures,
      pros: commonPros.slice(0, Math.floor(Math.random() * 3) + 4),
      cons: commonCons.slice(0, Math.floor(Math.random() * 2) + 3),
      buyingTips: universalBuyingTips.slice(0, Math.floor(Math.random() * 2) + 4),
      ingredients: matchedProduct.ingredients || ['Quality ingredients', 'Dermatologically tested'],
      suitableFor: matchedProduct.suitableFor || ['All skin types'],
      notRecommendedFor: ['Extremely sensitive skin (patch test recommended)', 'Allergic to specific ingredients'],
      shades: matchedProduct.shades,
      application: matchedProduct.application
    };
  };

  const handleInputClick = () => {
    if (validatedUrl) {
      setUrl(validatedUrl);
    }
  };

  const handleViewLink = () => {
    if (validatedUrl) {
      window.open(validatedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const closeReport = () => {
    setShowReport(false);
    setProductReport(null);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter cosmetic product (e.g., 'Plum perfume', 'MAC lipstick', 'Nykaa foundation')"
              className={`w-full text-black pl-10 pr-4 py-3 border ${isValid ? 'border-pink-300' : 'border-red-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-text`}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setIsValid(true);
              }}
              onClick={handleInputClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          {/* Display validated URL below input */}
          {validatedUrl && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium mb-2">Valid URL detected:</p>
              <p className="text-sm text-gray-700 break-all">{validatedUrl}</p>
              <button
                type="button"
                onClick={handleViewLink}
                className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-700 transition"
              >
                <ExternalLink className="h-4 w-4" />
                View Link
              </button>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!url.trim()}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search URL
          </button>
          
          <button
            type="button"
            onClick={generateProductReport}
            disabled={!url.trim() || isGeneratingReport}
            className="px-6 py-2 bg-green-500 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGeneratingReport ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Get Product Report
              </>
            )}
          </button>
        </div>
        
        {/* Quick suggestions */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Try these popular searches:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Plum perfume', 'Lakme lipstick', 'Maybelline foundation', 'Sugar eyeshadow', 'Nykaa mascara'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setUrl(suggestion)}
                className="px-3 py-1 text-xs bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Product Report Popup */}
      {showReport && productReport && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-green-500 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Cosmetics Report
                  </h2>
                  <p className="text-purple-100 mt-1">Comprehensive product analysis</p>
                </div>
                <button
                  onClick={closeReport}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Product Header */}
              <div className="mb-8 text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">{productReport.name}</h3>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <span className="bg-green-500 text-purple-800 px-4 py-2 rounded-full font-medium">
                    {productReport.category}
                  </span>
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
                    {productReport.subcategory}
                  </span>
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-yellow-700">{productReport.avgRating}/5.0</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                    <ShoppingCart className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-700">{productReport.priceRange}</span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-green-500 to-pink-50 p-5 rounded-xl">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Popular Brands ({productReport.popularBrands.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {productReport.popularBrands.map((brand, index) => (
                        <span key={index} className="bg-white bg-opacity-80 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium shadow-sm">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-xl">
                    <h4 className="font-bold text-blue-800 mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {productReport.keyFeatures.map((feature, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-1 text-xs">●</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {productReport.shades && (
                    <div className="bg-pink-50 p-5 rounded-xl">
                      <h4 className="font-bold text-pink-800 mb-3">Available Shades/Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {productReport.shades.map((shade, index) => (
                          <span key={index} className="bg-pink-200 text-pink-800 px-2 py-1 rounded text-sm">
                            {shade}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Middle Column */}
                <div className="space-y-6">
                  <div className="bg-green-50 p-5 rounded-xl">
                    <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Pros & Benefits
                    </h4>
                    <ul className="space-y-2">
                      {productReport.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                          <span className="text-green-600 mt-1 font-bold">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-50 p-5 rounded-xl">
                    <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                      <span className="text-red-600">✗</span>
                      Cons & Limitations
                    </h4>
                    <ul className="space-y-2">
                      {productReport.cons.map((con, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                          <span className="text-red-600 mt-1 font-bold">✗</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-5 rounded-xl">
                    <h4 className="font-bold text-orange-800 mb-3">Key Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {productReport.ingredients.map((ingredient, index) => (
                        <span key={index} className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-sm">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-teal-50 p-5 rounded-xl">
                    <h4 className="font-bold text-teal-800 mb-3">Suitable For</h4>
                    <ul className="space-y-2">
                      {productReport.suitableFor.map((item, index) => (
                        <li key={index} className="text-sm text-teal-700 flex items-start gap-2">
                          <span className="text-teal-600 mt-1">●</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-xl">
                    <h4 className="font-bold text-gray-800 mb-3">Not Recommended For</h4>
                    <ul className="space-y-2">
                      {productReport.notRecommendedFor.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-gray-500 mt-1">⚠</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {productReport.application && (
                    <div className="bg-indigo-50 p-5 rounded-xl">
                      <h4 className="font-bold text-indigo-800 mb-3">Application Tips</h4>
                      <ul className="space-y-2">
                        {productReport.application.map((tip, index) => (
                          <li key={index} className="text-sm text-indigo-700 flex items-start gap-2">
                            <span className="text-indigo-600 mt-1"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Buying Tips Section */}
              <div className="mt-8 p-6 bg-green-500 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5" />
                  Smart Buying Recommendations
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {productReport.buyingTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white bg-opacity-60 rounded-lg">
                      <span className="text-blue-600 font-bold text-lg"></span>
                      <span className="text-sm text-blue-800 font-medium">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Shopping Platforms */}
              <div className="mt-6 p-5 bg-green-500 rounded-xl">
                <h4 className="font-bold text-green-800 mb-3 text-center">Where to Buy in India</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Nykaa', 'Amazon', 'Flipkart', 'Myntra', 'Sephora', 'Purple', 'Tata CLiQ', 'Shoppers Stop'].map((platform) => (
                    <span key={platform} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={closeReport}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Close Report
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Save/Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );