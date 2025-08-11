"use client";
import React, { useState } from "react";

export default function RecyclingGuide() {
  const [activeCategory, setActiveCategory] = useState("plastic");

  const recyclingData = {
    plastic: {
      title: "Plastic Items",
      color: "bg-blue-50 border-blue-200",
      items: [
        {
          name: "Bottles & Containers",
          steps: ["Remove caps and labels", "Rinse thoroughly", "Place in recycling bin"],
          icon: "🟦"
        },
        {
          name: "Food Packaging",
          steps: ["Clean off food residue", "Check recycling number", "Sort by type"],
          icon: "🟦"
        }
      ]
    },
    paper: {
      title: "Paper Products",
      color: "bg-green-50 border-green-200",
      items: [
        {
          name: "Newspapers & Magazines",
          steps: ["Remove plastic wrapping", "Keep dry and clean", "Bundle together"],
          icon: "🟩"
        },
        {
          name: "Cardboard Boxes",
          steps: ["Remove tape and staples", "Flatten boxes", "Keep clean and dry"],
          icon: "🟩"
        }
      ]
    },
    glass: {
      title: "Glass Materials",
      color: "bg-amber-50 border-amber-200",
      items: [
        {
          name: "Jars & Bottles",
          steps: ["Remove lids and labels", "Rinse clean", "Sort by color if required"],
          icon: "🟨"
        }
      ]
    },
    metal: {
      title: "Metal Objects",
      color: "bg-gray-50 border-gray-200",
      items: [
        {
          name: "Aluminum Cans",
          steps: ["Empty completely", "Rinse if needed", "Crush to save space"],
          icon: "⬜"
        },
        {
          name: "Steel Containers",
          steps: ["Remove labels", "Clean thoroughly", "Check for magnetic properties"],
          icon: "⬜"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="py-16 px-8 text-center border-b border-gray-100">
        <h1 className="text-4xl font-light text-gray-900 mb-4">
          How to Recycle Objects
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A simple visual guide to properly prepare and sort your recyclable materials
        </p>
      </header>

      {/* Category Navigation */}
      <nav className="py-8 px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(recyclingData).map(([key, category]) => (
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
          <div className={`rounded-2xl p-8 ${recyclingData[activeCategory].color}`}>
            <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
              {recyclingData[activeCategory].title}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {recyclingData[activeCategory].items.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mr-4">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">{item.name}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {item.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start">
                        <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                          {stepIndex + 1}
                        </div>
                        <p className="text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Tips Section */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">
              General Recycling Tips
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-400 rounded"></div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Clean First</h3>
                <p className="text-gray-600 text-sm">Always clean containers before recycling to avoid contamination</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-yellow-300 rounded-full"></div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Check Locally</h3>
                <p className="text-gray-600 text-sm">Recycling rules vary by location, check your local guidelines</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-orange-300 rounded-sm"></div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Sort Properly</h3>
                <p className="text-gray-600 text-sm">Separate materials correctly to ensure effective recycling</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-gray-100 text-center">
        <p className="text-gray-500">
          Remember: When in doubt, check with your local recycling center
        </p>
      </footer>
    </div>
  );
}

// import React, { useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// // Register GSAP plugins
// gsap.registerPlugin(ScrollTrigger);

// export default function HorizontalScrollPage() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useGSAP(
//     () => {
//       //ScrollTrigger.kill(); // Prevent duplicate triggers (especially in React 18 dev mode)
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

//       const sections = gsap.utils.toArray<HTMLElement>(".panel");
//       const container = containerRef.current;

//       if (!container || sections.length === 0) return;

//       gsap.to(sections, {
//         xPercent: -100 * (sections.length - 1),
//         ease: "none",
//         scrollTrigger: {
//           trigger: container,
//           pin: true,
//           scrub: 1,
//           snap: 1 / (sections.length - 1),
//           end: () => `+=${container.offsetWidth}`,
//           //end: () => `+=${container.scrollWidth - container.offsetWidth}`,

//           markers: false, // Debug: remove in production
//         },
//       });
//     },
//     { scope: containerRef } 
//   );

//   return (
//     <div className="h-screen overflow-hidden" ref={containerRef}>
//       <div className="flex-grow flex items-center justify-center">
//         <h1 className="text-black text-6xl text-center">
//           Non_Recyclability_Blunder
//         </h1>
//       </div>
//       <div className="flex w-[400vw] h-[90vh]">
//         {/* Panel 1 */}
//         <div className="panel w-screen h-full flex items-center justify-center bg-green-800 p-8">
//           <div>
//             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
//               🌊 The Great Pacific Garbage Patch
//             </h1>
//             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
//               <li>
//                 <strong>Location:</strong> Pacific Ocean (between Hawaii and
//                 California)
//               </li>
//               <li>
//                 <strong>Problem:</strong> Massive accumulation of non-recyclable
//                 plastics like microplastics, fishing nets, and packaging.
//               </li>
//               <li>
//                 <strong>Impact:</strong>
//                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
//                   <li>
//                     Over <strong>1.8 trillion pieces</strong> of plastic
//                     covering <strong>1.6 million km²</strong>
//                   </li>
//                   <li>
//                     Marine animals ingest or get entangled in plastic → Over{" "}
//                     <strong>1 million seabirds</strong> &{" "}
//                     <strong>100,000 marine mammals</strong> die annually
//                   </li>
//                   <li>
//                     Plastics don't biodegrade; they break down into
//                     microplastics, entering the food chain
//                   </li>
//                 </ul>
//               </li>
//               <li>
//                 <strong>Lesson:</strong> Lack of recycling infrastructure and
//                 poor product design cause severe long-term environmental harm.
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Panel 2 */}
//         <div className="panel w-screen h-full flex items-center justify-center bg-green-600 p-8">
//           <div>
//             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
//               🧃 Multilayer Packaging in India
//             </h1>
//             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
//               <li>
//                 <strong>Location:</strong> Urban & rural India
//               </li>
//               <li>
//                 <strong>Problem:</strong> Use of multi-layered flexible
//                 packaging (e.g., chips packets)
//               </li>
//               <li>
//                 <strong>Impact:</strong>
//                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
//                   <li>
//                     Plastic + metal foil combo makes recycling nearly impossible
//                   </li>
//                   <li>
//                     Littered everywhere — clog drains, harm cattle, and pollute
//                     landfills
//                   </li>
//                   <li>Recycling rate is less than 5%</li>
//                 </ul>
//               </li>
//               <li>
//                 Product packaging that prioritizes shelf life over recyclability
//                 creates large-scale waste.
//               </li>
//               <li>
//                 {" "}
//                 <strong>Lesson:</strong> Product packaging that prioritizes
//                 shelf life over recyclability creates large-scale waste.
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Panel 3 */}
//         <div className="panel w-screen h-full flex items-center justify-center bg-green-400 p-8">
//           <div>
//             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
//               🍼 Disposable Diapers in Landfills
//             </h1>
//             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
//               <li>
//                 <strong>Location:</strong> Global (focus on US & Europe)
//               </li>
//               <li>
//                 <strong>Problem:</strong> Diapers made of mixed plastics +
//                 absorbents
//               </li>
//               <li>
//                 <strong>Impact:</strong>
//                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
//                   <li>
//                     Avg. baby uses 6,000 diapers → 20B/year in US landfills
//                   </li>
//                   <li>Takes up to 500 years to decompose</li>
//                   <li>Microplastics enter the food chain</li>
//                 </ul>
//               </li>
//               <li>
//                 <strong>Lesson:</strong> Poor design + lack of recycling causes
//                 long-term damage
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Panel 4 */}
//         <div className="panel w-screen h-full flex items-center justify-center bg-green-200 p-8">
//           <div>
//             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
//               ♻️ E-Waste in Agbogbloshie, Ghana
//             </h1>
//             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
//               <li>
//                 <strong>Location:</strong> Agbogbloshie, Accra, Ghana
//               </li>
//               <li>
//                 <strong>Problem:</strong> Dumping of non-recyclable electronic
//                 waste
//               </li>
//               <li>
//                 <strong>Impact:</strong>
//                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
//                   <li>Locals burn e-waste → toxic fumes</li>
//                   <li>Air, water, soil pollution</li>
//                   <li>Children exposed to neurotoxic substances</li>
//                 </ul>
//               </li>
//               <li>
//                 <strong>Lesson:</strong> Weak global recycling standards cause
//                 harm to vulnerable communities
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// //MY_CODE
// // "use client";

// // import React, { useRef } from "react";
// // import gsap from "gsap";
// // import { ScrollTrigger } from "gsap/ScrollTrigger";
// // import { useGSAP } from "@gsap/react";

// // gsap.registerPlugin(ScrollTrigger, useGSAP); // Register all plugins

// // export default function HorizontalScrollPage() {
// //   const containerRef = useRef<HTMLDivElement>(null);

// //   useGSAP(
// //     () => {
// //       const sections = gsap.utils.toArray<HTMLElement>(".panel");
// //       const container = containerRef.current;

// //       if (!container) return;

// //       gsap.to(sections, {
// //         xPercent: -100 * (sections.length - 1),
// //         ease: "none",
// //         scrollTrigger: {
// //           trigger: container,
// //           pin: true,
// //           scrub: 1,
// //           snap: 1 / (sections.length - 1),
// //           end: () => `+=${container.offsetWidth}`,
// //           markers: true, // Helpful for debugging (remove in production)
// //         },
// //       });
// //     },
// //     { scope: containerRef }
// //   );

// //   return (
// //     <div className="h-screen overflow-hidden" ref={containerRef}>
// //       <div className="flex w-[400vw] h-screen">
// //         {/* Red Panel - Pacific Garbage Patch */}
// //         <div className="flex max-w-4xl p-8 items-center justify-center min-h-screen w-screen bg-blue-400 px-6 py-12">

// //             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
// //               🌊 The Great Pacific Garbage Patch
// //             </h1>

// //             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
// //               <li>
// //                 <strong>Location:</strong> Pacific Ocean (between Hawaii and
// //                 California)
// //               </li>
// //               <li>
// //                 <strong>Problem:</strong> Massive accumulation of non-recyclable
// //                 plastics like microplastics, fishing nets, and packaging.
// //               </li>
// //               <li>
// //                 <strong>Impact:</strong>
// //                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
// //                   <li>
// //                     Over <strong>1.8 trillion pieces</strong> of plastic
// //                     covering <strong>1.6 million km²</strong>
// //                   </li>
// //                   <li>
// //                     Marine animals ingest or get entangled in plastic → Over{" "}
// //                     <strong>1 million seabirds</strong> &{" "}
// //                     <strong>100,000 marine mammals</strong> die annually
// //                   </li>
// //                   <li>
// //                     Plastics don't biodegrade; they break down into
// //                     microplastics, entering the food chain
// //                   </li>
// //                 </ul>
// //               </li>
// //               <li>
// //                 <strong>Lesson:</strong> Lack of recycling infrastructure and
// //                 poor product design cause severe long-term environmental harm.
// //               </li>
// //             </ul>
// //         </div>

// //         {/* Green Panel - E-Waste */}
// //                 <div className="flex max-w-4xl p-8 items-center justify-center min-h-screen w-screen bg-grey-400 px-6 py-12">

// //             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
// //               🌊 Multilayer Packaging in India
// //             </h1>

// //             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
// //               <li>
// //                 <strong>Location:</strong> Urban & rural India
// //               </li>
// //               <li>
// //                 <strong>Problem:</strong>Widespread use of multi-layered flexible packaging (e.g., chips packets, instant noodles)
// //               </li>
// //               <li>
// //                 <strong>Impact:</strong>
// //                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
// //                   <li>
// //                     These packets mix plastic + metal foil, making them nearly impossible to recycle
// //                   </li>
// //                   <li>
// //                     Littered everywhere — clog drains, harm cattle, and pollute landfills
// //                   </li>
// //                   <li>
// //                     Recycling rate of these materials is less than 5%
// //                   </li>
// //                 </ul>
// //               </li>
// //               <li>
// //                  Product packaging that prioritizes shelf life over recyclability creates large-scale waste.
// //               </li>
// //             </ul>
// //         </div>

// //         {/* Blue Panel - Multilayer Packaging */}
// //                 <div className="flex max-w-4xl p-8 items-center justify-center min-h-screen w-screen bg-purple-400 px-6 py-12">

// //             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
// //               🌊 Disposable Diapers in Landfills (USA & Global)
// //             </h1>

// //             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
// //               <li>
// //                 <strong>Location:</strong> Global (with a focus on US & Europe)
// //               </li>
// //               <li>
// //                 <strong>Problem:</strong> Disposable diapers are made from a mix of plastics, superabsorbents, and fibers
// //               </li>
// //               <li>
// //                 <strong>Impact:</strong>
// //                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
// //                   <li>
// //                     An average baby uses 6,000 diapers → 20 billion diapers in U.S. landfills per year
// //                   </li>
// //                   <li>
// //                     Takes up to 500 years to decompose
// //                   </li>
// //                   <li>
// //                     Plastics don't biodegrade; they break down into
// //                     microplastics, entering the food chain
// //                   </li>
// //                 </ul>
// //               </li>
// //               <li>
// //                 <strong>Lesson:</strong> Lack of recycling infrastructure and
// //                 poor product design cause severe long-term environmental harm.
// //               </li>
// //             </ul>
// //         </div>

// //         {/* Pink Panel - Diapers */}
// //          <div className="flex max-w-4xl p-8 items-center justify-center min-h-screen w-screen bg-green-500 px-6 py-12">

// //             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
// //               🌊 E-Waste in Agbogbloshie, Ghana
// //             </h1>

// //             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
// //               <li>
// //                 <strong>Location:</strong> Agbogbloshie, Accra, Ghana
// //               </li>
// //               <li>
// //                 <strong>Problem:</strong> Dumping of non-recyclable electronic waste (TVs, computers, phones) from developed countries
// //               </li>
// //               <li>
// //                 <strong>Impact:</strong>
// //                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
// //                   <li>
// //                     Locals burn e-waste to extract metals → release of toxic chemicals like lead and mercury
// //                   </li>
// //                   <li>
// //                     Air, water, and soil pollution, severely affecting community health
// //                   </li>
// //                   <li>
// //                     Children exposed to neurotoxic substances during dismantling
// //                   </li>
// //                 </ul>
// //               </li>
// //               <li>
// //                 <strong>Lesson:</strong> Inadequate global e-waste recycling standards create hazardous zones in vulnerable communities.
// //               </li>
// //             </ul>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
