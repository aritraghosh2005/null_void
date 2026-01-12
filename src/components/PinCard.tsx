"use client";
import React, { useState, useRef } from 'react';
import { Pin } from '../types/board';
import { useStore } from '../store/useStore';

// [HELPER] Luminance check
const isBrightColor = (hex: string) => {
  const c = hex.substring(1); 
  const rgb = parseInt(c, 16); 
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; 
  return luma > 140; 
};

// [HELPER] Kinetic Animation
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
    // Prevent interaction with inputs/buttons from starting a drag
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;

    e.stopPropagation(); // Stop event from bubbling to background
    
    const header = e.currentTarget as HTMLElement;
    const card = header.parentElement; 
    if (!card) return;

    saveHistory(); 

    const mouseX = (e.clientX - view.x) / view.scale;
    const mouseY = (e.clientY - view.y) / view.scale;

    offset.current = { x: mouseX - pin.x, y: mouseY - pin.y };
    setIsDragging(true);
    header.setPointerCapture(e.pointerId);
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

  // [FIXED] Single click handler for Edit
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
      // Prevent background double-click (New Card) when clicking the card itself
      onDoubleClick={(e) => e.stopPropagation()}
      className="absolute top-0 left-0 flex flex-col bg-black/90 backdrop-blur-md border-2 rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
    >
      {/* HEADER */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        // Parent has cursor-grab for the empty areas
        className="header-trigger h-8 w-full cursor-grab active:cursor-grabbing flex items-center justify-between px-3 z-10 border-b border-white/10 group"
        style={{ backgroundColor: pin.color }}
      >
        <div 
          // [FIX] cursor-text forces the 'I-beam' cursor
          // [FIX] onPointerDown stopPropagation prevents dragging when clicking the text
          className="flex-1 mr-2 h-full flex items-center cursor-text" 
          onClick={handleTitleClick}
          onPointerDown={(e) => e.stopPropagation()} 
        >
          {isEditingTitle ? (
            <input 
              autoFocus
              defaultValue={pin.title || pin.type.toUpperCase()}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit(e)}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className={`w-full bg-transparent font-bold font-mono text-xs uppercase focus:outline-none ${textColorClass} placeholder:${isDarkText ? 'text-black/50' : 'text-white/50'}`}
            />
          ) : (
            <div className="w-full h-full flex items-center">
               <AnimatedTitle 
                  text={pin.title || pin.type.toUpperCase()} 
                  isDarkText={isDarkText} 
               />
            </div>
          )}
        </div>
        
        <button 
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={() => removePin(pin.id)}
          className={`${mutedTextClass} font-bold px-1 rounded transition-colors`}
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