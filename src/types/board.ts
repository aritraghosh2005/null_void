export type PinType = 'text' | 'image';

export interface Pin {
  id: string;
  type: PinType;
  x: number;
  y: number;
  content: string;
  width: number;
  height: number;
  color: string; // [NEW] Added color property
}

export interface BoardStore {
  pins: Pin[];
  addPin: (type: PinType, x: number, y: number) => void;
  updatePinPosition: (id: string, x: number, y: number) => void;
  updatePinContent: (id: string, content: string) => void; // [NEW] Added content updater
  removePin: (id: string) => void;
}