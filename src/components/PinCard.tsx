"use client";
import React, { useState, useRef } from 'react';
import { Pin } from '../types/board';
import { useStore } from '../store/useStore';

export default function PinCard({ pin }: { pin: Pin }) {
  const updatePosition = useStore((state) => state.updatePinPosition);
  const updateContent = useStore((state) => state.updatePinContent); // [NEW]
  const removePin = useStore((state) => state.removePin); // [NEW]
  
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // [UPDATED] Only start drag if clicking the Header
  const handlePointerDown = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;

    const card = el.parentElement; 
    if (!card) return;

    const rect = card.getBoundingClientRect();
    
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setIsDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    updatePosition(pin.id, newX, newY);
  };

  return (
    <div
      style={{
        transform: `translate(${pin.x}px, ${pin.y}px)`,
        width: pin.width,
        height: pin.height,
        // [NEW] Dynamic neon border color
        borderColor: pin.color,
      }}
      className="absolute top-0 left-0 flex flex-col bg-black/80 backdrop-blur-md border-2 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-shadow duration-200 hover:shadow-[0_0_25px_rgba(0,0,0,0.7)]"
    >
      {/* --- DRAG HANDLE (Header) --- */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setIsDragging(false)}
        className="h-8 w-full cursor-grab active:cursor-grabbing flex items-center justify-between px-2 select-none"
        style={{ backgroundColor: pin.color }} // Header takes the full color
      >
        <div className="flex gap-1.5">
          {/* Aesthetic "mac-like" dots */}
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
        </div>
        
        {/* DELETE BUTTON */}
        <button 
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking delete
          onClick={() => removePin(pin.id)}
          className="text-black/50 hover:text-black font-bold px-1 rounded transition-colors"
        >
          ✕
        </button>
      </div>

      {/* --- CONTENT AREA (Editable) --- */}
      <textarea
        value={pin.content}
        onChange={(e) => updateContent(pin.id, e.target.value)}
        placeholder="Type something..."
        className="flex-1 w-full bg-transparent text-white p-3 resize-none outline-none font-medium leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
}