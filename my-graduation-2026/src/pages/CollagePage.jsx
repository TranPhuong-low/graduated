import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, LogIn } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";

const TornPaperFilter = () => (
  <svg className="absolute w-0 h-0 pointer-events-none">
    <filter id="torn-edge">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

const initialScrapbook = [
  { 
    id: 1, type: "text", content: "Graduation 2026!", 
    x: -150, y: -250, width: "auto",
    mx: 0, my: -240, mWidth: "auto",
    rotate: -5, className: "text-5xl md:text-[5rem] font-['Nothing_You_Could_Do'] text-gray-900 whitespace-nowrap" 
  },
  { 
    id: 2, type: "text", content: "Here are a few of my favorite moments...", 
    x: -280, y: -100, width: 250,
    mx: 0, my: -160, mWidth: 220,
    rotate: -2, className: "text-2xl md:text-3xl font-['Caveat'] text-gray-800 leading-tight" 
  },
  { 
    id: 3, type: "polaroid", src: "", caption: "IT Engineer", 
    x: 100, y: -150, width: 220,
    mx: -40, my: -50, mWidth: 160,
    rotate: 4 
  },
  { 
    id: 4, type: "polaroid", src: "", caption: "With besties", 
    x: 300, y: -50, width: 240,
    mx: 50, my: 60, mWidth: 180,
    rotate: -3 
  },
  { 
    id: 5, type: "object", src: "/src/assets/lotus.png", 
    x: -250, y: 100, width: 180,
    mx: -80, my: 130, mWidth: 130,
    rotate: -15 
  }, 
  { 
    id: 6, type: "note", content: "My one and only graduation day. I stuck to my dreams!", 
    x: -100, y: 150, width: 240,
    mx: 20, my: 210, mWidth: 200,
    rotate: 6 
  },
  { 
    id: 7, type: "magazine", src: "", 
    x: 250, y: 180, width: 280,
    mx: 0, my: 320, mWidth: 220,
    rotate: -8 
  },
];

export default function CollagePage() {
  const { isAdmin, login } = useAdmin();
  const [items, setItems] = useState(initialScrapbook);
  const containerRef = useRef(null); 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full h-dvh overflow-hidden flex items-center justify-center bg-[#f2eee3]">
      <TornPaperFilter />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>

      {/* Nút Admin */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
        {!isAdmin ? (
          <button onClick={() => login && login()} className="bg-white/60 hover:bg-white backdrop-blur-md text-slate-800 p-3 rounded-full shadow-lg transition-all flex items-center justify-center group border border-white/40">
            <LogIn size={20} className="group-hover:scale-110 transition-transform opacity-80 group-hover:opacity-100" />
          </button>
        ) : (
          <div className="bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-lg flex items-center gap-2 md:gap-3 font-bold text-xs md:text-sm tracking-wide">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
            Admin Mode
          </div>
        )}
      </div>

      <div ref={containerRef} className="relative w-full h-[85vh] max-w-6xl flex items-center justify-center z-20 touch-none">
        {items.map((item, index) => {
          
          const targetX = isMobile ? item.mx : item.x;
          const targetY = isMobile ? item.my : item.y;
          const targetWidth = isMobile ? item.mWidth : item.width;

          if (item.type === "text") {
            return (
              <motion.div
                key={item.id}
                drag dragConstraints={containerRef}
                whileHover={{ scale: 1.05, zIndex: 100 }} whileTap={{ cursor: "grabbing" }}
                initial={{ opacity: 0, x: targetX, y: targetY + 50, rotate: item.rotate - 5 }}
                animate={{ opacity: 1, x: targetX, y: targetY, rotate: item.rotate }}
                transition={{ type: "spring", delay: index * 0.1 }}
                className={`absolute cursor-grab ${item.className}`}
                style={{ width: targetWidth }}
              >
                <motion.div animate={{ rotate: [0, -1, 1, 0], y: [0, -2, 2, 0] }} transition={{ repeat: Infinity, duration: 4 + (index % 2), ease: "easeInOut" }}>
                  {item.content}
                </motion.div>
              </motion.div>
            );
          }

          if (item.type === "polaroid") {
            return (
              <motion.div
                key={item.id}
                drag dragConstraints={containerRef}
                whileHover={{ scale: 1.05, zIndex: 100 }} whileTap={{ scale: 1.1, cursor: "grabbing" }}
                initial={{ opacity: 0, scale: 0.5, x: targetX, y: targetY + 100, rotate: item.rotate - 15 }}
                animate={{ opacity: 1, scale: 1, x: targetX, y: targetY, rotate: item.rotate }}
                transition={{ type: "spring", delay: index * 0.1 }}
                className="absolute cursor-grab"
                style={{ width: targetWidth }}
              >
                <motion.div animate={{ rotate: [0, -2, 2, 0], y: [0, -3, 3, 0] }} transition={{ repeat: Infinity, duration: 3 + (index % 3), ease: "easeInOut" }} className="bg-[#faf9f5] p-3 md:p-4 pb-12 md:pb-16 shadow-[2px_5px_15px_rgba(0,0,0,0.15)] flex flex-col border border-gray-200">
                  <div className="w-full aspect-square bg-gray-300 overflow-hidden shadow-inner relative">
                    {item.src ? <img src={item.src} className="absolute inset-0 w-full h-full object-cover pointer-events-none" alt="" /> : <div className="w-full h-full bg-[#dcd0df]"></div>}
                  </div>
                  <p className="absolute bottom-2 md:bottom-3 left-0 w-full text-center font-['Caveat'] text-xl md:text-2xl text-gray-800 pointer-events-none">
                    {item.caption}
                  </p>
                </motion.div>
              </motion.div>
            );
          }

          if (item.type === "object") {
            return (
              <motion.div
                key={item.id}
                drag dragConstraints={containerRef}
                whileHover={{ scale: 1.05, zIndex: 100 }} whileTap={{ scale: 1.1, cursor: "grabbing" }}
                initial={{ opacity: 0, scale: 0.5, x: targetX, y: targetY + 100, rotate: item.rotate - 10 }}
                animate={{ opacity: 1, scale: 1, x: targetX, y: targetY, rotate: item.rotate }}
                transition={{ type: "spring", delay: index * 0.1 }}
                className="absolute cursor-grab flex items-center justify-center"
                style={{ width: targetWidth }}
              >
                <motion.div animate={{ rotate: [0, -3, 3, 0], y: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 2.5 + (index % 3), ease: "easeInOut" }} className="w-full" style={{ filter: "drop-shadow(8px 12px 10px rgba(0,0,0,0.4))" }}>
                  {item.src ? <img src={item.src} alt="object" className="w-full h-auto object-contain pointer-events-none" /> : <div className="w-full aspect-2/1 bg-amber-800/20 rounded-full blur-md"></div>}
                </motion.div>
              </motion.div>
            );
          }

          if (item.type === "note") {
            return (
              <motion.div
                key={item.id}
                drag dragConstraints={containerRef}
                whileHover={{ scale: 1.05, zIndex: 100 }} whileTap={{ scale: 1.1, cursor: "grabbing" }}
                initial={{ opacity: 0, scale: 0, x: targetX, y: targetY + 80, rotate: item.rotate - 20 }}
                animate={{ opacity: 1, scale: 1, x: targetX, y: targetY, rotate: item.rotate }}
                transition={{ type: "spring", delay: index * 0.1 }}
                className="absolute cursor-grab"
                style={{ width: targetWidth }}
              >
                <motion.div animate={{ rotate: [0, -1.5, 1.5, 0], y: [0, -3, 3, 0] }} transition={{ repeat: Infinity, duration: 3 + (index % 2), ease: "easeInOut" }} className="bg-white p-4 md:p-5" style={{ filter: "url(#torn-edge) drop-shadow(3px 5px 8px rgba(0,0,0,0.15))" }}>
                  <p className="font-['Caveat'] text-2xl md:text-3xl text-gray-800 leading-tight pointer-events-none">
                    {item.content}
                  </p>
                </motion.div>
              </motion.div>
            );
          }

          if (item.type === "magazine") {
            return (
              <motion.div
                key={item.id}
                drag dragConstraints={containerRef}
                whileHover={{ scale: 1.05, zIndex: 100 }} whileTap={{ scale: 1.1, cursor: "grabbing" }}
                initial={{ opacity: 0, scale: 0.8, x: targetX, y: targetY + 100, rotate: item.rotate - 5 }}
                animate={{ opacity: 1, scale: 1, x: targetX, y: targetY, rotate: item.rotate }}
                transition={{ type: "spring", delay: index * 0.1 }}
                className="absolute cursor-grab"
                style={{ width: targetWidth }}
              >
                <motion.div animate={{ rotate: [0, -1, 1, 0], y: [0, -2, 2, 0] }} transition={{ repeat: Infinity, duration: 3.5 + (index % 2), ease: "easeInOut" }} className="aspect-3/4 bg-white p-1" style={{ filter: "url(#torn-edge) drop-shadow(4px 6px 10px rgba(0,0,0,0.3))" }}>
                  <div className="w-full h-full bg-gray-400 overflow-hidden relative">
                    {item.src ? <img src={item.src} className="absolute inset-0 w-full h-full object-cover pointer-events-none" alt="" /> : <div className="w-full h-full bg-[#c8dec8]"></div>}
                  </div>
                </motion.div>
              </motion.div>
            );
          }

          return null;
        })}
      </div>

      <a 
        href="#map"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 z-50 bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-full shadow-xl hover:scale-105 transition cursor-pointer font-['Caveat'] text-xl md:text-2xl whitespace-nowrap"
      >
        Xem Bản Đồ →
      </a>
    </div>
  );
}