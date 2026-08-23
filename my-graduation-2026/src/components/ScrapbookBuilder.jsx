import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

export const DraggableObject = ({ item, isMobile, bringToFront, containerRef, index, isSelected }) => {
  const targetX = isMobile ? item.mx : item.x;
  const targetY = isMobile ? item.my : item.y;
  const targetWidth = isMobile ? item.mWidth : item.width;

  const x = useMotionValue(targetX);
  const y = useMotionValue(targetY);
  const [pos, setPos] = useState({ x: targetX, y: targetY });
  const [currentWidth, setCurrentWidth] = useState(targetWidth);

  useEffect(() => {
    x.set(targetX);
    y.set(targetY);
    setPos({ x: targetX, y: targetY });
    setCurrentWidth(targetWidth);
  }, [isMobile, targetX, targetY, targetWidth, x, y]);

  useEffect(() => {
    const unsubX = x.on("change", (latest) => setPos((prev) => ({ ...prev, x: Math.round(latest) })));
    const unsubY = y.on("change", (latest) => setPos((prev) => ({ ...prev, y: Math.round(latest) })));
    return () => { unsubX(); unsubY(); };
  }, [x, y]);

  const adjustWidth = (amount, e) => {
    e.stopPropagation(); 
    setCurrentWidth((prev) => Math.max(50, prev + amount));
  };

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      onPointerDown={() => bringToFront(item.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.05, cursor: "grabbing" }}
      initial={{ opacity: 0, x: targetX, y: targetY + 100, rotate: item.rotate - 10 }}
      animate={{ opacity: 1, rotate: item.rotate }}
      style={{ x, y, width: currentWidth, zIndex: isSelected ? 100 : index }} 
      transition={{ type: "spring", delay: index * 0.1 }}
      className={`absolute cursor-grab flex items-center justify-center group ${isSelected ? 'ring-2 ring-blue-400 ring-offset-4 rounded-md' : ''}`}
    >
      {/* TOOLTIP ĐIỀU KHIỂN */}
      <div 
        className={`absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-600 text-white font-mono text-sm px-3 py-2 rounded-lg shadow-2xl transition-opacity flex flex-col items-center gap-2 pointer-events-auto ${isSelected ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-active:opacity-100'}`}
      >
        <div className="whitespace-nowrap text-xs text-green-300">
          {isMobile ? `mx: ${pos.x}, my: ${pos.y}, mWidth: ${currentWidth}` : `x: ${pos.x}, y: ${pos.y}, width: ${currentWidth}`}
        </div>
        <div className="flex gap-2">
          <button 
            onPointerDown={(e) => adjustWidth(-10, e)} 
            className="bg-slate-700 hover:bg-slate-500 px-3 py-1 rounded text-xs font-bold transition"
          >
            - Thu nhỏ
          </button>
          <button 
            onPointerDown={(e) => adjustWidth(10, e)} 
            className="bg-slate-700 hover:bg-slate-500 px-3 py-1 rounded text-xs font-bold transition"
          >
            + Phóng to
          </button>
        </div>
      </div>

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