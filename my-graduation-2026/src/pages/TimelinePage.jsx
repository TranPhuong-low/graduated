import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TimelineItem from "../components/TimelineItem";
import TimelineTrack from "../components/TimelineTrack";
import { Plus, X, AlertCircle } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import { db } from "../services/firebase";
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";

export default function TimelinePage() {
  const { isAdmin } = useAdmin();
  const [timelineData, setTimelineData] = useState([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ time: "", title: "" });
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "timelines"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTimelineData(data);
    });
    return () => unsubscribe();
  }, []);

  const handleConfirmAdd = async (e) => {
    e.preventDefault();
    if (!newItem.time || !newItem.title) return;
    
    try {
      await addDoc(collection(db, "timelines"), {
        time: newItem.time,
        title: newItem.title,
        order: Date.now()
      });
      setNewItem({ time: "", title: "" });
      setIsAddModalOpen(false);
    } catch (error) {
      alert("Lỗi khi thêm: " + error.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, "timelines", itemToDelete));
      setItemToDelete(null); 
    } catch (error) {
      alert("Lỗi khi xóa: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-20 px-4 md:px-8 overflow-hidden flex justify-center relative">
      <div className="w-full max-w-3xl relative z-10">
        
        <div className="flex items-center justify-center mb-16 relative">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-4xl md:text-5xl font-black text-gray-800 uppercase tracking-wider"
          >
            Hành Trình
          </motion.h2>
          
          {isAdmin && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="absolute right-0 bg-slate-800 text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:scale-105 hover:bg-black transition-all font-bold shadow-md"
            >
              <Plus size={20} /> Thêm mốc
            </button>
          )}
        </div>

        <div className="relative w-full">
          
          {timelineData.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              viewport={{ once: false, amount: 0 }}
              className="absolute inset-0 z-0 pointer-events-none"
            >
              <TimelineTrack count={timelineData.length} />
            </motion.div>
          )}

          <div className="flex flex-col gap-10 md:gap-14 relative z-10">
            {timelineData.length === 0 && (
              <p className="text-center text-gray-500 italic">Chưa có sự kiện nào. Hãy nhấn "Thêm mốc" để bắt đầu!</p>
            )}
            
            {timelineData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index % 2 === 0 ? 0 : 0.1 }}
                viewport={{ once: false, amount: 0.2 }}
                className="w-full"
              >
                <TimelineItem 
                  id={item.id}
                  time={item.time} 
                  title={item.title} 
                  index={index} 
                  isAdmin={isAdmin}
                  onDelete={(id) => setItemToDelete(id)} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Thêm Mốc Mới</h3>
              <form onSubmit={handleConfirmAdd} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Thời gian (VD: 08/2026)</label>
                  <input type="text" required placeholder="Nhập thời gian..." value={newItem.time} onChange={e => setNewItem({...newItem, time: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Tên sự kiện</label>
                  <input type="text" required placeholder="VD: Lễ Tốt Nghiệp..." value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" />
                </div>
                <button type="submit" className="w-full bg-slate-800 text-white rounded-xl py-3.5 font-bold mt-2 hover:bg-black transition-colors">Lưu Sự Kiện</button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {itemToDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Xóa sự kiện này?</h3>
              <p className="text-gray-500 mb-6 text-sm">Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa mốc thời gian này khỏi Hành Trình không?</p>
              <div className="flex gap-3">
                <button onClick={() => setItemToDelete(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Hủy</button>
                <button onClick={handleConfirmDelete} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">Xóa Ngay</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
      </AnimatePresence>
    </div>
  );
}