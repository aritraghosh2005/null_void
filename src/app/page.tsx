"use client";
import MouseTrail from '../components/MouseTrail';
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import PinCard from '../components/PinCard';

export default function Board() {
  const { pins, addPin, view, updateView, undo, redo } = useStore();
  
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          e.shiftKey ? redo() : undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Paste Logic
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                const w = Math.min(img.width, 500);
                const h = (img.height / img.width) * w;
                const worldX = (window.innerWidth / 2 - view.x) / view.scale - (w/2);
                const worldY = (window.innerHeight / 2 - view.y) / view.scale - (h/2);
                addPin('image', worldX, worldY, event.target?.result as string, w, h);
              };
              img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addPin, view]);

  // Zoom Logic
  const handleWheel = (e: React.WheelEvent) => {
    const zoomIntensity = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    const factor = direction * zoomIntensity;
    const newScale = Math.max(0.1, Math.min(view.scale * (1 + factor), 5));

    const wx = (e.clientX - view.x) / view.scale;
    const wy = (e.clientY - view.y) / view.scale;

    const newX = e.clientX - wx * newScale;
    const newY = e.clientY - wy * newScale;

    updateView({ x: newX, y: newY, scale: newScale });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isPanning.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };

  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY });

    if (isPanning.current) {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      updateView({ x: view.x + dx, y: view.y + dy });
      lastMouse.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const worldX = (e.clientX - view.x) / view.scale;
    const worldY = (e.clientY - view.y) / view.scale;
    addPin('text', worldX, worldY);
  };

  return (
    <main 
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      className="w-screen h-screen bg-[#050505] relative overflow-hidden text-white cursor-crosshair"
    >
      <div 
        style={{
          transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
        className="absolute inset-0 w-full h-full"
      >
        <div 
          className="absolute inset-[-500%] w-[1000%] h-[1000%] pointer-events-none opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='2.5' fill='%23555'/%3E%3C/svg%3E")`,
            transform: `translate(${mouse.x / 40}px, ${mouse.y / 40}px)`
          }}
        />

        {isMounted && pins.map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </div>

      <div className="absolute top-12 left-12 pointer-events-none z-[100] select-none">
        <h1 className="font-mono text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
          Null Void
        </h1>
        <div className="flex items-center gap-3 mt-2 pl-1 opacity-70">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]" />
          <p className="font-mono text-xs text-emerald-400/80 tracking-widest uppercase">
             POS: {Math.round(view.x)},{Math.round(view.y)} • ZOOM: {view.scale.toFixed(1)}x
          </p>
        </div>
      </div>

      <MouseTrail />
    </main>
  );
}