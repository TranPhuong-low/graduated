import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, doc, setDoc } from "firebase/firestore";
import BookShelf from "../components/BookShelf";
import DrawingModal from "../components/DrawingModal";
import { useAdmin } from "../hooks/useAdmin";
import { motion, AnimatePresence } from "framer-motion"; 

export default function WishesPage() {
  const { isAdmin } = useAdmin();
  
  const [wishes, setWishes] = useState([]);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [targetLocation, setTargetLocation] = useState(null);
  
  const [dbShelves, setDbShelves] = useState(1);
  
  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "wishes"), orderBy("date", "desc"));
    return onSnapshot(q, (ss) => setWishes(ss.docs.map(d => ({id: d.id, ...d.data()}))));
  }, []);

  useEffect(() => {
    return onSnapshot(doc(db, "status", "bookshelf"), (docSnap) => {
      if (docSnap.exists() && docSnap.data().totalShelves) {
        setDbShelves(docSnap.data().totalShelves);
      }
    });
  }, []);

  const maxDataShelf = wishes.reduce((max, w) => Math.max(max, w.shelfIndex || 0), 0);
  const totalShelves = Math.max(maxDataShelf + 1, dbShelves);

  const handleSave = async (imageData, senderName) => {
    await addDoc(collection(db, "wishes"), { 
      image: imageData, 
      sender: senderName || "Ẩn danh",
      shelfIndex: targetLocation?.shelfIndex || 0,
      slotId: targetLocation?.slotId || "L1", 
      date: Date.now() 
    });
    setIsDrawModalOpen(false);
    setTargetLocation(null);
  };

  const handleAddShelf = async () => {
    if (!isAdmin) return;
    await setDoc(doc(db, "status", "bookshelf"), { totalShelves: totalShelves + 1 }, { merge: true });
  };

  const handleRemoveShelfClick = () => {
    if (!isAdmin || totalShelves <= 1) return;

    const lastShelfIndex = totalShelves - 1;
    const hasBooksInLastShelf = wishes.some(w => (w.shelfIndex || 0) === lastShelfIndex);

    if (hasBooksInLastShelf) {
      alert("⚠️ Không thể xóa! Tầng kệ này đang chứa tranh của khách. Bạn không thể xóa để tránh mất dữ liệu.");
      return;
    }

    setIsConfirmRemoveOpen(true);
  };

  const confirmRemoveShelf = async () => {
    await setDoc(doc(db, "status", "bookshelf"), { totalShelves: totalShelves - 1 }, { merge: true });
    setIsConfirmRemoveOpen(false); // Đóng Modal sau khi xóa xong
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] p-6 pb-24">
      <h2 className="text-4xl font-serif text-center mb-12 text-slate-800 italic">Tranh</h2>
      
      <BookShelf 
        totalShelves={totalShelves}
        wishes={wishes} 
        onOpenAdd={(shelfIndex, slotId) => {
          setTargetLocation({ shelfIndex, slotId });
          setIsDrawModalOpen(true);
        }} 
        onSelectBook={setSelectedDrawing} 
      />

      {/* ADMIN CONTROL PANEL: THÊM VÀ XÓA KỆ */}
      {isAdmin && (
        <div className="flex flex-wrap justify-center gap-4 mt-12 mb-12 relative z-20">
          {totalShelves > 1 && (
            <button
                onClick={handleRemoveShelfClick}
                className="bg-red-700/90 text-white px-8 py-3 rounded-full font-bold shadow-[0_10px_20px_rgba(185,28,28,0.2)] hover:bg-red-800 hover:-translate-y-1 transition-all"
            >
                - Tháo dỡ Kệ cuối
            </button>
          )}

          <button
              onClick={handleAddShelf}
              className="bg-[#8b4513] text-white px-8 py-3 rounded-full font-bold shadow-[0_10px_20px_rgba(139,69,19,0.3)] hover:bg-[#6b340c] hover:-translate-y-1 transition-all"
          >
              + Đóng thêm Tầng Kệ
          </button>
        </div>
      )}

      <AnimatePresence>
        {isConfirmRemoveOpen && (
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl relative text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-black">!</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Tháo dỡ kệ sách?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Bạn có chắc chắn muốn tháo dỡ tầng kệ cuối cùng không? Hành động này không thể hoàn tác.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmRemoveOpen(false)}
                  className="flex-1 py-3 rounded-full font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmRemoveShelf}
                  className="flex-1 py-3 rounded-full font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-[0_4px_12px_rgba(220,38,38,0.3)]"
                >
                  Đồng ý
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(isDrawModalOpen || selectedDrawing) && (
         selectedDrawing ? (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
             <div className="bg-white p-6 rounded-3xl w-full max-w-lg">
             <p className="font-bold text-center text-lg italic">— {selectedDrawing.sender || "Ẩn danh"}</p>
                <img src={selectedDrawing.image} className="w-full h-auto" />
                <button onClick={() => setSelectedDrawing(null)} className="mt-4 block w-full underline">Đóng</button>
             </div>
           </div>
         ) : (
           <DrawingModal 
             isOpen={isDrawModalOpen} 
             onClose={() => { setIsDrawModalOpen(false); setTargetLocation(null); }} 
             onSave={handleSave} 
             strokeColor={strokeColor} setStrokeColor={setStrokeColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} 
           />
         )
      )}
    </div>
  );
}