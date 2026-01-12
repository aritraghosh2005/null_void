import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { BoardStore } from '../types/board';
import { persist } from 'zustand/middleware';

// [NEW] A set of bright, unique colors
const COLORS = [
  '#ff0055', // Neon Red/Pink
  '#00ff99', // Cyber Green
  '#ffff00', // Bright Yellow
  '#00ccff', // Electric Blue
  '#9d00ff', // Vivid Purple
  '#ff8800', // Neon Orange
];

export const useStore = create<BoardStore>()(
  persist(
    (set) => ({
      pins: [],

      addPin: (type, x, y) => set((state) => ({
        pins: [...state.pins, {
          id: nanoid(),
          type,
          x,
          y,
          content: '', // Start empty so it's ready to type
          width: 250,
          height: 180, // Slightly taller to accommodate header
          color: COLORS[Math.floor(Math.random() * COLORS.length)], // [NEW] Assign random color
        }]
      })),

      updatePinPosition: (id, x, y) => set((state) => ({
        pins: state.pins.map(pin => pin.id === id ? { ...pin, x, y } : pin)
      })),

      // [NEW] Action to update text
      updatePinContent: (id, content) => set((state) => ({
        pins: state.pins.map(pin => pin.id === id ? { ...pin, content } : pin)
      })),

      removePin: (id) => set((state) => ({
        pins: state.pins.filter(pin => pin.id !== id)
      })),
    }),
    { name: 'null-void-storage' }
  )
);