import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { Pencil, Eraser, X, PenTool, Highlighter, CircleDot, Undo, Redo } from "lucide-react";

export default function DrawingModal({ isOpen, onClose, onSave, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth }) {
  const canvasRef = useRef(null);
  const [baseColor, setBaseColor] = useState("#000000");
  const [activeBrush, setActiveBrush] = useState("ink");
  const [senderName, setSenderName] = useState("");

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const applyBrushPreset = (type) => {
    canvasRef.current.eraseMode(false);
    setActiveBrush(type);
    let opacity = 1.0;
    let width = 4;

    switch (type) {
      case "pencil": width = 2; opacity = 0.9; break;
      case "ink": width = 4; opacity = 1.0; break;
      case "marker": width = 12; opacity = 0.4; break;
      case "blur": width = 20; opacity = 0.2; break;
      default: break;
    }
    
    setStrokeWidth(width);
    const { r, g, b } = hexToRgb(baseColor);
    setStrokeColor(`rgba(${r}, ${g}, ${b}, ${opacity})`);
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setBaseColor(newColor);
    applyBrushPreset(activeBrush);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-3xl w-full max-w-lg shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={24} /></button>
        
        <div className="space-y-4">
        <input 
            type="text" 
            placeholder="Tên của bạn..." 
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-amber-900"
          />
          <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex gap-1">
              <button title="Bút chì" onClick={() => applyBrushPreset("pencil")} className={`p-2 rounded border ${activeBrush === 'pencil' ? 'bg-blue-100' : ''}`}><Pencil size={20}/></button>
              <button title="Bút mực" onClick={() => applyBrushPreset("ink")} className={`p-2 rounded border ${activeBrush === 'ink' ? 'bg-blue-100' : ''}`}><PenTool size={20}/></button>
              <button title="Marker" onClick={() => applyBrushPreset("marker")} className={`p-2 rounded border ${activeBrush === 'marker' ? 'bg-blue-100' : ''}`}><Highlighter size={20}/></button>
              <button title="Bút Blur" onClick={() => applyBrushPreset("blur")} className={`p-2 rounded border ${activeBrush === 'blur' ? 'bg-blue-100' : ''}`}><CircleDot size={20}/></button>
            </div>
            <div className="w-px h-8 bg-gray-300 mx-1 hidden sm:block" />
            <div className="flex gap-1">
              <button title="Tẩy" onClick={() => canvasRef.current.eraseMode(true)} className="p-2 hover:bg-gray-200 rounded border"><Eraser size={20}/></button>
              <button title="Undo" onClick={() => canvasRef.current.undo()} className="p-2 hover:bg-gray-200 rounded border"><Undo size={20}/></button>
              <button title="Redo" onClick={() => canvasRef.current.redo()} className="p-2 hover:bg-gray-200 rounded border"><Redo size={20}/></button>
            </div>
            <select onChange={(e) => setStrokeWidth(Number(e.target.value))} className="p-1.5 rounded border text-sm w-10 text-[8px]">
              <option value="2">Mảnh</option><option value="4">Thường</option><option value="8">Đậm</option>
            </select>
            <input type="color" value={baseColor} onChange={handleColorChange} className="w-8 h-8 rounded-full cursor-pointer border-none" />
          </div>

          <div className="flex justify-center w-full">
            <ReactSketchCanvas ref={canvasRef} height="300px" width="100%" strokeWidth={strokeWidth} strokeColor={strokeColor} className="border-2 border-gray-200 rounded-xl" />
          </div>

          <button onClick={async () => { const data = await canvasRef.current.exportImage("png"); onSave(data, senderName); }} 
                  className="w-full bg-amber-900 text-white py-3 rounded-full font-bold hover:bg-amber-800 transition-all">Lưu tác phẩm</button>
        </div>
      </div>
    </motion.div>
  );
}