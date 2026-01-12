import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { BoardStore, Pin } from '../types/board'; // Ensure Pin is imported
import { persist } from 'zustand/middleware';

const COLORS = [
  '#ff0055', '#00ff99', '#ffff00', '#00ccff', '#9d00ff', '#ff8800',
];

export const useStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      pins: [],
      view: { x: 0, y: 0, scale: 1 },
      
      // [NEW] Time Travel Arrays
      history: [],
      future: [],

      // 1. SAVE SNAPSHOT
      saveHistory: () => {
        const { pins, history } = get();
        // Limit history to last 50 steps to save memory
        const newHistory = [...history, pins].slice(-50); 
        set({ history: newHistory, future: [] });
      },

      // 2. UNDO
      undo: () => {
        const { history, future, pins } = get();
        if (history.length === 0) return;

        const previous = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        set({
          pins: previous,
          history: newHistory,
          future: [pins, ...future], // Save current state to future
        });
      },

      // 3. REDO
      redo: () => {
        const { history, future, pins } = get();
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
          pins: next,
          history: [...history, pins],
          future: newFuture,
        });
      },

      addPin: (type, x, y, content = '', width, height) => {
        get().saveHistory(); // [IMPORTANT] Save before adding
        const defaultW = 250;
        const defaultH = 180;
        set((state) => ({
          pins: [...state.pins, {
            id: nanoid(),
            type,
            x,
            y,
            content,
            width: width || defaultW, 
            height: height || defaultH, 
            color: COLORS[Math.floor(Math.random() * COLORS.length)], 
          }]
        }));
      },

      removePin: (id) => {
        get().saveHistory(); // [IMPORTANT] Save before removing
        set((state) => ({
          pins: state.pins.filter(pin => pin.id !== id)
        }));
      },

      updatePinPosition: (id, x, y) => set((state) => ({
        pins: state.pins.map(pin => pin.id === id ? { ...pin, x, y } : pin)
      })),

      updatePinContent: (id, content) => set((state) => ({
        pins: state.pins.map(pin => pin.id === id ? { ...pin, content } : pin)
      })),

      updateView: (newView) => set((state) => ({
        view: { ...state.view, ...newView }
      })),
    }),
    { name: 'null-void-storage' }
  )
);