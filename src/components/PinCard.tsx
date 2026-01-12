"use client";
import React, { useState, useRef } from 'react';
import { Pin } from '../types/board';
import { useStore } from '../store/useStore';

export default function PinCard({ pin }: { pin: Pin }) {
  const updatePosition = useStore((state) => state.updatePinPosition);
  const [isDragging, setIsDragging] = useState(false);
  
  // We need to remember where we grabbed the pin so it doesn't "jump"
  const offset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    
    setIsDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    // Calculate new position relative to the screen
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    
    updatePosition(pin.id, newX, newY);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setIsDragging(false)}
      style={{
        transform: `translate(${pin.x}px, ${pin.y}px)`,
        width: pin.width,
        touchAction: 'none' // Prevents mobile scrolling while dragging
      }}
      className={`absolute p-4 bg-white/90 backdrop-blur border border-white/20 rounded-xl shadow-xl cursor-grab active:cursor-grabbing select-none ${
        isDragging ? "z-50 ring-2 ring-blue-500" : "z-10"
      }`}
    >
      <p className="text-slate-800 pointer-events-none">{pin.content}</p>
    </div>
  );
}