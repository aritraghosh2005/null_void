import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { BoardStore } from '../types/board';
import { persist } from 'zustand/middleware';

const COLORS = [
  '#ff0055', '#00ff99', '#ffff00', '#00ccff', '#9d00ff', '#ff8800',
];

export const useStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      pins: [],
      view: { x: 0, y: 0, scale: 1 },

      boardTitle: 'Null Void',
      
      updateBoardTitle: (title) => set({ boardTitle: title }),
      
      history: [],
      future: [],

      saveHistory: () => {
        const { pins, history } = get();
        const newHistory = [...history, pins].slice(-50); 
        set({ history: newHistory, future: [] });
      },

      undo: () => {
        const { history, future, pins } = get();
        if (history.length === 0) return;
        const previous = history[history.length - 1];
        set({
          pins: previous,
          history: history.slice(0, -1),
          future: [pins, ...future],
        });
      },

      redo: () => {
        const { history, future, pins } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          pins: next,
          history: [...history, pins],
          future: future.slice(1),
        });
      },

      addPin: (type, x, y, content = '', width, height) => {
        get().saveHistory();
        const defaultW = 250;
        const defaultH = 180;
        set((state) => ({
          pins: [...state.pins, {
            id: nanoid(),
            type,
            x,
            y,
            content,
            title: type.toUpperCase(), // [NEW] Default Title
            width: width || defaultW, 
            height: height || defaultH, 
            color: COLORS[Math.floor(Math.random() * COLORS.length)], 
          }]
        }));
      },

      updatePinTitle: (id, title) => {
        get().saveHistory();
        set((state) => ({
          pins: state.pins.map(pin => pin.id === id ? { ...pin, title } : pin)
        }));
      },

      removePin: (id) => {
        get().saveHistory();
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