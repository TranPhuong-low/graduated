import React from "react";
import { motion } from "framer-motion"; 
export default function TimelineTrack({ count }) {
  let points = "50,0 ";
  for (let i = 1; i < count; i++) {
    let isRight = i % 2 !== 0; 
    let peakX = isRight ? 100 : 0;
    let peakY = (i - 0.5) * 100;
    let circleY = i * 100;
    points += `${peakX},${peakY} 50,${circleY} `;
  }

  return (
    <div className="absolute left-10 md:left-12 top-10 md:top-12 bottom-10 md:bottom-12 w-20 md:w-28 -translate-x-1/2 z-0 pointer-events-none">
      <svg
        className="w-full h-full drop-shadow-md"
        preserveAspectRatio="none"
        viewBox={`-20 0 140 ${(count - 1) * 100}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.polyline
          points={points}
          stroke="#e5e7eb"
          strokeWidth="35"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        <motion.polyline
          points={points}
          stroke="#d1d5db"
          strokeWidth="35"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}