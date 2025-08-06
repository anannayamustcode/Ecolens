"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      //ScrollTrigger.kill(); // Prevent duplicate triggers (especially in React 18 dev mode)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      const sections = gsap.utils.toArray<HTMLElement>(".panel");
      const container = containerRef.current;

      if (!container || sections.length === 0) return;

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => `+=${container.offsetWidth}`,
          //end: () => `+=${container.scrollWidth - container.offsetWidth}`,

          markers: false, // Debug: remove in production
        },
      });
    },
    { scope: containerRef } 
  );

  return (
    <div className="h-screen overflow-hidden" ref={containerRef}>
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-black text-6xl text-center">
          Non_Recyclability_Blunder
        </h1>
      </div>
      <div className="flex w-[400vw] h-[90vh]">
        {/* Panel 1 */}
        <div className="panel w-screen h-full flex items-center justify-center bg-green-800 p-8">
          <div>
            <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
              🌊 The Great Pacific Garbage Patch
            </h1>
            <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
              <li>
                <strong>Location:</strong> Pacific Ocean (between Hawaii and
                California)
              </li>
              <li>
                <strong>Problem:</strong> Massive accumulation of non-recyclable
                plastics like microplastics, fishing nets, and packaging.
              </li>
              <li>
                <strong>Impact:</strong>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
                  <li>
                    Over <strong>1.8 trillion pieces</strong> of plastic
                    covering <strong>1.6 million km²</strong>
                  </li>
                  <li>
                    Marine animals ingest or get entangled in plastic → Over{" "}
                    <strong>1 million seabirds</strong> &{" "}
                    <strong>100,000 marine mammals</strong> die annually
                  </li>
                  <li>
                    Plastics don't biodegrade; they break down into
                    microplastics, entering the food chain
                  </li>
                </ul>
              </li>
              <li>
                <strong>Lesson:</strong> Lack of recycling infrastructure and
                poor product design cause severe long-term environmental harm.
              </li>
            </ul>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="panel w-screen h-full flex items-center justify-center bg-green-600 p-8">
          <div>
            <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
              🧃 Multilayer Packaging in India
            </h1>
            <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
              <li>
                <strong>Location:</strong> Urban & rural India
              </li>
              <li>
                <strong>Problem:</strong> Use of multi-layered flexible
                packaging (e.g., chips packets)
              </li>
              <li>
                <strong>Impact:</strong>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
                  <li>
                    Plastic + metal foil combo makes recycling nearly impossible
                  </li>
                  <li>
                    Littered everywhere — clog drains, harm cattle, and pollute
                    landfills
                  </li>
                  <li>Recycling rate is less than 5%</li>
                </ul>
              </li>
              <li>
                Product packaging that prioritizes shelf life over recyclability
                creates large-scale waste.
              </li>
              <li>
                {" "}
                <strong>Lesson:</strong> Product packaging that prioritizes
                shelf life over recyclability creates large-scale waste.
              </li>
            </ul>
          </div>
        </div>

        {/* Panel 3 */}
        <div className="panel w-screen h-full flex items-center justify-center bg-green-400 p-8">
          <div>
            <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
              🍼 Disposable Diapers in Landfills
            </h1>
            <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
              <li>
                <strong>Location:</strong> Global (focus on US & Europe)
              </li>
              <li>
                <strong>Problem:</strong> Diapers made of mixed plastics +
                absorbents
              </li>
              <li>
                <strong>Impact:</strong>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
                  <li>
                    Avg. baby uses 6,000 diapers → 20B/year in US landfills
                  </li>
                  <li>Takes up to 500 years to decompose</li>
                  <li>Microplastics enter the food chain</li>
                </ul>
              </li>
              <li>
                <strong>Lesson:</strong> Poor design + lack of recycling causes
                long-term damage
              </li>
            </ul>
          </div>
        </div>

        {/* Panel 4 */}
        <div className="panel w-screen h-full flex items-center justify-center bg-green-200 p-8">
          <div>
            <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
              ♻️ E-Waste in Agbogbloshie, Ghana
            </h1>
            <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
              <li>
                <strong>Location:</strong> Agbogbloshie, Accra, Ghana
              </li>
              <li>
                <strong>Problem:</strong> Dumping of non-recyclable electronic
                waste
              </li>
              <li>
                <strong>Impact:</strong>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
                  <li>Locals burn e-waste → toxic fumes</li>
                  <li>Air, water, soil pollution</li>
                  <li>Children exposed to neurotoxic substances</li>
                </ul>
              </li>
              <li>
                <strong>Lesson:</strong> Weak global recycling standards cause
                harm to vulnerable communities
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

//MY_CODE
// "use client";

// import React, { useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(ScrollTrigger, useGSAP); // Register all plugins

// export default function HorizontalScrollPage() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useGSAP(
//     () => {
//       const sections = gsap.utils.toArray<HTMLElement>(".panel");
//       const container = containerRef.current;

//       if (!container) return;

//       gsap.to(sections, {
//         xPercent: -100 * (sections.length - 1),
//         ease: "none",
//         scrollTrigger: {
//           trigger: container,
//           pin: true,
//           scrub: 1,
//           snap: 1 / (sections.length - 1),
//           end: () => `+=${container.offsetWidth}`,
//           markers: true, // Helpful for debugging (remove in production)
//         },
//       });
//     },
//     { scope: containerRef }
//   );

//   return (
//     <div className="h-screen overflow-hidden" ref={containerRef}>
//       <div className="flex w-[400vw] h-screen">
//         {/* Red Panel - Pacific Garbage Patch */}
//         <div className="flex max-w-4xl p-8 items-center justify-center min-h-screen w-screen bg-blue-400 px-6 py-12">

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
//         </div>

//         {/* Green Panel - E-Waste */}
//                 <div className="flex max-w-4xl p-8 items-center justify-center min-h-screen w-screen bg-grey-400 px-6 py-12">

//             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
//               🌊 Multilayer Packaging in India
//             </h1>

//             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
//               <li>
//                 <strong>Location:</strong> Urban & rural India
//               </li>
//               <li>
//                 <strong>Problem:</strong>Widespread use of multi-layered flexible packaging (e.g., chips packets, instant noodles)
//               </li>
//               <li>
//                 <strong>Impact:</strong>
//                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
//                   <li>
//                     These packets mix plastic + metal foil, making them nearly impossible to recycle
//                   </li>
//                   <li>
//                     Littered everywhere — clog drains, harm cattle, and pollute landfills
//                   </li>
//                   <li>
//                     Recycling rate of these materials is less than 5%
//                   </li>
//                 </ul>
//               </li>
//               <li>
//                  Product packaging that prioritizes shelf life over recyclability creates large-scale waste.
//               </li>
//             </ul>
//         </div>

//         {/* Blue Panel - Multilayer Packaging */}
//                 <div className="flex max-w-4xl p-8 items-center justify-center min-h-screen w-screen bg-purple-400 px-6 py-12">

//             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
//               🌊 Disposable Diapers in Landfills (USA & Global)
//             </h1>

//             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
//               <li>
//                 <strong>Location:</strong> Global (with a focus on US & Europe)
//               </li>
//               <li>
//                 <strong>Problem:</strong> Disposable diapers are made from a mix of plastics, superabsorbents, and fibers
//               </li>
//               <li>
//                 <strong>Impact:</strong>
//                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
//                   <li>
//                     An average baby uses 6,000 diapers → 20 billion diapers in U.S. landfills per year
//                   </li>
//                   <li>
//                     Takes up to 500 years to decompose
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
//         </div>

//         {/* Pink Panel - Diapers */}
//          <div className="flex max-w-4xl p-8 items-center justify-center min-h-screen w-screen bg-green-500 px-6 py-12">

//             <h1 className="text-5xl font-extrabold text-black mb-8 text-center">
//               🌊 E-Waste in Agbogbloshie, Ghana
//             </h1>

//             <ul className="list-disc list-inside text-lg text-gray-800 space-y-4">
//               <li>
//                 <strong>Location:</strong> Agbogbloshie, Accra, Ghana
//               </li>
//               <li>
//                 <strong>Problem:</strong> Dumping of non-recyclable electronic waste (TVs, computers, phones) from developed countries
//               </li>
//               <li>
//                 <strong>Impact:</strong>
//                 <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-base">
//                   <li>
//                     Locals burn e-waste to extract metals → release of toxic chemicals like lead and mercury
//                   </li>
//                   <li>
//                     Air, water, and soil pollution, severely affecting community health
//                   </li>
//                   <li>
//                     Children exposed to neurotoxic substances during dismantling
//                   </li>
//                 </ul>
//               </li>
//               <li>
//                 <strong>Lesson:</strong> Inadequate global e-waste recycling standards create hazardous zones in vulnerable communities.
//               </li>
//             </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
