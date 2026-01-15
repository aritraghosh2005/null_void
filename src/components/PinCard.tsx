"use client";
import React, { useState, useRef } from 'react';
import { Pin } from '../types/board';
import { useStore } from '../store/useStore';

const isBrightColor = (hex: string) => {
  const c = hex.substring(1); 
  const rgb = parseInt(c, 16); 
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; 
  return luma > 140; 
};

const AnimatedTitle = ({ text, isDarkText }: { text: string, isDarkText: boolean }) => {
  return (
    <div 
      className="kinetic-title select-none pointer-events-none"
      style={{
        '--c-primary': isDarkText ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
        '--c-secondary': isDarkText ? '#000000' : '#ffffff',
      } as React.CSSProperties}
    >
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          data-char={char} 
          style={{ '--index': i } as React.CSSProperties}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default function PinCard({ pin }: { pin: Pin }) {
  const updatePosition = useStore((state) => state.updatePinPosition);
  const updateContent = useStore((state) => state.updatePinContent);
  const updateTitle = useStore((state) => state.updatePinTitle);
  const removePin = useStore((state) => state.removePin);
  const saveHistory = useStore((state) => state.saveHistory);
  const view = useStore((state) => state.view);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const isDarkText = isBrightColor(pin.color);
  const textColorClass = isDarkText ? 'text-black' : 'text-white';
  const mutedTextClass = isDarkText ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white';

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation(); 
    e.preventDefault(); 
    
    saveHistory(); 

    const mouseX = (e.clientX - view.x) / view.scale;
    const mouseY = (e.clientY - view.y) / view.scale;

    offset.current = { x: mouseX - pin.x, y: mouseY - pin.y };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const mouseX = (e.clientX - view.x) / view.scale;
    const mouseY = (e.clientY - view.y) / view.scale;
    updatePosition(pin.id, mouseX - offset.current.x, mouseY - offset.current.y);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsEditingTitle(true);
  };

  const handleTitleSubmit = (e: React.FocusEvent | React.KeyboardEvent) => {
    setIsEditingTitle(false);
    const target = e.target as HTMLInputElement;
    if (target.value.trim()) {
      updateTitle(pin.id, target.value.trim().toUpperCase());
    }
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
      onDoubleClick={(e) => e.stopPropagation()} 
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute top-0 left-0 flex flex-col bg-black/90 backdrop-blur-md border-2 rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
    >
      {/* HEADER (Draggable Area) */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        // [FIX] Added 'header-trigger' back so the CSS animation works
        className="header-trigger relative h-8 w-full cursor-grab active:cursor-grabbing flex items-center justify-between px-3 z-10 border-b border-white/10 group"
        style={{ backgroundColor: pin.color }}
      >
        
        {/* INVISIBLE EDIT ZONE (Left 25%) */}
        {!isEditingTitle && (
          <div 
            onClick={handleTitleClick}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute top-0 left-0 h-full w-[25%] z-20 cursor-text hover:bg-white/10"
            title="Click here to edit"
          />
        )}

        {/* TEXT DISPLAY (Full Width underneath) */}
        <div className="flex-1 mr-8 h-full flex items-center select-none overflow-hidden">
          {isEditingTitle ? (
            <input 
              autoFocus
              defaultValue={pin.title || pin.type.toUpperCase()}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit(e)}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className={`w-full bg-transparent font-bold font-mono text-xs uppercase focus:outline-none ${textColorClass} placeholder:${isDarkText ? 'text-black/50' : 'text-white/50'} z-30 relative`}
            />
          ) : (
            <div className="w-full h-full flex items-center pointer-events-none">
               <AnimatedTitle 
                  text={pin.title || pin.type.toUpperCase()} 
                  isDarkText={isDarkText} 
               />
            </div>
          )}
        </div>
        
        {/* CROSS BUTTON (Fixed Right) */}
        <button 
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={() => removePin(pin.id)}
          className={`${mutedTextClass} absolute right-2 w-6 h-6 flex items-center justify-center rounded-full transition-transform duration-200 hover:rotate-90 hover:bg-black/10 z-20`}
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
            onMouseDown={(e) => e.stopPropagation()}
            onFocus={() => saveHistory()}
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