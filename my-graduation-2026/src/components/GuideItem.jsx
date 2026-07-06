import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Trash2, Send, X} from "lucide-react";
import { db } from "../services/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function GuideItem({ item, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingAnswer, setIsAddingAnswer] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");

  const docRef = doc(db, "guides", item.id);

  const handleDeleteQuestion = async (e) => {
    e.stopPropagation(); 
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này cùng toàn bộ câu trả lời?")) {
      await deleteDoc(docRef);
    }
  };

  const handleAddAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    try {
      const updatedAnswers = [...(item.answers || []), newAnswer];
      await updateDoc(docRef, { answers: updatedAnswers });
      setNewAnswer("");
      setIsAddingAnswer(false);
    } catch (error) {
      alert("Lỗi thêm câu trả lời: " + error.message);
    }
  };

  const handleDeleteAnswer = async (indexToRemove) => {
    if (window.confirm("Xóa câu trả lời này?")) {
      const updatedAnswers = item.answers.filter((_, idx) => idx !== indexToRemove);
      await updateDoc(docRef, { answers: updatedAnswers });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition-colors group"
      >
        <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition tracking-wide flex-1 pr-4">
          {item.question}
        </h3>
        
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button 
              onClick={handleDeleteQuestion}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Xóa câu hỏi"
            >
              <Trash2 size={16} />
            </button>
          )}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-400">
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-blue-50/30"
          >
            <div className="p-5 pt-2 space-y-3 border-t border-blue-50">
              
              {/* Danh sách các câu trả lời */}
              {!item.answers || item.answers.length === 0 ? (
                <p className="text-slate-400 text-sm italic">Chưa có câu trả lời nào.</p>
              ) : (
                item.answers.map((ans, idx) => (
                  <div key={idx} className="flex gap-3 group/ans items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-2 shrink-0"></div>
                    <p className="text-slate-600 text-sm flex-1 leading-relaxed">{ans}</p>
                    
                    {isAdmin && (
                      <button 
                        onClick={() => handleDeleteAnswer(idx)}
                        className="opacity-0 group-hover/ans:opacity-100 text-slate-300 hover:text-red-500 transition-all shrink-0 p-1"
                        title="Xóa câu trả lời này"
                      >
                        <X size={14} className="lucide-icon" /> {/* Dùng X hoặc Trash tùy ý, import thêm X từ lucide-react nếu lỗi */}
                      </button>
                    )}
                  </div>
                ))
              )}

              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-blue-100/50">
                  {!isAddingAnswer ? (
                    <button 
                      onClick={() => setIsAddingAnswer(true)}
                      className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:text-blue-700 transition"
                    >
                      <Plus size={14} /> Thêm câu trả lời
                    </button>
                  ) : (
                    <form onSubmit={handleAddAnswer} className="flex gap-2">
                      <input 
                        autoFocus
                        type="text" 
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Nhập câu trả lời..."
                        className="flex-1 text-sm p-2 rounded-lg border border-blue-200 outline-none focus:border-blue-400"
                      />
                      <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">
                        <Send size={16} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsAddingAnswer(false)}
                        className="text-slate-400 p-2 hover:text-slate-600 transition"
                      >
                        Hủy
                      </button>
                    </form>
                  )}
                </div>
              )}
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}