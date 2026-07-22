import React from "react";
import { motion } from "framer-motion";

export default function BookShelf({ totalShelves = 1, wishes, onOpenAdd, onSelectBook }) {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 py-8">
      <div className="p-3 bg-[#8b4513] border-8 md:border-12 border-[#6b340c] rounded-sm shadow-2xl flex flex-col gap-4">
        
        {Array.from({ length: totalShelves }).map((_, shelfIndex) => (
          <React.Fragment key={shelfIndex}>
            
            {shelfIndex > 0 && (
              <div className="w-full h-8 bg-[#5c2e0b] shadow-[inset_0_6px_10px_rgba(0,0,0,0.4)] border-y-4 border-[#3a1d06] relative z-20 flex items-center justify-between px-8 rounded-sm my-2">
                 <div className="w-3 h-3 rounded-full bg-[#3a1d06] shadow-sm"></div>
                 <div className="w-3 h-3 rounded-full bg-[#3a1d06] shadow-sm"></div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-3 h-[600px] md:h-[800px]">
                <ShelfSlot slotId="L1" shelfIndex={shelfIndex} className="flex-[1.2]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                <ShelfSlot slotId="L2" shelfIndex={shelfIndex} className="flex-[0.8]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                <div className="flex gap-3 flex-[1.5]">
                  <ShelfSlot slotId="L3a" shelfIndex={shelfIndex} className="flex-1" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                  <ShelfSlot slotId="L3b" shelfIndex={shelfIndex} className="flex-[0.8]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                </div>
                <ShelfSlot slotId="L4" shelfIndex={shelfIndex} className="flex-[1]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                <ShelfSlot slotId="L5" shelfIndex={shelfIndex} className="flex-[1.2]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
              </div>

              <div className="flex flex-col gap-3 h-[600px] md:h-[800px]">
                <ShelfSlot slotId="C1" shelfIndex={shelfIndex} className="flex-[1]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                <div className="flex gap-3 flex-[1.5]">
                  <ShelfSlot slotId="C2a" shelfIndex={shelfIndex} className="flex-[0.4]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                  <ShelfSlot slotId="C2b" shelfIndex={shelfIndex} className="flex-1" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                </div>
                <div className="flex flex-col gap-3 flex-2">
                  <ShelfSlot slotId="C3a" shelfIndex={shelfIndex} className="flex-1" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                  <ShelfSlot slotId="C3b" shelfIndex={shelfIndex} className="flex-[0.25]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                </div>
              </div>

              <div className="flex flex-col gap-3 h-[600px] md:h-[800px]">
                <div className="flex gap-3 flex-1">
                  <ShelfSlot slotId="R1a" shelfIndex={shelfIndex} className="flex-1" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                  <ShelfSlot slotId="R1b" shelfIndex={shelfIndex} className="flex-[0.6]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                </div>
                <ShelfSlot slotId="R2" shelfIndex={shelfIndex} className="flex-[1]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                <ShelfSlot slotId="R3" shelfIndex={shelfIndex} className="flex-[0.8]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                <div className="flex gap-3 flex-[1.5]">
                  <ShelfSlot slotId="R4a" shelfIndex={shelfIndex} className="flex-1" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                  <ShelfSlot slotId="R4b" shelfIndex={shelfIndex} className="flex-[0.5]" wishes={wishes} onOpenAdd={onOpenAdd} onSelectBook={onSelectBook} />
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ShelfSlot({ slotId, shelfIndex, className, wishes, onOpenAdd, onSelectBook }) {
  const slotWishes = wishes.filter(w => (w.shelfIndex || 0) === shelfIndex && w.slotId === slotId);
  const MAX_BOOKS = 8;
  const isFull = slotWishes.length >= MAX_BOOKS;

  const getBookColor = (id) => {
    const colors = [
      "bg-red-700 border-red-950", "bg-blue-700 border-blue-950", "bg-emerald-700 border-emerald-950",
      "bg-amber-500 border-amber-700", "bg-rose-600 border-rose-900",
      "bg-cyan-700 border-cyan-950", "bg-indigo-700 border-indigo-950", "bg-teal-700 border-teal-950",
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleAddClick = () => {
    if (isFull) alert(`Ngăn kệ này đã đầy giới hạn (${MAX_BOOKS} cuốn)! Vui lòng chọn ngăn khác.`);
    else onOpenAdd(shelfIndex, slotId);
  };

  return (
    <div className={`relative bg-[#f5e6ca] shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)] flex flex-col justify-end overflow-hidden ${className}`}>
      <div className="relative z-10 flex flex-nowrap items-end justify-start gap-2 w-full h-full p-3 pb-0 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {slotWishes.map((w) => (
          <motion.button 
            key={w.id}
            whileHover={{ y: -10, scale: 1.05 }}
            onClick={() => onSelectBook(w)}
            className={`shrink-0 w-8 sm:w-10 h-[85%] max-h-32 min-h-15 ${getBookColor(w.id)} border-r-4 shadow-xl flex items-center justify-center cursor-pointer transition-all`}
          >
            <span className="text-white text-[8px] sm:text-[10px] font-bold rotate-90 whitespace-nowrap tracking-widest">
              {w.sender || "Ẩn danh"}
            </span>
          </motion.button>
        ))}

        <button 
          onClick={handleAddClick}
          className={`shrink-0 w-8 sm:w-10 h-[85%] max-h-32 min-h-15 border-2 border-dashed bg-transparent flex items-center justify-center transition-all ${isFull ? 'border-red-900/40 text-red-900/40 cursor-not-allowed bg-red-900/5' : 'border-amber-900/40 text-amber-900/40 hover:bg-amber-900/10 hover:border-amber-900/70 cursor-pointer'}`}
          title={isFull ? "Đã đầy" : "Thêm tranh vào ngăn này"}
        >
          <span className={`font-bold ${isFull ? 'text-[10px] rotate-90 whitespace-nowrap' : 'text-xl'}`}>{isFull ? "ĐÃ ĐẦY" : "+"}</span>
        </button>
      </div>
    </div>
  );
}