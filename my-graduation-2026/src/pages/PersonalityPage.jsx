import { useState, useEffect } from "react";
import { db } from "../services/firebase"; 
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import { useAdmin } from "../hooks/useAdmin";
import { Camera, Trash2, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonalityPage() {
  const { isAdmin } = useAdmin();
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const [modalData, setModalData] = useState(null);
  const [caption, setCaption] = useState("");

  // STATE MỚI: Quản lý bức ảnh đang được click chọn để phóng to xem
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "albums"), orderBy("order", "asc"));
    return onSnapshot(q, (ss) => setPhotos(ss.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSelectImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    
    try {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const base64String = await convertToBase64(compressedFile);
      
      setModalData(base64String);
      setCaption(""); 
    } catch (error) {
      console.error("Lỗi khi nén ảnh:", error);
      alert("Đã có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại!");
    } finally {
      setUploading(false);
      e.target.value = null; 
    }
  };

  const handleSavePhoto = async () => {
    if (!caption.trim()) {
      alert("Vui lòng nhập mốc thời gian cho bức ảnh này nhé!");
      return;
    }

    setUploading(true);
    try {
      await addDoc(collection(db, "albums"), {
        url: modalData, 
        time: caption,
        order: Date.now()
      });
      setModalData(null);
    } catch (error) {
      console.error("Lỗi khi lưu ảnh:", error);
      alert("Lỗi! Không thể lưu kỷ niệm này.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài (tránh việc vừa bấm xóa vừa bị mở modal phóng to)
    if (window.confirm("Bạn có chắc chắn muốn xóa bức ảnh này không?")) {
      await deleteDoc(doc(db, "albums", id));
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 pb-32 relative overflow-hidden">
      <h2 className="text-center text-3xl md:text-4xl font-black italic uppercase text-[#045596] mb-8 md:mb-12 tracking-tight [text-shadow:3px_3px_0_white] md:[text-shadow:5px_5px_0_white]">Kỷ Niệm</h2>
      
      {isAdmin && (
        <div className="flex justify-center mb-8 md:mb-12">
          <label className="bg-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg cursor-pointer flex items-center gap-2 md:gap-3 hover:scale-105 transition border-2 border-transparent hover:border-slate-200">
            <Camera className="text-amber-700 w-5 h-5 md:w-6 md:h-6" /> 
            <span className="font-bold text-slate-700 text-sm md:text-base">
              {uploading && !modalData ? "Đang xử lý ảnh..." : "Thêm khoảnh khắc"}
            </span>
            <input type="file" hidden accept="image/*" onChange={handleSelectImage} disabled={uploading} />
          </label>
        </div>
      )}

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 lg:gap-12 max-w-7xl mx-auto">
        {photos.map((p, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={p.id} 
            // Thêm sự kiện onClick để mở Modal phóng to ảnh
            onClick={() => setSelectedPhoto(p)}
            className={`relative bg-white p-2 md:p-4 pb-8 md:pb-12 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-sm border-4 md:border-8 border-white border-b-30 md:border-b-60 group ${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} hover:rotate-0 cursor-pointer`}
          >
            {isAdmin && (
              <button 
                onClick={(e) => handleDelete(e, p.id)}
                className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-md z-10"
                title="Xóa ảnh này"
              >
                <Trash2 size={14} className="md:w-4 md:h-4" />
              </button>
            )}
            <img src={p.url} alt={`Kỷ niệm ${p.time}`} className="w-full aspect-square object-cover bg-slate-200 pointer-events-none" />
            <div className="mt-2 md:mt-4 font-mono text-center text-slate-500 font-bold uppercase tracking-widest px-1 md:px-2 text-[10px] md:text-sm line-clamp-2 leading-tight">
              {p.time}
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL PHÓNG TO ẢNH KHI CLICK */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setSelectedPhoto(null)} // Click ra ngoài vùng ảnh sẽ đóng modal
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-4 md:p-6 w-full max-w-2xl shadow-2xl relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra lớp nền đen
            >
              <button 
                onClick={() => setSelectedPhoto(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors z-10 bg-slate-100 p-2 rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/5 mb-4">
                <img src={selectedPhoto.url} alt="Phóng to" className="max-h-[65vh] w-auto object-contain rounded-xl" />
              </div>

              <p className="font-mono font-bold text-slate-700 text-base md:text-lg text-center uppercase tracking-wider px-4">
                {selectedPhoto.time}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL THÊM ẢNH (Dành cho Admin) */}
      <AnimatePresence>
        {modalData && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setModalData(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-xl md:text-2xl font-serif text-slate-800 mb-4 text-center">Ghi chú kỷ niệm</h3>
              
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 shadow-inner bg-slate-100">
                <img src={modalData} alt="Preview" className="w-full h-full object-contain" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Mốc thời gian / Lời nhắn</label>
                  <input 
                    type="text" 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="VD: Mùa hè 2026..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-mono text-sm md:text-base"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSavePhoto()}
                  />
                </div>
                
                <button 
                  onClick={handleSavePhoto}
                  disabled={uploading}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {uploading ? "Đang lưu..." : (
                    <>
                      <Send size={18} /> Lưu vào Nhật Ký
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}