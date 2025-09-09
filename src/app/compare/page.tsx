// src\app\compare\page.tsx
"use client";

import { useState } from "react";
import HeroSection from "../components/rest/HeroSection";
import SearchMethods from "../components/rest/SearchMethods";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

import Link from "next/link";

interface ProductImages {
  front?: string;
  back?: string;
}

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [searchMethod, setSearchMethod] = useState<
    "upload" | "camera" | "url" | "barcode" | null
  >(null);
  const [product1Images, setProduct1Images] = useState<ProductImages>({});
  const [product2Images, setProduct2Images] = useState<ProductImages>({});
  const [isComparing, setIsComparing] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearchSubmit = (method: typeof searchMethod) => {
    setSearchMethod(method);
    setTimeout(()   => setShowPopup(true), 1000);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSearchMethod(null);
  };

  const handleProduct1Complete = (images: ProductImages) => {
    setProduct1Images(images);
    console.log("Product 1 images uploaded:", images);
  };

  const handleProduct2Complete = (images: ProductImages) => {
    setProduct2Images(images);
    console.log("Product 2 images uploaded:", images);
  };

  const uploadImagesToFolder = async (images: ProductImages, folder: string) => {
    const uploadedUrls: ProductImages = {};
    
    for (const [side, imageUrl] of Object.entries(images)) {
      if (!imageUrl) continue;

      let blob;
      if (imageUrl.startsWith("data:")) {
        const res = await fetch(imageUrl);
        blob = await res.blob();
      } else {
        const response = await fetch(imageUrl);
        blob = await response.blob();
      }

      const formData = new FormData();
      formData.append("image", blob, `${side}-image.jpg`);

      const uploadUrl = `http://localhost:5001/upload-${folder}`;
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to upload ${side} image to ${folder}`);
      }

      const data = await res.json();
      uploadedUrls[side as keyof ProductImages] = data.fileUrl;
    }

    return uploadedUrls;
  };

  const handleCompare = async () => {
    // Prefer persisted per-product data saved by Submit Images buttons
    const p1Ready = typeof window !== 'undefined' && localStorage.getItem('compare_product1_ready') === 'true';
    const p2Ready = typeof window !== 'undefined' && localStorage.getItem('compare_product2_ready') === 'true';

    if (!p1Ready || !p2Ready) {
      // Fallback to current state check
      if (Object.keys(product1Images).length === 0 || Object.keys(product2Images).length === 0) {
        setCompareError("Please click 'Submit Images' for both products first");
        return;
      }
    }

    setIsComparing(true);
    setCompareError(null);

    try {
      console.log("Starting comparison process...");

      // Load persisted results (preferred) or fall back to on-the-fly extraction
      const product1Urls = (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('compare_product1_images') || '{}')) || {};
      const product2Urls = (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('compare_product2_images') || '{}')) || {};
      let product1LabelsData = (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('compare_product1_extract') || 'null'));
      let product2LabelsData = (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('compare_product2_extract') || 'null'));
      let product1EcoData = (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('compare_product1_eco') || 'null'));
      let product2EcoData = (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('compare_product2_eco') || 'null'));

      // If not ready (user didn't click Submit Images), do the full pipeline now
      if (!product1LabelsData || !product1EcoData) {
        console.log('Product 1 not persisted. Running extraction now...');
        const p1Urls = await uploadImagesToFolder(product1Images, "product1");
        const p1LabelsRes = await fetch("http://localhost:5001/api/extract-labels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ folder: "product1" }) });
        if (!p1LabelsRes.ok) throw new Error("Failed to extract labels for Product 1");
        product1LabelsData = await p1LabelsRes.json();
        const p1EcoRes = await fetch("http://localhost:5001/api/get-eco-score-proxy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          product_name: product1LabelsData.extractedData?.product_name || "Unknown Product",
          brand: product1LabelsData.extractedData?.brand || "Unknown Brand",
          category: "Personal Care", weight: "100ml", packaging_type: "Plastic Bottle",
          ingredient_list: product1LabelsData.extractedData?.ingredients || "",
          latitude: 12.9716, longitude: 77.5946, usage_frequency: "daily",
          manufacturing_loc: product1LabelsData.extractedData?.manufacturer_state || "Mumbai",
        }) });
        if (!p1EcoRes.ok) throw new Error("Failed to get eco-score for Product 1");
        product1EcoData = await p1EcoRes.json();
      }

      if (!product2LabelsData || !product2EcoData) {
        console.log('Product 2 not persisted. Running extraction now...');
        const p2Urls = await uploadImagesToFolder(product2Images, "product2");
        const p2LabelsRes = await fetch("http://localhost:5001/api/extract-labels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ folder: "product2" }) });
        if (!p2LabelsRes.ok) throw new Error("Failed to extract labels for Product 2");
        product2LabelsData = await p2LabelsRes.json();
        const p2EcoRes = await fetch("http://localhost:5001/api/get-eco-score-proxy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          product_name: product2LabelsData.extractedData?.product_name || "Unknown Product",
          brand: product2LabelsData.extractedData?.brand || "Unknown Brand",
          category: "Personal Care", weight: "100ml", packaging_type: "Plastic Bottle",
          ingredient_list: product2LabelsData.extractedData?.ingredients || "",
          latitude: 12.9716, longitude: 77.5946, usage_frequency: "daily",
          manufacturing_loc: product2LabelsData.extractedData?.manufacturer_state || "Mumbai",
        }) });
        if (!p2EcoRes.ok) throw new Error("Failed to get eco-score for Product 2");
        product2EcoData = await p2EcoRes.json();
      }

      // Call the comparison API
      console.log("Calling comparison API...");
      const comparisonPayload = {
        product1: {
          product_name: product1LabelsData.extractedData?.product_name || "Unknown Product",
          brand: product1LabelsData.extractedData?.brand || "Unknown Brand",
          category: "Personal Care",
          weight: "100ml",
          packaging_type: "Plastic Bottle",
          ingredient_list: product1LabelsData.extractedData?.ingredients || "",
          latitude: 12.9716,
          longitude: 77.5946,
          usage_frequency: "daily",
          manufacturing_loc: "Mumbai",
          eco_score: product1EcoData?.lca_results?.eco_score || 0,
          carbon_footprint: product1EcoData?.lca_results?.total_emissions_kg_co2e || 0,
          water_usage: product1EcoData?.lca_results?.water_usage_liters || 0,
          recyclability: product1EcoData?.recyclability_analysis?.effective_recycling_rate || 0,
        },
        product2: {
          product_name: product2LabelsData.extractedData?.product_name || "Unknown Product",
          brand: product2LabelsData.extractedData?.brand || "Unknown Brand",
          category: "Personal Care",
          weight: "100ml",
          packaging_type: "Plastic Bottle",
          ingredient_list: product2LabelsData.extractedData?.ingredients || "",
          latitude: 12.9716,
          longitude: 77.5946,
          usage_frequency: "daily",
          manufacturing_loc: "Mumbai",
          eco_score: product2EcoData?.lca_results?.eco_score || 0,
          carbon_footprint: product2EcoData?.lca_results?.total_emissions_kg_co2e || 0,
          water_usage: product2EcoData?.lca_results?.water_usage_liters || 0,
          recyclability: product2EcoData?.recyclability_analysis?.effective_recycling_rate || 0,
        },
      };

      const comparisonResponse = await fetch(
        "http://localhost:5001/api/compare-products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comparisonPayload),
        }
      );

      if (!comparisonResponse.ok) {
        throw new Error("Failed to compare products");
      }

      const comparisonResult = await comparisonResponse.json();
      console.log("Comparison completed:", comparisonResult);

      // Store comparison data in localStorage for the dashboard
      localStorage.setItem("comparisonData", JSON.stringify({
        product1: {
          images: product1Urls,
          labels: product1LabelsData.extractedData,
          ecoScore: product1EcoData,
        },
        product2: {
          images: product2Urls,
          labels: product2LabelsData.extractedData,
          ecoScore: product2EcoData,
        },
        comparison: comparisonResult.data,
        comparisonRaw: comparisonResult,
      }));

      // Redirect to compare dashboard
      router.push("/compare-dashboard");

    } catch (error) {
      console.error("Comparison failed:", error);
      const msg = error instanceof Error ? error.message : "Failed to compare products";
      setCompareError(msg);
      try {
        localStorage.setItem('comparisonError', msg);
      } catch {}
      // Redirect to dashboard even on failure so user sees error details
      router.push("/compare-dashboard");
    } finally {
      setIsComparing(false);
    }
  };

  const canCompare = Object.keys(product1Images).length > 0 && Object.keys(product2Images).length > 0;

  return (
    <>
      <HeroSection />
      <div className="flex w-full gap-4 px-4">
        <SearchMethods 
          value={2} 
          onSubmit={handleSearchSubmit} 
          className="flex-1" 
          onUploadComplete={handleProduct1Complete}
        />
        <SearchMethods 
          value={3} 
          onSubmit={handleSearchSubmit} 
          className="flex-1" 
          onUploadComplete={handleProduct2Complete}
        />
      </div>

      {/* Upload Status Indicators */}
      <div className="flex justify-center gap-8 my-6">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            Object.keys(product1Images).length > 0 ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm text-gray-600">Product 1</span>
          {Object.keys(product1Images).length > 0 && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            Object.keys(product2Images).length > 0 ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <span className="text-sm text-gray-600">Product 2</span>
          {Object.keys(product2Images).length > 0 && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>

      {/* Compare Button */}
      <div className="flex justify-center my-8">
        <button
          className={`px-8 py-4 rounded-full shadow-lg transition-all flex items-center gap-3 ${
            canCompare && !isComparing
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
          onClick={handleCompare}
          disabled={!canCompare || isComparing}
        >
          {isComparing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Comparing Products...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Compare Products
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {compareError && (
        <div className="flex justify-center my-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{compareError}</span>
            </div>
          </div>
        </div>
      )}

      {/* Latest Blogs Section */}
      <section className="py-12 bg-green-50 rounded-xl px-6 mb-12">
        <h3 className="text-2xl font-bold text-green-800 mb-8 text-center">
          Latest Blogs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BlogCard
            title="Your Clothes Are Polluting the Ocean More Than You Think"
            description="Each wash of synthetic fabric releases microfibers into water systems. Learn how your laundry might be feeding fish plastic."
            link="#"
          />
          <BlogCard
            title="The Hidden Cost of Your Daily Coffee"
            description="That compostable cup may still end up in landfills. Discover the truth behind 'eco-friendly' packaging and how to actually make a difference."
            link="#"
          />
          <BlogCard
            title="Recycled Plastic Isn't What You Think"
            description="Only 9% of plastic ever gets recycled. Find out why the 'recycle' symbol is misleading—and what to do instead."
            link="#"
          />
        </div>
      </section>
    </>
  );
}

function BlogCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between">
      <div>
        <h4 className="text-lg font-semibold text-green-700 mb-2">{title}</h4>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      </div>
      <a
        href={link}
        className="text-green-600 hover:text-green-800 text-sm font-medium mt-auto"
      >
        Read More →
      </a>
    </div>
  );
}

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
            <h4 className="text-lg font-semibold text-green-700 mb-2">
              Environmental Impact Score
            </h4>
            <div className="h-6 w-full bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>0</span>
              <span className="font-medium text-green-700">75/100 - Good</span>
              <span>100</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-3 rounded-lg">
              <h5 className="font-medium text-green-800 mb-1">
                Carbon Footprint
              </h5>
              <p className="text-2xl font-bold text-green-600">Low</p>
              <p className="text-xs text-gray-600">
                Equivalent to planting 3 trees
              </p>
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
              <p className="text-xs text-gray-600">
                No harmful chemicals detected
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Green Alert:</span> This product
                  uses palm oil which can contribute to deforestation.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-green-700 mb-2">
              Disposal Instructions
            </h4>
            <p className="text-gray-600 mb-2">
              This product is categorized as:{" "}
              <span className="font-medium text-green-800">Recyclable</span>
            </p>
            <button className="text-green-600 hover:text-green-800 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Watch recycling instructions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}