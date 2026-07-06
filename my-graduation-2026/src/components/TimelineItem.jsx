import React from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react"; 

export default function TimelineItem({ id, time, title, index, isAdmin, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 100, delay: index * 0.15 }}
      className="relative flex items-center w-full min-h-20 md:min-h-24 z-10"
    >
      <div className="absolute left-0 w-20 h-20 md:w-24 md:h-24 bg-[#fa5a5a] rounded-full border border-black flex items-center justify-center shadow-sm shrink-0 z-20">
        <span className="font-medium text-black text-xs md:text-sm text-center px-2 wrap-break-word">
          {time}
        </span>
      </div>

      <div className="w-full ml-10 md:ml-12 pl-14 md:pl-16 pr-6 py-4 md:py-6 bg-[#fffdfa] rounded-2xl md:rounded-3xl border border-black shadow-sm flex items-center justify-between hover:bg-red-50 transition-colors duration-300 z-10 group">
        
        <h3 className="text-sm md:text-base font-medium text-gray-800 pr-4">
          {title}
        </h3>
        
        {isAdmin && (
          <button 
            onClick={() => onDelete(id)}
            className="p-2 text-red-500 bg-red-100 hover:bg-red-600 hover:text-white rounded-full transition-all duration-300 shrink-0 z-50 cursor-pointer pointer-events-auto"
            title="Xóa sự kiện này"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
}