import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";

import pic1 from "../assets/01.png";
import pic2 from "../assets/02.png";
import pic3 from "../assets/03.png";
import pic4 from "../assets/04.png";

const TornPaperFilter = () => (
  <svg className="absolute w-0 h-0 pointer-events-none">
    <filter id="torn-edge">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

export const initialScrapbook = [
  { id: 2, type: "object", src: pic2, x: 290, y: -130, width: 610, mx: 0, my: 0, mWidth: 340, rotate: 0 }, 
  { id: 3, type: "object", src: pic3, x: -360, y: -34, width: 650, mx: 0, my: -229, mWidth: 340, rotate: 0 }, 
  { id: 4, type: "object", src: pic4, x: 70, y: 89, width: 170, mx: -120, my: 162, mWidth: 80, rotate: 0 }, 
  { id: 5, type: "object", src: pic1, x: 360, y: 60, width: 470, mx: 44, my: 126, mWidth: 240, rotate: 0 },
];

const StaticObject = ({ item, isMobile, index }) => {
  const targetX = isMobile ? item.mx : item.x;
  const targetY = isMobile ? item.my : item.y;
  const targetWidth = isMobile ? item.mWidth : item.width;

  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 100 }}
      initial={{ opacity: 0, x: targetX, y: targetY + 100, rotate: item.rotate - 10 }}
      animate={{ opacity: 1, x: targetX, y: targetY, rotate: item.rotate }}
      style={{ width: targetWidth, zIndex: index }} 
      transition={{ type: "spring", delay: index * 0.1 }}
      className="absolute flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: [0, -2, 2, 0], y: [0, -3, 3, 0] }}
        transition={{ repeat: Infinity, duration: 3 + (item.id % 3), ease: "easeInOut" }}
        className="w-full"
        style={{ filter: "drop-shadow(5px 8px 10px rgba(0,0,0,0.3))" }}
      >
        <img src={item.src} alt="object" className="w-full h-auto object-contain pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

export default function CollagePage() {
  const { isAdmin, login } = useAdmin();
  const [items] = useState(initialScrapbook); 
  const containerRef = useRef(null); 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); 
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full h-dvh overflow-hidden flex items-center justify-center bg-cover bg-center bg-no-repeat">
      <TornPaperFilter />
      
      {/* Nút Admin */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
        {!isAdmin ? (
          <button onClick={() => login && login()} className="bg-white/60 hover:bg-white backdrop-blur-md text-slate-800 p-3 rounded-full shadow-lg transition-all flex items-center justify-center group border border-white/40">
            <LogIn size={20} className="group-hover:scale-110 transition-transform opacity-80 group-hover:opacity-100" />
          </button>
        ) : (
          <div className="bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm tracking-wide">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
            Admin Mode
          </div>
        )}
      </div>

      <div 
        ref={containerRef} 
        className="relative w-full h-[85vh] max-w-6xl flex items-center justify-center z-20"
      >
        {items.map((item, index) => {
          if (item.type === "object") {
            return (
              <StaticObject
                key={item.id}
                item={item}
                index={index}
                isMobile={isMobile}
              />
            );
          }
          return null;
        })}
      </div>

      <a 
        href="#map"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 z-50 bg-[#045596] text-white px-6 md:px-8 py-2 md:py-3 rounded-full shadow-xl hover:scale-105 transition cursor-pointer font-['Caveat'] text-xl md:text-2xl whitespace-nowrap"
      >
        Xem
      </a>
    </div>
  );
}