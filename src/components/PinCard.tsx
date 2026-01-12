"use client";
import React, { useState, useRef } from 'react';
import { Pin } from '../types/board';
import { useStore } from '../store/useStore';

export default function PinCard({ pin }: { pin: Pin }) {
  const updatePosition = useStore((state) => state.updatePinPosition);
  const updateContent = useStore((state) => state.updatePinContent);
  const removePin = useStore((state) => state.removePin);
  const saveHistory = useStore((state) => state.saveHistory); // [NEW]
  const view = useStore((state) => state.view);
  
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const header = e.currentTarget as HTMLElement;
    const card = header.parentElement; 
    if (!card) return;

    // [NEW] Save history BEFORE the drag begins
    saveHistory(); 

    const mouseX = (e.clientX - view.x) / view.scale;
    const mouseY = (e.clientY - view.y) / view.scale;

    offset.current = {
      x: mouseX - pin.x,
      y: mouseY - pin.y,
    };
    
    setIsDragging(true);
    header.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const mouseX = (e.clientX - view.x) / view.scale;
    const mouseY = (e.clientY - view.y) / view.scale;
    updatePosition(pin.id, mouseX - offset.current.x, mouseY - offset.current.y);
  };

  return (
    <div
      style={{
        transform: `translate3d(${pin.x}px, ${pin.y}px, 0)`, 
        width: pin.width,
        height: pin.height,
        borderColor: pin.color,
        boxShadow: `0 0 10px ${pin.color}40`,
      }}
      className="absolute top-0 left-0 flex flex-col bg-black/90 backdrop-blur-md border-2 rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
    >
      <div 
        onPointerDown={handlePointerDown} // Using our new handler
        onPointerMove={handlePointerMove}
        onPointerUp={() => setIsDragging(false)}
        className="h-8 w-full cursor-grab active:cursor-grabbing flex items-center justify-between px-2 select-none z-10"
        style={{ backgroundColor: pin.color }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
        </div>
        <button 
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={() => removePin(pin.id)} // removePin handles its own history save
          className="text-black/50 hover:text-black font-bold px-1 rounded transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 relative w-full h-full overflow-hidden">
        {pin.type === 'image' ? (
          <img 
            src={pin.content} 
            alt="pin"
            className="w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />
        ) : (
          <textarea
            value={pin.content}
            onPointerDown={(e) => e.stopPropagation()}
            onFocus={() => saveHistory()} // [NEW] Save history when you click to edit
            onChange={(e) => updateContent(pin.id, e.target.value)}
            placeholder="Type something..."
            className="w-full h-full bg-transparent text-white p-3 resize-none outline-none font-medium leading-relaxed font-mono"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}