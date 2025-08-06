"use client";
import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, useGSAP);

const fiveRs = [
  { label: "Reduce", back: "Consume Less", image: "reduce_symbol.png" },
  { label: "Repurpose", back: "Give New Life", image: "repurpose_symbol.png" },
  { label: "Refuse", back: "Say No to Waste", image: "refuse_symbol.png" },
  { label: "Reuse", back: "Use Again", image: "reuse_symbol.png" },
  { label: "Recycle", back: "Reprocess It", image: "recycle_symbol.png" },
];

export default function RecyclablePage() {
  const cardsRef = useRef([]);
  const [showCards, setShowCards] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const toggleCards = () => setShowCards((prev) => !prev);
  const logoRef = useRef(null);
  const pathRef = useRef(null);
  const imageRefs = useRef([]);
  const timelineContainerRef = useRef(null);
  const checkpointRefs = useRef([]);
  const [isRotating, setIsRotating] = useState(false);

  // Animate the dot along the path using GSAP
  useGSAP(
    () => {
      if (!logoRef.current || !pathRef.current || !timelineContainerRef.current)
        return;

      const path = pathRef.current;
      const pathLength = path.getTotalLength();

      // Position checkpoints along the path
      const percentages = [0.2, 0.4, 0.6, 0.8, 1.0];
      percentages.forEach((percent, i) => {
        const point = path.getPointAtLength(percent * pathLength);
        const checkpoint = checkpointRefs.current[i];
        const image = imageRefs.current[i];

        if (checkpoint) {
          gsap.set(checkpoint, {
            x: point.x,
            y: point.y,
            xPercent: -50,
            yPercent: -50,
          });
        }

        // Position images at the same points
        if (image) {
          gsap.set(image, {
            x: point.x,
            y: point.y,
            xPercent: -50,
            yPercent: -50,
          });
        }
      });

      // Create animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineContainerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            // Show checkpoints and images as we scroll
            percentages.forEach((percent, i) => {
              if (progress >= percent) {
                if (checkpointRefs.current[i]) {
                  gsap.set(checkpointRefs.current[i], { opacity: 1 });
                }
                if (imageRefs.current[i]) {
                  gsap.set(imageRefs.current[i], { opacity: 1 });
                }
              }
            });
          },
        },
      });

      // Animate dot along path
      tl.to(logoRef.current, {
        motionPath: {
          path: path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        ease: "none",
      });
    },
    { scope: timelineContainerRef }
  );
  // Card animation effects
  useEffect(() => {
    if (showCards) {
      cardsRef.current.forEach((card, i) => {
        if (card) {
          const delay = i * 0.4;
          card.style.opacity = "0";
          card.style.transform = "translateY(-30px)";
          setTimeout(() => {
            card.style.transition =
              "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            card.style.opacity = "1";
            card.style.transform = "translateY(0px)";
          }, delay * 100);
        }
      });
    } else {
      cardsRef.current.forEach((card) => {
        if (card) {
          card.style.transition = "all 0.4s ease-in-out";
          card.style.opacity = "0";
        }
      });
    }
  }, [showCards]);

  const handleCardClick = (e, index) => {
    const innerCard = e.currentTarget.querySelector(".card-inner");
    innerCard?.classList.toggle("flipped");
    setActiveCardIndex(activeCardIndex === index ? null : index);
  };
  const checkpoints = [
    { icon: "📄", text: "Paper Products", image: "paper.png" },
    { icon: "🥫", text: "Aluminum Cans", image: "aluminum.png" },
    { icon: "🍼", text: "Plastic Bottles", image: "plastic.png" },
    { icon: "🍾", text: "Glass Bottles", image: "glass.png" },
    { icon: "📦", text: "Cardboard", image: "cardboard.png" },
  ];
  return (
    <div className="flex flex-col">
      {/* 5 R's & Flipcards Section */}
      <div className="flex items-center justify-center w-full min-h-screen bg-green-100 relative overflow-hidden p-5">
        <div className="flex items-center gap-1 max-w-7xl">
          <div
            className="w-40 h-40 rounded-full cursor-pointer hover:scale-105 transition-all duration-500 overflow-hidden"
            onClick={toggleCards}
          >
            <Image
              src="/assets/images/3R.png"
              alt="Recyclable Logo"
              width={160}
              height={160}
              //className="object-cover rounded-full"
              className={`object-cover rounded-full cursor-pointer transition-transform duration-700 ${
                isRotating ? "rotate-360" : ""
              }`}
              onClick={() => {
                setIsRotating(true);
                // Reset rotation after animation completes
                setTimeout(() => setIsRotating(false), 400);
              }}
            />
          </div>

          {/* Zigzag cards container */}
          <div
            className="relative"
            style={{ width: "1000px", height: "400px" }}
          >
            <div className="absolute top-0 left-0 flex gap-16">
              {["Reduce", "Repurpose", "Recycle"].map((label, index) => (
                <div
                  key={index}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="w-40 h-40 relative cursor-pointer transition-transform duration-700"
                  style={{ perspective: "1000px" }}
                  onClick={(e) => handleCardClick(e, index)}
                >
                  <div
                    className="card-inner relative w-full h-full transition-transform duration-700"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center text-black font-semibold shadow-md"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <Image
                        //src={`/assets/images/plant.png`}
                        src={`/assets/images/${fiveRs[index].image}`}
                        alt={`${label} icon`}
                        width={60}
                        height={60}
                        className="mb-2"
                      />
                      {label}
                    </div>
                    <div
                      className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {fiveRs[index].back}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-20 flex gap-16">
              {["Refuse", "Reuse"].map((label, index) => (
                <div
                  key={index + 3}
                  ref={(el) => (cardsRef.current[index + 3] = el)}
                  className="w-40 h-40 relative cursor-pointer transition-transform duration-700"
                  style={{ perspective: "1000px" }}
                  onClick={(e) => handleCardClick(e, index + 3)}
                >
                  <div
                    className="card-inner relative w-full h-full transition-transform duration-700"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center text-black font-semibold shadow-md"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <Image
                        //src={`/assets/images/waste-management.png`}
                        src={`/assets/images/${fiveRs[index + 3].image}`}
                        alt={`${label} icon`}
                        width={60}
                        height={60}
                        className="mb-2"
                      />
                      {label}
                    </div>
                    <div
                      className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {fiveRs[index + 3].back}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facts Section on the right */}
          <div className="flex flex-col justify-center ml-16 max-w-sm">
            {/* Upper Half: Recycling Tips */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                ♻️ Recycling Tips
              </h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Rinse containers before tossing.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Flatten boxes to save space.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Never mix wet and dry waste.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Find your local recycling centers.</span>
                </li>
              </ul>
            </div>

            {/* Lower Half: Impact Statistics */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                📊 Impact Statistics
              </h3>
              <p className="text-blue-700 mb-3 text-sm font-medium">
                How much energy/resources recycling saves:
              </p>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>
                    1 recycled can = energy to power a TV for 3 hours.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Recycling one ton of paper = saves 17 trees.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>
                    Recycling plastic bottles saves 70% energy vs. making new
                    ones.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>
                    Glass can be recycled endlessly without quality loss.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE ANIMATION */}
      <div
        ref={timelineContainerRef}
        className="relative w-full h-[1800px] bg-green-200 overflow-visible"
      >
        {/* Dotted Path SVG */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 1800"
          className="absolute left-0 top-0 z-20 pointer-events-none"
        >
          <path
            ref={pathRef}
            d="M 200 50 C 250 150, 300 250, 200 350 S 100 550, 200 650 S 300 850, 200 950 S 100 1150, 200 1250 S 300 1450, 200 1550"
            stroke="black"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10,10"
          />
        </svg>

        {/* Moving Pointer */}
        <div
          ref={logoRef}
          className="w-6 h-6 bg-black rounded-full absolute z-30 shadow-xl"
          style={{ transform: "translate(-50%, -50%)" }}
        />

        {/* Images following the pointer path */}
        {checkpoints.map((checkpoint, i) => (
          <div
            key={`image-${i}`}
            ref={(el) => (imageRefs.current[i] = el)}
            className="absolute z-40 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-300 max-w-xs opacity-100"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <Image
              src={`/assets/images/${checkpoint.image}`}
              //src={`/assets/images/${timelineImages[i]}`}
              alt={`Checkpoint ${i + 1}`}
              width={80}
              height={80}
              className="rounded-lg shadow-lg"
            />
          </div>
        ))}

        {/* Checkpoints - Now perfectly aligned with path */}
        {checkpoints.map((checkpoint, i) => (
          <div
            key={i}
            ref={(el) => (checkpointRefs.current[i] = el)}
            className="absolute z-40 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-300 max-w-xs opacity-100"
          >
            <div className="font-bold text-lg">{checkpoint.icon}</div>
            <div className="text-sm mt-1">{checkpoint.text}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .flipped {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

// MY_CODE
// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const fiveRs = [
//   { label: "Reduce", back: "Consume Less" },
//   { label: "Repurpose", back: "Give New Life" },
//   { label: "Refuse", back: "Say No to Waste" },
//   { label: "Reuse", back: "Use Again" },
//   { label: "Recycle", back: "Reprocess It" },
// ];

// export default function RecyclablePage() {
//   const cardsRef = useRef([]);
//   const [showCards, setShowCards] = useState(true);
//   const [activeCardIndex, setActiveCardIndex] = useState(null);
//   const toggleCards = () => setShowCards((prev) => !prev);
//   const logoRef = useRef(null);
//   const pathRef = useRef(null);

//   // Animate the dot along the path using scroll
//   useEffect(() => {
//     const logo = logoRef.current;
//     const path = pathRef.current;
//     const container = document.querySelector('.timeline-container');

//     if (!logo || !path || !container) return;

//     const pathLength = path.getTotalLength();

//     const handleScroll = () => {
//       const scrollTop = window.pageYOffset;
//       const docHeight = document.documentElement.scrollHeight - window.innerHeight;
//       const scrollPercent = Math.min(Math.max(scrollTop / docHeight, 0), 1);

//       // Calculate position along path
//       const point = path.getPointAtLength(scrollPercent * pathLength);

//       // Get container bounds for proper positioning
//       const containerRect = container.getBoundingClientRect();
//       const containerTop = container.offsetTop;

//       // Convert SVG coordinates to actual container coordinates
//       const svgRect = path.ownerSVGElement.getBoundingClientRect();
//       const containerWidth = container.offsetWidth;
//       const scaleX = containerWidth / 400; // 400 is SVG viewBox width
//       const scaleY = 1800 / 1800; // Height ratio

//       // Update logo position with proper scaling and offset
//       logo.style.left = `${point.x * scaleX}px`;
//       logo.style.top = `${containerTop + (point.y * scaleY)}px`;
//       logo.style.position = 'absolute';
//     };

//     window.addEventListener('scroll', handleScroll);

//     // Initial position
//     handleScroll();

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

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

//   // Calculate positions along the curved path for checkpoints
//   const getPathPosition = (percentage) => {
//     if (!pathRef.current) return { x: 200, y: 50 };
//     const pathLength = pathRef.current.getTotalLength();
//     return pathRef.current.getPointAtLength(percentage * pathLength);
//   };

//   return (
//     <div className="flex flex-col">
//       {/* 5 R's & Flipcards Section */}
//       <div className="flex items-center justify-center w-full min-h-screen bg-green-100 relative overflow-hidden p-5">
//         <div className="flex items-center gap-1 max-w-7xl">
//           <div
//             className="w-40 h-40 rounded-full bg-green-600 text-white flex items-center justify-center text-center text-lg font-semibold cursor-pointer shadow-lg hover:scale-105 transition-all duration-500"
//             onClick={toggleCards}
//           >
//             <span>
//               5 R's
//               <br />
//               of
//               <br />
//               Recycling
//             </span>
//           </div>

//           {/* Zigzag cards container */}
//           <div className="relative" style={{ width: "1000px", height: "400px" }}>
//             <div className="absolute top-0 left-0 flex gap-16">
//               {["Reduce", "Repurpose", "Recycle"].map((label, index) => (
//                 <div
//                   key={index}
//                   ref={(el) => (cardsRef.current[index] = el)}
//                   className="w-40 h-40 relative cursor-pointer transition-transform duration-700"
//                   style={{ perspective: "1000px" }}
//                   onClick={(e) => handleCardClick(e, index)}
//                 >
//                   <div
//                     className="card-inner relative w-full h-full transition-transform duration-700"
//                     style={{ transformStyle: "preserve-3d" }}
//                   >
//                     <div
//                       className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex items-center justify-center text-black font-semibold shadow-md"
//                       style={{ backfaceVisibility: "hidden" }}
//                     >
//                       {label}
//                     </div>
//                     <div
//                       className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md"
//                       style={{
//                         transform: "rotateY(180deg)",
//                         backfaceVisibility: "hidden",
//                       }}
//                     >
//                       {fiveRs[index].back}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="absolute bottom-0 left-20 flex gap-16">
//               {["Refuse", "Reuse"].map((label, index) => (
//                 <div
//                   key={index + 3}
//                   ref={(el) => (cardsRef.current[index + 3] = el)}
//                   className="w-40 h-40 relative cursor-pointer transition-transform duration-700"
//                   style={{ perspective: "1000px" }}
//                   onClick={(e) => handleCardClick(e, index + 3)}
//                 >
//                   <div
//                     className="card-inner relative w-full h-full transition-transform duration-700"
//                     style={{ transformStyle: "preserve-3d" }}
//                   >
//                     <div
//                       className="absolute w-full h-full bg-white border-2 border-gray-400 rounded-lg flex items-center justify-center text-black font-semibold shadow-md"
//                       style={{ backfaceVisibility: "hidden" }}
//                     >
//                       {label}
//                     </div>
//                     <div
//                       className="absolute w-full h-full bg-green-200 flex items-center justify-center text-green-800 font-semibold rounded-lg shadow-md"
//                       style={{
//                         transform: "rotateY(180deg)",
//                         backfaceVisibility: "hidden",
//                       }}
//                     >
//                       {fiveRs[index + 3].back}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Facts Section on the right */}
//           <div className="flex flex-col justify-center ml-16 max-w-sm">
//             {/* Upper Half: Recycling Tips */}
//             <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md mb-8">
//               <h3 className="text-xl font-bold text-green-800 mb-4">♻️ Recycling Tips</h3>
//               <ul className="space-y-2 text-green-700">
//                 <li className="flex items-start">
//                   <span className="text-green-600 mr-2">•</span>
//                   <span>Rinse containers before tossing.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-600 mr-2">•</span>
//                   <span>Flatten boxes to save space.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-600 mr-2">•</span>
//                   <span>Never mix wet and dry waste.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-600 mr-2">•</span>
//                   <span>Find your local recycling centers.</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Lower Half: Impact Statistics */}
//             <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md">
//               <h3 className="text-xl font-bold text-blue-800 mb-4">📊 Impact Statistics</h3>
//               <p className="text-blue-700 mb-3 text-sm font-medium">How much energy/resources recycling saves:</p>
//               <ul className="space-y-2 text-blue-700">
//                 <li className="flex items-start">
//                   <span className="text-blue-600 mr-2">•</span>
//                   <span>1 recycled can = energy to power a TV for 3 hours.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-blue-600 mr-2">•</span>
//                   <span>Recycling one ton of paper = saves 17 trees.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-blue-600 mr-2">•</span>
//                   <span>Recycling plastic bottles saves 70% energy vs. making new ones.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-blue-600 mr-2">•</span>
//                   <span>Glass can be recycled endlessly without quality loss.</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TIMELINE ANIMATION */}
//       <div className="relative w-full h-[1800px] bg-green-200 overflow-visible">
//         {/* Dotted Curvy Path - Always Visible */}
//         <svg
//           width="100%"
//           height="100%"
//           viewBox="0 0 400 1800"
//           className="absolute left-0 top-0 z-20 pointer-events-none"
//         >
//           <path
//             ref={pathRef}
//             id="motionPath"
//             d="M 200 50
//              C 250 150, 300 250, 200 350
//              S 100 550, 200 650
//              S 300 850, 200 950
//              S 100 1150, 200 1250
//              S 300 1450, 200 1550"
//             stroke="black"
//             strokeWidth="3"
//             fill="none"
//             strokeDasharray="10,10"
//           />
//         </svg>

//         {/* Moving Circle */}
//         <div
//           ref={logoRef}
//           className="w-16 h-16 bg-black rounded-full absolute z-30 shadow-xl"
//           style={{ transform: "translate(-50%, -50%)" }}
//         ></div>

//         {/* Checkpoint Labels on Path - Positioned along the curve */}
//         {[
//           { percentage: 0.2, icon: "📄 Paper" },
//           { percentage: 0.4, icon: "🥫 Aluminium Can" },
//           { percentage: 0.6, icon: "🍼 Plastic Bottle" },
//           { percentage: 0.8, icon: "🍾 Glass Bottle" },
//           { percentage: 1.0, icon: "📦 Cardboard" },
//         ].map((cp, i) => {
//           const position = pathRef.current ?
//             (() => {
//               const pathLength = pathRef.current.getTotalLength();
//               return pathRef.current.getPointAtLength(cp.percentage * pathLength);
//             })() :
//             { x: 200, y: 50 + (i * 300) };

//           return (
//             <div
//               key={i}
//               className="absolute z-40 text-black font-semibold bg-white px-3 py-1 rounded-full shadow-md border-2 border-gray-300"
//               style={{
//                 left: `${position.x}px`,
//                 top: `${position.y}px`,
//                 transform: "translate(-50%, -50%)"
//               }}
//             >
//               {cp.icon}
//             </div>
//           );
//         })}
//       </div>

//       <style jsx>{`
//         .flipped {
//           transform: rotateY(180deg);
//         }
//       `}</style>
//     </div>
//   );
// }
