import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import BookShelf from "../components/BookShelf";
import DrawingModal from "../components/DrawingModal";

export default function WishesPage() {
  const [wishes, setWishes] = useState([]);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);

  useEffect(() => {
    const q = query(collection(db, "wishes"), orderBy("date", "desc"));
    return onSnapshot(q, (ss) => setWishes(ss.docs.map(d => ({id: d.id, ...d.data()}))));
  }, []);

  const handleSave = async (imageData) => {
    await addDoc(collection(db, "wishes"), { image: imageData, date: Date.now() });
    setIsDrawModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] p-6 pb-24">
      <h2 className="text-4xl font-serif text-center mb-12 text-slate-800 italic">Thư viện tranh vẽ</h2>
      
      <BookShelf wishes={wishes} onOpenAdd={() => setIsDrawModalOpen(true)} onSelectBook={setSelectedDrawing} />

      {(isDrawModalOpen || selectedDrawing) && (
         selectedDrawing ? (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
             <div className="bg-white p-6 rounded-3xl w-full max-w-lg">
                <img src={selectedDrawing.image} className="w-full h-auto" />
                <button onClick={() => setSelectedDrawing(null)} className="mt-4 block w-full underline">Đóng</button>
             </div>
           </div>
         ) : (
           <DrawingModal isOpen={isDrawModalOpen} onClose={() => setIsDrawModalOpen(false)} onSave={handleSave} 
             strokeColor={strokeColor} setStrokeColor={setStrokeColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />
         )
      )}
    </div>
  );
}