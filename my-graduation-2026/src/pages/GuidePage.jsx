import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { useAdmin } from "../hooks/useAdmin";
import { Plus } from "lucide-react";
import GuideItem from "../components/GuideItem";

export default function GuidePage() {
  const { isAdmin } = useAdmin();
  const [guides, setGuides] = useState([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  // Tải dữ liệu từ Firestore
  useEffect(() => {
    const q = query(collection(db, "guides"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGuides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Admin thêm câu hỏi mới
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    try {
      await addDoc(collection(db, "guides"), {
        question: newQuestion,
        answers: [],
        order: Date.now()
      });
      setNewQuestion("");
      setIsAddingQuestion(false);
    } catch (error) {
      alert("Lỗi thêm câu hỏi: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 py-24 flex items-start md:items-center justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Header Khu vực */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
            <span className="w-10 h-10 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xl shadow-sm">
              ?
            </span>
            Thông tin cần biết
          </h2>

          {isAdmin && !isAddingQuestion && (
            <button 
              onClick={() => setIsAddingQuestion(true)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-md hover:bg-blue-700 transition self-start"
            >
              <Plus size={18} /> Thêm câu hỏi
            </button>
          )}
        </div>

        {/* Form thêm câu hỏi (Dành cho Admin) */}
        {isAdmin && isAddingQuestion && (
          <form onSubmit={handleAddQuestion} className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-blue-100 flex flex-col md:flex-row gap-3">
            <input 
              autoFocus
              type="text" 
              placeholder="Nhập câu hỏi mới..." 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-blue-200 outline-none focus:border-blue-500 font-medium"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex-1 md:flex-none">
                Lưu
              </button>
              <button 
                type="button" 
                onClick={() => setIsAddingQuestion(false)}
                className="bg-slate-100 text-slate-500 px-4 py-3 rounded-xl hover:bg-slate-200 transition"
              >
                <X size={20} />
              </button>
            </div>
          </form>
        )}

        {/* Danh sách Câu hỏi (Accordion) */}
        <div className="space-y-4">
          {guides.length === 0 ? (
            <p className="text-center text-slate-400 italic py-10">Chưa có thông tin nào được cập nhật.</p>
          ) : (
            guides.map((item) => (
              <GuideItem 
                key={item.id} 
                item={item} 
                isAdmin={isAdmin} 
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}