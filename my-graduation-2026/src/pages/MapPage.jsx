import { useState, useEffect, useRef } from "react";
import { db } from "../services/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { MapPin, Save, CheckCircle2, XCircle, X } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import { motion, AnimatePresence } from "framer-motion";

function getVisibleImageRect(imgEl) {
  const rect = imgEl.getBoundingClientRect();
  const naturalW = imgEl.naturalWidth || rect.width;
  const naturalH = imgEl.naturalHeight || rect.height;
  const naturalRatio = naturalW / naturalH;
  const boxRatio = rect.width / rect.height;

  const fit = (window.getComputedStyle(imgEl).objectFit || "fill").toLowerCase();

  let width = rect.width;
  let height = rect.height;
  let offsetX = 0;
  let offsetY = 0;

  if (fit === "cover") {
    if (boxRatio > naturalRatio) {
      width = rect.width;
      height = rect.width / naturalRatio;
      offsetY = (rect.height - height) / 2;
    } else {
      height = rect.height;
      width = rect.height * naturalRatio;
      offsetX = (rect.width - width) / 2;
    }
  } else if (fit === "contain") {
    if (boxRatio > naturalRatio) {
      height = rect.height;
      width = rect.height * naturalRatio;
      offsetX = (rect.width - width) / 2;
    } else {
      width = rect.width;
      height = rect.width / naturalRatio;
      offsetY = (rect.height - height) / 2;
    }
  }

  return {
    left: rect.left + offsetX,
    top: rect.top + offsetY,
    width,
    height,
  };
}

export default function MapPage() {
  const { isAdmin } = useAdmin();
  const [marker, setMarker] = useState({ x: 50, y: 50 });
  const [isChanged, setIsChanged] = useState(false);
  const [notification, setNotification] = useState(null); 
  const mapRef = useRef(null); 
  const imgRef = useRef(null); 

  useEffect(() => {
    return onSnapshot(doc(db, "status", "location"), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setMarker(docSnapshot.data());
        setIsChanged(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const getPercentFromEvent = (clientX, clientY) => {
    if (!imgRef.current) return marker;
    const imgRect = getVisibleImageRect(imgRef.current);
    let x = ((clientX - imgRect.left) / imgRect.width) * 100;
    let y = ((clientY - imgRect.top) / imgRect.height) * 100;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    return { x, y };
  };

  const handleMapClick = (e) => {
    if (!isAdmin) return;
    setMarker(getPercentFromEvent(e.clientX, e.clientY));
    setIsChanged(true);
  };

  const handleDragEnd = (e, info) => {
    if (!isAdmin) return;
    setMarker(getPercentFromEvent(info.point.x, info.point.y));
    setIsChanged(true);
  };

  const handleSaveLocation = async () => {
    try {
      await setDoc(doc(db, "status", "location"), marker, { merge: true });
      setIsChanged(false);
      setNotification({ type: "success", message: "Đã lưu vị trí thành công!" });
    } catch (error) {
      console.error("Lỗi khi lưu vị trí:", error);
      setNotification({ type: "error", message: "Có lỗi xảy ra khi lưu vị trí." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 p-6 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">Vị Trí Buổi Lễ</h2>
          <p className="text-slate-500 mt-2">Theo dõi vị trí hiện tại của chủ nhân buổi lễ</p>
        </div>

        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Guide" />
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <div ref={mapRef} className="relative group bg-slate-200">
            <img
              ref={imgRef}
              src="/src/assets/image.png"
              className={`w-full h-auto block ${isAdmin ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
              onClick={handleMapClick}
              alt="Bản đồ"
              draggable={false}
            />

            {isAdmin && isChanged && (
              <button
                onClick={handleSaveLocation}
                className="absolute bottom-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold animate-bounce"
              >
                <Save size={20} />
                Lưu Vị Trí
              </button>
            )}

            <motion.div
              key={`${marker.x}-${marker.y}`}
              drag={isAdmin}
              dragConstraints={mapRef}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              className={`absolute flex flex-col items-center justify-start ${isAdmin ? 'cursor-grab active:cursor-grabbing pointer-events-auto z-40' : 'pointer-events-none z-10'}`}
              style={{
                left: `${marker.x}%`,
                top: `${marker.y}%`,
                width: "6rem",
                height: "4rem",
                marginLeft: "-3rem",
                marginTop: "-2.5rem",
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative flex flex-col items-center w-full"
              >
                <MapPin className="text-red-600 fill-red-600 drop-shadow-md z-10" size={40} />
                <div className="absolute top-[40px] bg-white px-2 py-1 rounded-md shadow-[0_5px_15px_rgba(0,0,0,0.2)] text-[10px] font-bold whitespace-nowrap text-slate-800 z-20">
                  TÔI Ở ĐÂY!
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-6"
            onClick={() => setNotification(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl px-6 py-8 max-w-sm w-full flex flex-col items-center text-center"
            >
              <button
                onClick={() => setNotification(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>

              {notification.type === "success" ? (
                <CheckCircle2 className="text-green-500 mb-3" size={48} />
              ) : (
                <XCircle className="text-red-500 mb-3" size={48} />
              )}

              <p className="text-slate-800 font-semibold text-lg">{notification.message}</p>

              <button
                onClick={() => setNotification(null)}
                className={`mt-5 px-6 py-2 rounded-full font-bold text-white ${
                  notification.type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}