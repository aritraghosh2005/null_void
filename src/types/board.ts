// types/board.ts

export type PinType = 'text' | 'image';

export interface Pin {
  id: string;
  type: PinType;
  x: number;
  y: number;
  content: string; // Used for text OR image data URL
  width?: number;  // Optional, since text pins might use defaults
  height?: number; // Optional
  color: string;
}

export interface BoardStore {
  pins: Pin[];
  
  addPin: (
    type: PinType, 
    x: number, 
    y: number, 
    content?: string, 
    width?: number, 
    height?: number
  ) => void;

  saveHistory: () => void; 
  undo: () => void;
  redo: () => void;
  history: Pin[][]; 
  future: Pin[][];

  updatePinPosition: (id: string, x: number, y: number) => void;
  updatePinContent: (id: string, content: string) => void;
  removePin: (id: string) => void;

  // Viewport state for the infinite canvas
  view: { x: number, y: number, scale: number };
  updateView: (view: Partial<{ x: number, y: number, scale: number }>) => void;
}