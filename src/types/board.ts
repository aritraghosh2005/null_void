export type PinType = 'text' | 'image';

export interface Pin {
  id: string;
  type: PinType;
  x: number;
  y: number;
  content: string;
  title?: string; // [NEW]
  width?: number;
  height?: number;
  color: string;
}

export interface BoardStore {
  pins: Pin[];
  view: { x: number; y: number; scale: number };

  boardTitle: string;
  updateBoardTitle: (title: string) => void;
  // [FIX] Ensure addPin matches the arguments we use
  addPin: (
    type: PinType, 
    x: number, 
    y: number, 
    content?: string, 
    width?: number, 
    height?: number
  ) => void;

  updatePinPosition: (id: string, x: number, y: number) => void;
  updatePinContent: (id: string, content: string) => void;
  updatePinTitle: (id: string, title: string) => void; // [NEW]
  removePin: (id: string) => void;

  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  history: Pin[][]; 
  future: Pin[][];
  
  updateView: (view: Partial<{ x: number, y: number, scale: number }>) => void;
}