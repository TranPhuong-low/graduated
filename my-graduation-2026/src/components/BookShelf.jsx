import React from "react";
import { motion } from "framer-motion";

export default function BookShelf({ wishes, onOpenAdd, onSelectBook }) {
  return (
    <div className="max-w-4xl mx-auto flex flex-wrap items-end justify-center gap-2 border-b-8 border-amber-900/40 pb-4 min-h-[200px]">
      {wishes.map((w) => (
        <motion.button key={w.id} whileHover={{ y: -10 }} onClick={() => onSelectBook(w)}
          className="w-10 h-32 bg-amber-700 rounded-sm shadow-md border-r-2 border-amber-900 cursor-pointer flex items-center justify-center transition-all">
          <span className="text-white text-[10px] rotate-90 font-bold">Tranh vẽ</span>
        </motion.button>
      ))}
      <button onClick={onOpenAdd} className="w-16 h-32 border-2 border-dashed border-slate-300 rounded-sm flex items-center justify-center text-slate-400">+</button>
    </div>
  );
}