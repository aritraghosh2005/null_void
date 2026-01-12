export type PinType = 'text' | 'image';

export interface Pin {
  id: string;
  type: PinType;
  x: number;       // Horizontal position in pixels
  y: number;       // Vertical position in pixels
  content: string; // The text or the Image URL
  width: number;
  height: number;
}

export interface BoardStore {
  pins: Pin[];
  addPin: (type: PinType, x: number, y: number) => void;
  updatePinPosition: (id: string, x: number, y: number) => void;
  removePin: (id: string) => void;
}