"use client";

import React, { useState } from "react";

export default function NonRecyclableGuide() {
  const [activeCategory, setActiveCategory] = useState("electronics");

  const nonRecyclableData = {
    electronics: {
      title: "Electronic Waste",
      color: "bg-purple-50 border-purple-200",
      items: [
        {
          name: "Old Smartphones & Tablets",
          methods: ["Take to manufacturer trade-in programs", "Find certified e-waste recyclers", "Donate to repair cafes"],
          icon: "⬜"
        },
        {
          name: "Broken Appliances",
          methods: ["Contact manufacturer for take-back", "Schedule municipal e-waste pickup", "Salvage parts for DIY projects"],
          icon: "⬜"
        },
        {
          name: "CRT Monitors & TVs",
          methods: ["Special hazardous waste facilities only", "Never put in regular trash", "Check retailer take-back programs"],
          icon: "⬜"
        }
      ]
    },
    composite: {
      title: "Composite Materials",
      color: "bg-orange-50 border-orange-200",
      items: [
        {
          name: "Chip Bags & Snack Wrappers",
          methods: ["Collect for TerraCycle programs", "Clean and use as plant pot liners", "Send to specialized processors"],
          icon: "🟧"
        },
        {
          name: "Coffee Pods",
          methods: ["Empty contents for composting", "Check for aluminum recycling programs", "Switch to refillable alternatives"],
          icon: "🟧"
        },
        {
          name: "Laminated Paper",
          methods: ["Separate layers if possible", "Use for craft projects", "Compost non-plastic portions"],
          icon: "🟧"
        }
      ]
    },
    textiles: {
      title: "Textile Waste",
      color: "bg-pink-50 border-pink-200",
      items: [
        {
          name: "Worn-Out Clothing",
          methods: ["Cut into cleaning rags", "Donate to textile recycling bins", "Use stuffing for pillows or pet beds"],
          icon: "🟨"
        },
        {
          name: "Old Shoes",
          methods: ["Nike Reuse-A-Shoe program", "Donate to homeless shelters", "Use as garden planters"],
          icon: "🟨"
        },
        {
          name: "Damaged Bedding",
          methods: ["Animal shelters often need them", "Cut into drop cloths for projects", "Repurpose as packing material"],
          icon: "🟨"
        }
      ]
    },
    hazardous: {
      title: "Hazardous Materials",
      color: "bg-red-50 border-red-200",
      items: [
        {
          name: "Batteries",
          methods: ["Take to battery collection points", "Never throw in regular trash", "Check auto parts stores for take-back"],
          icon: "🟥"
        },
        {
          name: "Paint & Chemicals",
          methods: ["Bring to hazardous waste facilities", "Use up completely before disposal", "Check with paint stores for programs"],
          icon: "🟥"
        },
        {
          name: "Light Bulbs (CFL/LED)",
          methods: ["Hardware stores often accept them", "Special mercury-containing waste sites", "Never break - contains toxic materials"],
          icon: "🟥"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="py-16 px-8 text-center border-b border-gray-100">
        <h1 className="text-4xl font-light text-gray-900 mb-4">
          How to Handle Non-Recyclable Objects
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          When traditional recycling isn't possible, these alternatives help minimize waste and environmental impact
        </p>
      </header>

      {/* Category Navigation */}
      <nav className="py-8 px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(nonRecyclableData).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-3 rounded-full transition-all duration-200 ${
                  activeCategory === key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-2xl p-8 ${nonRecyclableData[activeCategory].color}`}>
            <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
              {nonRecyclableData[activeCategory].title}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nonRecyclableData[activeCategory].items.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mr-4">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">{item.name}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {item.methods.map((method, methodIndex) => (
                      <div key={methodIndex} className="flex items-start">
                        <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                          {methodIndex + 1}
                        </div>
                        <p className="text-gray-700">{method}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Strategies Section */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">
              Alternative Disposal Strategies
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-blue-300 rounded"></div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Manufacturer Programs</h3>
                <p className="text-gray-600 text-sm">Many brands offer take-back or trade-in services</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-300 rounded-full"></div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Specialized Facilities</h3>
                <p className="text-gray-600 text-sm">Find certified processors for specific materials</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-yellow-300 rounded-sm"></div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Creative Reuse</h3>
                <p className="text-gray-600 text-sm">Transform waste into functional or decorative items</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-purple-300 rounded"></div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Community Programs</h3>
                <p className="text-gray-600 text-sm">Local collection events and swap programs</p>
              </div>
            </div>
          </div>

          {/* Important Safety Notes */}
          <div className="mt-16 bg-red-50 border-l-4 border-red-400 rounded-2xl p-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6">
              Safety Reminders
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    !
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Never Mix Hazardous Items</h3>
                    <p className="text-gray-700 text-sm">Keep batteries, chemicals, and electronics separate from regular waste</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    !
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Research Before Disposal</h3>
                    <p className="text-gray-700 text-sm">Always check local regulations and available programs first</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    !
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Store Safely Until Disposal</h3>
                    <p className="text-gray-700 text-sm">Keep hazardous items in original containers in secure locations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    !
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Consider Prevention</h3>
                    <p className="text-gray-700 text-sm">Choose reusable or easily recyclable alternatives when possible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-gray-100 text-center">
        <p className="text-gray-500 mb-2">
          Find local disposal programs and facilities in your area
        </p>
        <p className="text-gray-400 text-sm">
          When in doubt, contact your municipal waste management office
        </p>
      </footer>
    </div>
  );
}
// // "use client";
// // import React, { useRef, useState, useEffect } from "react";
// // import { useGSAP } from "@gsap/react";
// // import gsap from "gsap";
// // import { MotionPathPlugin } from "gsap/MotionPathPlugin";
// // import { ScrollTrigger } from "gsap/ScrollTrigger";
// // import Image from "next/image";

// // gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, useGSAP);

// // const fiveRs = [
// //   { label: "Reduce", back: "Consume Less", image: "reduce_symbol.png" },
// //   { label: "Repurpose", back: "Give New Life", image: "repurpose_symbol.png" },
// //   { label: "Refuse", back: "Say No to Waste", image: "refuse_symbol.png" },
// //   { label: "Reuse", back: "Use Again", image: "reuse_symbol.png" },
// //   { label: "Recycle", back: "Reprocess It", image: "recycle_symbol.png" },
// // ];

// // export default function RecyclablePage() {
// //   const cardsRef = useRef([]);
// //   const [showCards, setShowCards] = useState(true);
// //   const [activeCardIndex, setActiveCardIndex] = useState(null);
// //   const toggleCards = () => setShowCards((prev) => !prev);
// //   const logoRef = useRef(null);
// //   const pathRef = useRef(null);
// //   const imageRefs = useRef([]);
// //   const timelineContainerRef = useRef(null);
// //   const checkpointRefs = useRef([]);
// //   const [isRotating, setIsRotating] = useState(false);

// //   // Animate the dot along the path using GSAP
// //   useGSAP(
// //     () => {
// //       if (!logoRef.current || !pathRef.current || !timelineContainerRef.current)
// //         return;

// //       const path = pathRef.current;
// //       const pathLength = path.getTotalLength();

// //       // Position checkpoints along the path
// //       const percentages = [0.2, 0.4, 0.6, 0.8, 1.0];
// //       percentages.forEach((percent, i) => {
// //         const point = path.getPointAtLength(percent * pathLength);
// //         const checkpoint = checkpointRefs.current[i];
// //         const image = imageRefs.current[i];

// //         if (checkpoint) {
// //           gsap.set(checkpoint, {
// //             x: point.x,
// //             y: point.y,
// //             xPercent: -50,
// //             yPercent: -50,
// //           });
// //         }

// //         // Position images at the same points
// //         if (image) {
// //           gsap.set(image, {
// //             x: point.x,
// //             y: point.y,
// //             xPercent: -50,
// //             yPercent: -50,
// //           });
// //         }
// //       });

// //       // Create animation timeline
// //       const tl = gsap.timeline({
// //         scrollTrigger: {
// //           trigger: timelineContainerRef.current,
// //           start: "top top",
// //           end: "bottom bottom",
// //           scrub: 1,
// //           invalidateOnRefresh: true,
// //           onUpdate: (self) => {
// //             const progress = self.progress;

// //             // Show checkpoints and images as we scroll
// //             percentages.forEach((percent, i) => {
// //               if (progress >= percent) {
// //                 if (checkpointRefs.current[i]) {
// //                   gsap.set(checkpointRefs.current[i], { opacity: 1 });
// //                 }
// //                 if (imageRefs.current[i]) {
// //                   gsap.set(imageRefs.current[i], { opacity: 1 });
// //                 }
// //               }
// //             });
// //           },
// //         },
// //       });

// //       // Animate dot along path
// //       tl.to(logoRef.current, {
// //         motionPath: {
// //           path: path,
// //           align: path,
// //           alignOrigin: [0.5, 0.5],
// //           autoRotate: true,
// //         },
// //         ease: "none",
// //       });
// //     },
// //     { scope: timelineContainerRef }
// //   );
// //   // Card animation effects
// //   useEffect(() => {
// //     if (showCards) {
// //       cardsRef.current.forEach((card, i) => {
// //         if (card) {
// //           const delay = i * 0.4;
// //           card.style.opacity = "0";
// //           card.style.transform = "translateY(-30px)";
// //           setTimeout(() => {
// //             card.style.transition =
// //               "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
// //             card.style.opacity = "1";
// //             card.style.transform = "translateY(0px)";
// //           }, delay * 100);
// //         }
// //       });
// //     } else {
// //       cardsRef.current.forEach((card) => {
// //         if (card) {
// //           card.style.transition = "all 0.4s ease-in-out";
// //           card.style.opacity = "0";
// //         }
// //       });
// //     }
// //   }, [showCards]);

// //   const handleCardClick = (e, index) => {
// //     const innerCard = e.currentTarget.querySelector(".card-inner");
// //     innerCard?.classList.toggle("flipped");
// //     setActiveCardIndex(activeCardIndex === index ? null : index);
// //   };
// //   const checkpoints = [
// //     { icon: "📄", text: "Paper Products", image: "paper.png" },
// //     { icon: "🥫", text: "Aluminum Cans", image: "aluminum.png" },
// //     { icon: "🍼", text: "Plastic Bottles", image: "plastic.png" },
// //     { icon: "🍾", text: "Glass Bottles", image: "glass.png" },
// //     { icon: "📦", text: "Cardboard", image: "cardboard.png" },
// //   ];
// //   return (
// //     <div className="flex flex-col">
// //       {/* 5 R's & Flipcards Section */}
// //       <div className="flex items-center justify-center w-full min-h-screen bg-green-100 relative overflow-hidden p-5">
// //         <div className="flex items-center gap-1 max-w-7xl">
// //           <div
// //             className="w-40 h-40 rounded-full cursor-pointer hover:scale-105 transition-all duration-500 overflow-hidden"
// //             onClick={toggleCards}
// //           >
// //             <Image
// //               src="/assets/images/3R.png"
// //               alt="Recyclable Logo"
// //               width={160}
// //               height={160}
// //               //className="object-cover rounded-full"
// //               className={`object-cover rounded-full cursor-pointer transition-transform duration-700 ${
// //                 isRotating ? "rotate-360" : ""
// //               }`}
// //               onClick={() => {
// //                 setIsRotating(true);
// //                 // Reset rotation after animation completes
// //                 setTimeout(() => setIsRotating(false), 400);
// //               }}
// //             />
// //           </div>

// //           {/* Zigzag cards container */}
// //           <div
// //             className="relative"
// //             style={{ width: "1000px", height: "400px" }}
// //           >
// //             <div className="absolute top-0 left-0 flex gap-16">
// //               {["Reduce", "Repurpose", "Recycle"].map((label, index) => (
// //                 <div
// //                   key={index}
// //                   ref={(el) => (cardsRef.current[index] = el)}
// //                   className="w-40 h-40 relative cursor-pointer transition-transform duration-700"
// //                   style={{ perspective: "1000px" }}
// //                   onClick={(e) => handleCardClick(e, index)}
// //                 >
// //                   <div
// //                     className="card-inner relative w-full h-full transition-transform duration-700"
// //                     style={{ transformStyle: "preserve-3d" }}
// //                   >
// //                     <div
// //                       className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center text-black font-semibold shadow-md"
// //                       style={{ backfaceVisibility: "hidden" }}
// //                     >
// //                       <Image
// //                         //src={`/assets/images/plant.png`}
// //                         src={`/assets/images/${fiveRs[index].image}`}
// //                         alt={`${label} icon`}
// //                         width={60}
// //                         height={60}
// //                         className="mb-2"
// //                       />
// //                       {label}
// //                     </div>
// //                     <div
// //                       className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md"
// //                       style={{
// //                         transform: "rotateY(180deg)",
// //                         backfaceVisibility: "hidden",
// //                       }}
// //                     >
// //                       {fiveRs[index].back}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="absolute bottom-0 left-20 flex gap-16">
// //               {["Refuse", "Reuse"].map((label, index) => (
// //                 <div
// //                   key={index + 3}
// //                   ref={(el) => (cardsRef.current[index + 3] = el)}
// //                   className="w-40 h-40 relative cursor-pointer transition-transform duration-700"
// //                   style={{ perspective: "1000px" }}
// //                   onClick={(e) => handleCardClick(e, index + 3)}
// //                 >
// //                   <div
// //                     className="card-inner relative w-full h-full transition-transform duration-700"
// //                     style={{ transformStyle: "preserve-3d" }}
// //                   >
// //                     <div
// //                       className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center text-black font-semibold shadow-md"
// //                       style={{ backfaceVisibility: "hidden" }}
// //                     >
// //                       <Image
// //                         //src={`/assets/images/waste-management.png`}
// //                         src={`/assets/images/${fiveRs[index + 3].image}`}
// //                         alt={`${label} icon`}
// //                         width={60}
// //                         height={60}
// //                         className="mb-2"
// //                       />
// //                       {label}
// //                     </div>
// //                     <div
// //                       className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md"
// //                       style={{
// //                         transform: "rotateY(180deg)",
// //                         backfaceVisibility: "hidden",
// //                       }}
// //                     >
// //                       {fiveRs[index + 3].back}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Facts Section on the right */}
// //           <div className="flex flex-col justify-center ml-16 max-w-sm">
// //             {/* Upper Half: Recycling Tips */}
// //             <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md mb-8">
// //               <h3 className="text-xl font-bold text-green-800 mb-4">
// //                 ♻️ Recycling Tips
// //               </h3>
// //               <ul className="space-y-2 text-green-700">
// //                 <li className="flex items-start">
// //                   <span className="text-green-600 mr-2">•</span>
// //                   <span>Rinse containers before tossing.</span>
// //                 </li>
// //                 <li className="flex items-start">
// //                   <span className="text-green-600 mr-2">•</span>
// //                   <span>Flatten boxes to save space.</span>
// //                 </li>
// //                 <li className="flex items-start">
// //                   <span className="text-green-600 mr-2">•</span>
// //                   <span>Never mix wet and dry waste.</span>
// //                 </li>
// //                 <li className="flex items-start">
// //                   <span className="text-green-600 mr-2">•</span>
// //                   <span>Find your local recycling centers.</span>
// //                 </li>
// //               </ul>
// //             </div>

// //             {/* Lower Half: Impact Statistics */}
// //             <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md">
// //               <h3 className="text-xl font-bold text-blue-800 mb-4">
// //                 📊 Impact Statistics
// //               </h3>
// //               <p className="text-blue-700 mb-3 text-sm font-medium">
// //                 How much energy/resources recycling saves:
// //               </p>
// //               <ul className="space-y-2 text-blue-700">
// //                 <li className="flex items-start">
// //                   <span className="text-blue-600 mr-2">•</span>
// //                   <span>
// //                     1 recycled can = energy to power a TV for 3 hours.
// //                   </span>
// //                 </li>
// //                 <li className="flex items-start">
// //                   <span className="text-blue-600 mr-2">•</span>
// //                   <span>Recycling one ton of paper = saves 17 trees.</span>
// //                 </li>
// //                 <li className="flex items-start">
// //                   <span className="text-blue-600 mr-2">•</span>
// //                   <span>
// //                     Recycling plastic bottles saves 70% energy vs. making new
// //                     ones.
// //                   </span>
// //                 </li>
// //                 <li className="flex items-start">
// //                   <span className="text-blue-600 mr-2">•</span>
// //                   <span>
// //                     Glass can be recycled endlessly without quality loss.
// //                   </span>
// //                 </li>
// //               </ul>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* TIMELINE ANIMATION */}
// //       <div
// //         ref={timelineContainerRef}
// //         className="relative w-full h-[1800px] bg-green-200 overflow-visible"
// //       >
// //         {/* Dotted Path SVG */}
// //         <svg
// //           width="100%"
// //           height="100%"
// //           viewBox="0 0 400 1800"
// //           className="absolute left-0 top-0 z-20 pointer-events-none"
// //         >
// //           <path
// //             ref={pathRef}
// //             d="M 200 50 C 250 150, 300 250, 200 350 S 100 550, 200 650 S 300 850, 200 950 S 100 1150, 200 1250 S 300 1450, 200 1550"
// //             stroke="black"
// //             strokeWidth="3"
// //             fill="none"
// //             strokeDasharray="10,10"
// //           />
// //         </svg>

// //         {/* Moving Pointer */}
// //         <div
// //           ref={logoRef}
// //           className="w-6 h-6 bg-black rounded-full absolute z-30 shadow-xl"
// //           style={{ transform: "translate(-50%, -50%)" }}
// //         />

// //         {/* Images following the pointer path */}
// //         {checkpoints.map((checkpoint, i) => (
// //           <div
// //             key={`image-${i}`}
// //             ref={(el) => (imageRefs.current[i] = el)}
// //             className="absolute z-40 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-300 max-w-xs opacity-100"
// //             style={{ transform: "translate(-50%, -50%)" }}
// //           >
// //             <Image
// //               src={`/assets/images/${checkpoint.image}`}
// //               //src={`/assets/images/${timelineImages[i]}`}
// //               alt={`Checkpoint ${i + 1}`}
// //               width={80}
// //               height={80}
// //               className="rounded-lg shadow-lg"
// //             />
// //           </div>
// //         ))}

// //         {/* Checkpoints - Now perfectly aligned with path */}
// //         {checkpoints.map((checkpoint, i) => (
// //           <div
// //             key={i}
// //             ref={(el) => (checkpointRefs.current[i] = el)}
// //             className="absolute z-40 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-300 max-w-xs opacity-100"
// //           >
// //             <div className="font-bold text-lg">{checkpoint.icon}</div>
// //             <div className="text-sm mt-1">{checkpoint.text}</div>
// //           </div>
// //         ))}
// //       </div>

// //       <style jsx>{`
// //         .flipped {
// //           transform: rotateY(180deg);
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }

// // // MY_CODE
// // // "use client";
// // // import React, { useRef, useState, useEffect } from "react";

// // // const fiveRs = [
// // //   { label: "Reduce", back: "Consume Less" },
// // //   { label: "Repurpose", back: "Give New Life" },
// // //   { label: "Refuse", back: "Say No to Waste" },
// // //   { label: "Reuse", back: "Use Again" },
// // //   { label: "Recycle", back: "Reprocess It" },
// // // ];

// // // export default function RecyclablePage() {
// // //   const cardsRef = useRef([]);
// // //   const [showCards, setShowCards] = useState(true);
// // //   const [activeCardIndex, setActiveCardIndex] = useState(null);
// // //   const toggleCards = () => setShowCards((prev) => !prev);
// // //   const logoRef = useRef(null);
// // //   const pathRef = useRef(null);

// // //   // Animate the dot along the path using scroll
// // //   useEffect(() => {
// // //     const logo = logoRef.current;
// // //     const path = pathRef.current;
// // //     const container = document.querySelector('.timeline-container');

// // //     if (!logo || !path || !container) return;

// // //     const pathLength = path.getTotalLength();

// // //     const handleScroll = () => {
// // //       const scrollTop = window.pageYOffset;
// // //       const docHeight = document.documentElement.scrollHeight - window.innerHeight;
// // //       const scrollPercent = Math.min(Math.max(scrollTop / docHeight, 0), 1);

// // //       // Calculate position along path
// // //       const point = path.getPointAtLength(scrollPercent * pathLength);

// // //       // Get container bounds for proper positioning
// // //       const containerRect = container.getBoundingClientRect();
// // //       const containerTop = container.offsetTop;

// // //       // Convert SVG coordinates to actual container coordinates
// // //       const svgRect = path.ownerSVGElement.getBoundingClientRect();
// // //       const containerWidth = container.offsetWidth;
// // //       const scaleX = containerWidth / 400; // 400 is SVG viewBox width
// // //       const scaleY = 1800 / 1800; // Height ratio

// // //       // Update logo position with proper scaling and offset
// // //       logo.style.left = `${point.x * scaleX}px`;
// // //       logo.style.top = `${containerTop + (point.y * scaleY)}px`;
// // //       logo.style.position = 'absolute';
// // //     };

// // //     window.addEventListener('scroll', handleScroll);

// // //     // Initial position
// // //     handleScroll();

// // //     return () => {
// // //       window.removeEventListener('scroll', handleScroll);
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     if (showCards) {
// // //       cardsRef.current.forEach((card, i) => {
// // //         if (card) {
// // //           const delay = i * 0.4;
// // //           card.style.opacity = "0";
// // //           card.style.transform = "translateY(-30px)";
// // //           setTimeout(() => {
// // //             card.style.transition =
// // //               "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
// // //             card.style.opacity = "1";
// // //             card.style.transform = "translateY(0px)";
// // //           }, delay * 100);
// // //         }
// // //       });
// // //     } else {
// // //       cardsRef.current.forEach((card) => {
// // //         if (card) {
// // //           card.style.transition = "all 0.4s ease-in-out";
// // //           card.style.opacity = "0";
// // //         }
// // //       });
// // //     }
// // //   }, [showCards]);

// // //   const handleCardClick = (e, index) => {
// // //     const innerCard = e.currentTarget.querySelector(".card-inner");
// // //     innerCard?.classList.toggle("flipped");
// // //     setActiveCardIndex(activeCardIndex === index ? null : index);
// // //   };

// // //   // Calculate positions along the curved path for checkpoints
// // //   const getPathPosition = (percentage) => {
// // //     if (!pathRef.current) return { x: 200, y: 50 };
// // //     const pathLength = pathRef.current.getTotalLength();
// // //     return pathRef.current.getPointAtLength(percentage * pathLength);
// // //   };

// // //   return (
// // //     <div className="flex flex-col">
// // //       {/* 5 R's & Flipcards Section */}
// // //       <div className="flex items-center justify-center w-full min-h-screen bg-green-100 relative overflow-hidden p-5">
// // //         <div className="flex items-center gap-1 max-w-7xl">
// // //           <div
// // //             className="w-40 h-40 rounded-full bg-green-600 text-white flex items-center justify-center text-center text-lg font-semibold cursor-pointer shadow-lg hover:scale-105 transition-all duration-500"
// // //             onClick={toggleCards}
// // //           >
// // //             <span>
// // //               5 R's
// // //               <br />
// // //               of
// // //               <br />
// // //               Recycling
// // //             </span>
// // //           </div>

// // //           {/* Zigzag cards container */}
// // //           <div className="relative" style={{ width: "1000px", height: "400px" }}>
// // //             <div className="absolute top-0 left-0 flex gap-16">
// // //               {["Reduce", "Repurpose", "Recycle"].map((label, index) => (
// // //                 <div
// // //                   key={index}
// // //                   ref={(el) => (cardsRef.current[index] = el)}
// // //                   className="w-40 h-40 relative cursor-pointer transition-transform duration-700"
// // //                   style={{ perspective: "1000px" }}
// // //                   onClick={(e) => handleCardClick(e, index)}
// // //                 >
// // //                   <div
// // //                     className="card-inner relative w-full h-full transition-transform duration-700"
// // //                     style={{ transformStyle: "preserve-3d" }}
// // //                   >
// // //                     <div
// // //                       className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex items-center justify-center text-black font-semibold shadow-md"
// // //                       style={{ backfaceVisibility: "hidden" }}
// // //                     >
// // //                       {label}
// // //                     </div>
// // //                     <div
// // //                       className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md"
// // //                       style={{
// // //                         transform: "rotateY(180deg)",
// // //                         backfaceVisibility: "hidden",
// // //                       }}
// // //                     >
// // //                       {fiveRs[index].back}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             <div className="absolute bottom-0 left-20 flex gap-16">
// // //               {["Refuse", "Reuse"].map((label, index) => (
// // //                 <div
// // //                   key={index + 3}
// // //                   ref={(el) => (cardsRef.current[index + 3] = el)}
// // //                   className="w-40 h-40 relative cursor-pointer transition-transform duration-700"
// // //                   style={{ perspective: "1000px" }}
// // //                   onClick={(e) => handleCardClick(e, index + 3)}
// // //                 >
// // //                   <div
// // //                     className="card-inner relative w-full h-full transition-transform duration-700"
// // //                     style={{ transformStyle: "preserve-3d" }}
// // //                   >
// // //                     <div
// // //                       className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex items-center justify-center text-black font-semibold shadow-md"
// // //                       style={{ backfaceVisibility: "hidden" }}
// // //                     >
// // //                       {label}
// // //                     </div>
// // //                     <div
// // //                       className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md"
// // //                       style={{
// // //                         transform: "rotateY(180deg)",
// // //                         backfaceVisibility: "hidden",
// // //                       }}
// // //                     >
// // //                       {fiveRs[index + 3].back}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           {/* Facts Section on the right */}
// // //           <div className="flex flex-col justify-center ml-16 max-w-sm">
// // //             {/* Upper Half: Recycling Tips */}
// // //             <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md mb-8">
// // //               <h3 className="text-xl font-bold text-green-800 mb-4">♻️ Recycling Tips</h3>
// // //               <ul className="space-y-2 text-green-700">
// // //                 <li className="flex items-start">
// // //                   <span className="text-green-600 mr-2">•</span>
// // //                   <span>Rinse containers before tossing.</span>
// // //                 </li>
// // //                 <li className="flex items-start">
// // //                   <span className="text-green-600 mr-2">•</span>
// // //                   <span>Flatten boxes to save space.</span>
// // //                 </li>
// // //                 <li className="flex items-start">
// // //                   <span className="text-green-600 mr-2">•</span>
// // //                   <span>Never mix wet and dry waste.</span>
// // //                 </li>
// // //                 <li className="flex items-start">
// // //                   <span className="text-green-600 mr-2">•</span>
// // //                   <span>Find your local recycling centers.</span>
// // //                 </li>
// // //               </ul>
// // //             </div>

// // //             {/* Lower Half: Impact Statistics */}
// // //             <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md">
// // //               <h3 className="text-xl font-bold text-blue-800 mb-4">📊 Impact Statistics</h3>
// // //               <p className="text-blue-700 mb-3 text-sm font-medium">How much energy/resources recycling saves:</p>
// // //               <ul className="space-y-2 text-blue-700">
// // //                 <li className="flex items-start">
// // //                   <span className="text-blue-600 mr-2">•</span>
// // //                   <span>1 recycled can = energy to power a TV for 3 hours.</span>
// // //                 </li>
// // //                 <li className="flex items-start">
// // //                   <span className="text-blue-600 mr-2">•</span>
// // //                   <span>Recycling one ton of paper = saves 17 trees.</span>
// // //                 </li>
// // //                 <li className="flex items-start">
// // //                   <span className="text-blue-600 mr-2">•</span>
// // //                   <span>Recycling plastic bottles saves 70% energy vs. making new ones.</span>
// // //                 </li>
// // //                 <li className="flex items-start">
// // //                   <span className="text-blue-600 mr-2">•</span>
// // //                   <span>Glass can be recycled endlessly without quality loss.</span>
// // //                 </li>
// // //               </ul>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* TIMELINE ANIMATION */}
// // //       <div className="relative w-full h-[1800px] bg-green-200 overflow-visible">
// // //         {/* Dotted Curvy Path - Always Visible */}
// // //         <svg
// // //           width="100%"
// // //           height="100%"
// // //           viewBox="0 0 400 1800"
// // //           className="absolute left-0 top-0 z-20 pointer-events-none"
// // //         >
// // //           <path
// // //             ref={pathRef}
// // //             id="motionPath"
// // //             d="M 200 50
// // //              C 250 150, 300 250, 200 350
// // //              S 100 550, 200 650
// // //              S 300 850, 200 950
// // //              S 100 1150, 200 1250
// // //              S 300 1450, 200 1550"
// // //             stroke="black"
// // //             strokeWidth="3"
// // //             fill="none"
// // //             strokeDasharray="10,10"
// // //           />
// // //         </svg>

// // //         {/* Moving Circle */}
// // //         <div
// // //           ref={logoRef}
// // //           className="w-16 h-16 bg-black rounded-full absolute z-30 shadow-xl"
// // //           style={{ transform: "translate(-50%, -50%)" }}
// // //         ></div>

// // //         {/* Checkpoint Labels on Path - Positioned along the curve */}
// // //         {[
// // //           { percentage: 0.2, icon: "📄 Paper" },
// // //           { percentage: 0.4, icon: "🥫 Aluminium Can" },
// // //           { percentage: 0.6, icon: "🍼 Plastic Bottle" },
// // //           { percentage: 0.8, icon: "🍾 Glass Bottle" },
// // //           { percentage: 1.0, icon: "📦 Cardboard" },
// // //         ].map((cp, i) => {
// // //           const position = pathRef.current ?
// // //             (() => {
// // //               const pathLength = pathRef.current.getTotalLength();
// // //               return pathRef.current.getPointAtLength(cp.percentage * pathLength);
// // //             })() :
// // //             { x: 200, y: 50 + (i * 300) };

// // //           return (
// // //             <div
// // //               key={i}
// // //               className="absolute z-40 text-black font-semibold bg-white px-3 py-1 rounded-full shadow-md border-2 border-gray-300"
// // //               style={{
// // //                 left: `${position.x}px`,
// // //                 top: `${position.y}px`,
// // //                 transform: "translate(-50%, -50%)"
// // //               }}
// // //             >
// // //               {cp.icon}
// // //             </div>
// // //           );
// // //         })}
// // //       </div>

// // //       <style jsx>{`
// // //         .flipped {
// // //           transform: rotateY(180deg);
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // }

// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const fiveRs = [
//   { label: "Reduce", back: "Consume Less", image: "🌱" },
//   { label: "Repurpose", back: "Give New Life", image: "🔄" },
//   { label: "Refuse", back: "Say No to Waste", image: "❌" },
//   { label: "Reuse", back: "Use Again", image: "♻️" },
//   { label: "Recycle", back: "Reprocess It", image: "🗂️" },
// ];

// export default function RecyclablePage() {
//   const cardsRef = useRef([]);
//   const [showCards, setShowCards] = useState(true);
//   const [activeCardIndex, setActiveCardIndex] = useState(null);
//   const toggleCards = () => setShowCards((prev) => !prev);
//   const logoRef = useRef(null);
//   const pathRef = useRef(null);
//   const imageRefs = useRef([]);
//   const timelineContainerRef = useRef(null);
//   const checkpointRefs = useRef([]);
//   const [isRotating, setIsRotating] = useState(false);

//   // Animate the dot along the path using scroll
//   useEffect(() => {
//     const logo = logoRef.current;
//     const path = pathRef.current;
//     const container = timelineContainerRef.current;

//     if (!logo || !path || !container) return;

//     const pathLength = path.getTotalLength();

//     // Position checkpoints and images along the path
//     const percentages = [0.2, 0.4, 0.6, 0.8, 1.0];
//     percentages.forEach((percent, i) => {
//       const point = path.getPointAtLength(percent * pathLength);
//       const checkpoint = checkpointRefs.current[i];
//       const image = imageRefs.current[i];

//       if (checkpoint) {
//         checkpoint.style.left = `${point.x}px`;
//         checkpoint.style.top = `${point.y}px`;
//         checkpoint.style.transform = "translate(-50%, -50%)";
//         checkpoint.style.position = "absolute";
//       }

//       if (image) {
//         image.style.left = `${point.x}px`;
//         image.style.top = `${point.y - 60}px`; // Position images above the path
//         image.style.transform = "translate(-50%, -50%)";
//         image.style.position = "absolute";
//       }
//     });

//     const handleScroll = () => {
//       const containerRect = container.getBoundingClientRect();
//       const containerTop = window.pageYOffset + containerRect.top;
//       const containerHeight = container.offsetHeight;
//       const viewportHeight = window.innerHeight;
      
//       // Calculate scroll progress within the timeline container
//       const scrollTop = window.pageYOffset;
//       const containerStart = containerTop - viewportHeight * 0.5; // Start earlier
//       const containerEnd = containerTop + containerHeight - viewportHeight * 0.5; // End later
      
//       let scrollPercent = 0;
//       if (scrollTop >= containerStart && scrollTop <= containerEnd) {
//         scrollPercent = (scrollTop - containerStart) / (containerEnd - containerStart);
//         scrollPercent = Math.min(Math.max(scrollPercent, 0), 1);
//       } else if (scrollTop > containerEnd) {
//         scrollPercent = 1;
//       }

//       // Calculate position along path
//       const point = path.getPointAtLength(scrollPercent * pathLength);

//       // Update logo position
//       logo.style.left = `${point.x}px`;
//       logo.style.top = `${point.y}px`;
//       logo.style.position = 'absolute';
//       logo.style.transform = 'translate(-50%, -50%)';

//       // Show/hide checkpoints and images based on progress
//       percentages.forEach((percent, i) => {
//         const checkpoint = checkpointRefs.current[i];
//         const image = imageRefs.current[i];
        
//         if (scrollPercent >= percent - 0.1) { // Show slightly earlier
//           if (checkpoint) checkpoint.style.opacity = '1';
//           if (image) image.style.opacity = '1';
//         } else {
//           if (checkpoint) checkpoint.style.opacity = '0.3';
//           if (image) image.style.opacity = '0.3';
//         }
//       });
//     };

//     window.addEventListener('scroll', handleScroll);
//     handleScroll(); // Initial call

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   // Card animation effects
//   useEffect(() => {
//     if (showCards) {
//       cardsRef.current.forEach((card, i) => {
//         if (card) {
//           const delay = i * 0.4;
//           card.style.opacity = "0";
//           card.style.transform = "translateY(-30px)";
//           setTimeout(() => {
//             card.style.transition =
//               "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
//             card.style.opacity = "1";
//             card.style.transform = "translateY(0px)";
//           }, delay * 100);
//         }
//       });
//     } else {
//       cardsRef.current.forEach((card) => {
//         if (card) {
//           card.style.transition = "all 0.4s ease-in-out";
//           card.style.opacity = "0";
//         }
//       });
//     }
//   }, [showCards]);

//   const handleCardClick = (e, index) => {
//     const innerCard = e.currentTarget.querySelector(".card-inner");
//     innerCard?.classList.toggle("flipped");
//     setActiveCardIndex(activeCardIndex === index ? null : index);
//   };

//   const checkpoints = [
//     { 
//       icon: "📄", 
//       title: "Paper Products", 
//       fact: "Takes 2-6 weeks to decompose",
//       tip: "But recycling saves 60% energy!"
//     },
//     { 
//       icon: "🥫", 
//       title: "Aluminum Cans", 
//       fact: "Takes 80-100 years to decompose",
//       tip: "100% recyclable forever!"
//     },
//     { 
//       icon: "🍼", 
//       title: "Plastic Bottles", 
//       fact: "Takes 450-1000 years to decompose",
//       tip: "Can be recycled 7-9 times"
//     },
//     { 
//       icon: "🍾", 
//       title: "Glass Bottles", 
//       fact: "Takes 1 million years to decompose",
//       tip: "Infinitely recyclable!"
//     },
//     { 
//       icon: "📦", 
//       title: "Cardboard", 
//       fact: "Takes 2 months to decompose",
//       tip: "Made from 90% recycled materials"
//     },
//   ];

//   return (
//     <div className="flex flex-col">
//       {/* 5 R's & Flipcards Section */}
//       <div className="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen bg-green-100 relative overflow-hidden p-3 md:p-5">
//         <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-1 max-w-7xl w-full">
          
//           {/* Logo */}
//           <div className="flex-shrink-0 mb-6 lg:mb-0">
//             <div
//               className="w-32 h-32 md:w-40 md:h-40 rounded-full cursor-pointer hover:scale-105 transition-all duration-500 overflow-hidden bg-green-600 text-white flex items-center justify-center text-center text-sm md:text-lg font-semibold shadow-lg"
//               onClick={() => {
//                 toggleCards();
//                 setIsRotating(true);
//                 setTimeout(() => setIsRotating(false), 400);
//               }}
//             >
//               <div className={`transition-transform duration-700 ${isRotating ? "rotate-180" : ""}`}>
//                 <span>
//                   5 R's
//                   <br />
//                   of
//                   <br />
//                   Recycling
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Cards Container */}
//           <div className="flex-1 max-w-4xl">
//             <div className="relative w-full" style={{ minHeight: "320px" }}>
//               {/* Desktop Layout */}
//               <div className="hidden md:block">
//                 <div className="absolute top-0 left-0 flex gap-8 lg:gap-16 justify-center w-full">
//                   {["Reduce", "Repurpose", "Recycle"].map((label, index) => (
//                     <div
//                       key={index}
//                       ref={(el) => (cardsRef.current[index] = el)}
//                       className="w-32 h-32 lg:w-40 lg:h-40 relative cursor-pointer transition-transform duration-700"
//                       style={{ perspective: "1000px" }}
//                       onClick={(e) => handleCardClick(e, index)}
//                     >
//                       <div
//                         className="card-inner relative w-full h-full transition-transform duration-700"
//                         style={{ transformStyle: "preserve-3d" }}
//                       >
//                         <div
//                           className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center text-black font-semibold shadow-md text-sm lg:text-base"
//                           style={{ backfaceVisibility: "hidden" }}
//                         >
//                           <div className="text-2xl lg:text-3xl mb-2">{fiveRs[index].image}</div>
//                           {label}
//                         </div>
//                         <div
//                           className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md text-sm lg:text-base text-center p-2"
//                           style={{
//                             transform: "rotateY(180deg)",
//                             backfaceVisibility: "hidden",
//                           }}
//                         >
//                           {fiveRs[index].back}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="absolute bottom-0 left-16 lg:left-20 flex gap-8 lg:gap-16">
//                   {["Refuse", "Reuse"].map((label, index) => (
//                     <div
//                       key={index + 3}
//                       ref={(el) => (cardsRef.current[index + 3] = el)}
//                       className="w-32 h-32 lg:w-40 lg:h-40 relative cursor-pointer transition-transform duration-700"
//                       style={{ perspective: "1000px" }}
//                       onClick={(e) => handleCardClick(e, index + 3)}
//                     >
//                       <div
//                         className="card-inner relative w-full h-full transition-transform duration-700"
//                         style={{ transformStyle: "preserve-3d" }}
//                       >
//                         <div
//                           className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center text-black font-semibold shadow-md text-sm lg:text-base"
//                           style={{ backfaceVisibility: "hidden" }}
//                         >
//                           <div className="text-2xl lg:text-3xl mb-2">{fiveRs[index + 3].image}</div>
//                           {label}
//                         </div>
//                         <div
//                           className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md text-sm lg:text-base text-center p-2"
//                           style={{
//                             transform: "rotateY(180deg)",
//                             backfaceVisibility: "hidden",
//                           }}
//                         >
//                           {fiveRs[index + 3].back}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Mobile Layout */}
//               <div className="block md:hidden">
//                 <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
//                   {fiveRs.map((item, index) => (
//                     <div
//                       key={index}
//                       ref={(el) => (cardsRef.current[index] = el)}
//                       className="w-32 h-32 relative cursor-pointer transition-transform duration-700"
//                       style={{ perspective: "1000px" }}
//                       onClick={(e) => handleCardClick(e, index)}
//                     >
//                       <div
//                         className="card-inner relative w-full h-full transition-transform duration-700"
//                         style={{ transformStyle: "preserve-3d" }}
//                       >
//                         <div
//                           className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center text-black font-semibold shadow-md text-sm"
//                           style={{ backfaceVisibility: "hidden" }}
//                         >
//                           <div className="text-2xl mb-2">{item.image}</div>
//                           {item.label}
//                         </div>
//                         <div
//                           className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md text-sm text-center p-2"
//                           style={{
//                             transform: "rotateY(180deg)",
//                             backfaceVisibility: "hidden",
//                           }}
//                         >
//                           {item.back}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Facts Section */}
//           <div className="flex-shrink-0 w-full lg:w-auto lg:ml-8 mt-8 lg:mt-0">
//             <div className="flex flex-col gap-6 max-w-sm mx-auto lg:mx-0">
//               {/* Recycling Tips */}
//               <div className="bg-green-50 border-l-4 border-green-500 p-4 lg:p-6 rounded-lg shadow-md">
//                 <h3 className="text-lg lg:text-xl font-bold text-green-800 mb-3 lg:mb-4">
//                   ♻️ Recycling Tips
//                 </h3>
//                 <ul className="space-y-2 text-green-700 text-sm lg:text-base">
//                   <li className="flex items-start">
//                     <span className="text-green-600 mr-2">•</span>
//                     <span>Rinse containers before tossing.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-green-600 mr-2">•</span>
//                     <span>Flatten boxes to save space.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-green-600 mr-2">•</span>
//                     <span>Never mix wet and dry waste.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-green-600 mr-2">•</span>
//                     <span>Find your local recycling centers.</span>
//                   </li>
//                 </ul>
//               </div>

//               {/* Impact Statistics */}
//               <div className="bg-blue-50 border-l-4 border-blue-500 p-4 lg:p-6 rounded-lg shadow-md">
//                 <h3 className="text-lg lg:text-xl font-bold text-blue-800 mb-3 lg:mb-4">
//                   📊 Impact Statistics
//                 </h3>
//                 <p className="text-blue-700 mb-3 text-xs lg:text-sm font-medium">
//                   How much energy/resources recycling saves:
//                 </p>
//                 <ul className="space-y-2 text-blue-700 text-sm lg:text-base">
//                   <li className="flex items-start">
//                     <span className="text-blue-600 mr-2">•</span>
//                     <span>1 recycled can = energy to power a TV for 3 hours.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-blue-600 mr-2">•</span>
//                     <span>Recycling one ton of paper = saves 17 trees.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-blue-600 mr-2">•</span>
//                     <span>Recycling plastic bottles saves 70% energy vs. making new ones.</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="text-blue-600 mr-2">•</span>
//                     <span>Glass can be recycled endlessly without quality loss.</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TIMELINE ANIMATION */}
//       <div
//         ref={timelineContainerRef}
//         className="relative w-full bg-green-200 overflow-visible"
//         style={{ height: "2000px" }}
//       >
//         {/* Responsive SVG Path */}
//         <svg
//           width="100%"
//           height="100%"
//           viewBox="0 0 400 2000"
//           className="absolute left-0 top-0 z-20 pointer-events-none"
//           preserveAspectRatio="none"
//         >
//           <path
//             ref={pathRef}
//             d="M 200 100 C 250 200, 300 300, 200 400 S 100 600, 200 700 S 300 900, 200 1000 S 100 1200, 200 1300 S 300 1500, 200 1600 S 100 1800, 200 1900"
//             stroke="black"
//             strokeWidth="3"
//             fill="none"
//             strokeDasharray="10,10"
//           />
//         </svg>

//         {/* Moving Pointer */}
//         <div
//           ref={logoRef}
//           className="w-4 h-4 md:w-6 md:h-6 bg-black rounded-full absolute z-30 shadow-xl"
//           style={{ transform: "translate(-50%, -50%)" }}
//         />

//         {/* Information Cards positioned above the path */}
//         {checkpoints.map((checkpoint, i) => (
//           <div
//             key={`info-card-${i}`}
//             ref={(el) => (imageRefs.current[i] = el)}
//             className="absolute z-40 bg-white px-3 py-2 md:px-4 md:py-3 rounded-lg shadow-lg border-2 border-red-400 opacity-30 transition-opacity duration-500 max-w-xs"
//             style={{ transform: "translate(-50%, -120%)" }}
//           >
//             <div className="text-center">
//               <div className="text-2xl md:text-3xl mb-2">{checkpoint.icon}</div>
//               <div className="font-bold text-sm md:text-base text-gray-800 mb-1">
//                 {checkpoint.title}
//               </div>
//               <div className="text-xs md:text-sm text-red-600 font-semibold mb-1">
//                 ⏰ {checkpoint.fact}
//               </div>
//               <div className="text-xs md:text-sm text-green-600 font-medium">
//                 ♻️ {checkpoint.tip}
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Simple Path Markers */}
//         {checkpoints.map((checkpoint, i) => (
//           <div
//             key={`marker-${i}`}
//             ref={(el) => (checkpointRefs.current[i] = el)}
//             className="absolute z-40 w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full border-2 border-white shadow-md opacity-30 transition-opacity duration-500"
//             style={{ transform: "translate(-50%, -50%)" }}
//           />
//         ))}

//         {/* Instructions for mobile */}
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm text-center z-50">
//           🌍 Scroll to discover decomposition times & recycling facts!
//         </div>
//       </div>

//       <style jsx>{`
//         .flipped {
//           transform: rotateY(180deg);
//         }
        
//         @media (max-width: 768px) {
//           .grid-cols-2 > div:nth-child(5) {
//             grid-column: 1 / -1;
//             justify-self: center;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
