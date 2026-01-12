import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { BoardStore } from '../types/board';
import { persist } from 'zustand/middleware';

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
          content: type === 'text' ? 'Double click to edit' : '',
          width: 250,
          height: 150,
        }]
      })),

      updatePinPosition: (id, x, y) => set((state) => ({
        pins: state.pins.map(pin => pin.id === id ? { ...pin, x, y } : pin)
      })),

      removePin: (id) => set((state) => ({
        pins: state.pins.filter(pin => pin.id !== id)
      })),
    }),
    { name: 'null-void-storage' } // This automatically saves your board!
  )
);