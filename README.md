# Null Void 🌑

**Null Void** is a minimalist, infinite creative canvas built for visual thinkers. It allows users to place text notes and images onto a limitless, zoomable grid. Featuring high-performance kinetic typography, smooth mouse trails, and a spatial interface, it serves as a modern mood board or brainstorming tool.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://null-void-cu6c.vercel.app/)

## ✨ Features

### 🎨 Infinite Canvas
- **Pan & Zoom:** Navigate an endless workspace with smooth, momentum-based zooming and panning.
- **Spatial Memory:** Your board state (pins, position, zoom level) is automatically saved to Local Storage and restored upon return.
- **Parallax Grid:** A subtle, dot-matrix background that shifts with your perspective to provide depth.

### 📌 Smart Pins
- **Text Pins:** Double-click anywhere to create editable sticky notes.
- **Image Pins:** Paste images (`Ctrl+V`) directly from your clipboard to the canvas.
- **Kinetic Typography:** Hovering over pin titles triggers a "Norris-style" grapheme animation for a premium tactile feel.
- **Color Coding:** Pins are automatically assigned vibrant, neon-accented colors.

### 🛠 Interaction & UX
- **Drag & Drop:** smooth, rigid-body dragging for organizing content.
- **Time Travel:** Robust **Undo (Ctrl+Z)** and **Redo (Ctrl+Y)** system that tracks position, content, and creation history.
- **Mouse Trail:** A high-performance, lag-free cursor trail that adds fluid visual feedback.
- **Glassmorphism:** UI elements feature frosted glass effects (`backdrop-blur`) for a modern aesthetic.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Modules
- **State Management:** Zustand (with Persist middleware)
- **Typography:** Geist Sans & Mono / Custom Kinetic CSS
- **Icons:** Native SVG generation

---

## 📦 Installation & Setup

Follow these steps to get a local copy up and running.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the Repository
Open your terminal and run:

```bash
git clone [https://github.com/aritraghosh2005/null-void.git](https://github.com/YOUR_USERNAME/null-void.git)
cd null-void
```
### 2. Install Dependencies

```bash
npm install
# or
yarn install
```
### 3. Run the Development Server
```bash
npm run dev
```
*Open http://localhost:3000 with your browser to see the result.*

## 🎮 How to Use
| Action | Control / Interaction | Note |
| :--- | :--- | :--- |
| **Pan Canvas** | Click & Drag | Grab any empty space to move around |
| **Zoom In/Out** | Mouse Wheel (Scroll) | Zooms towards your cursor position |
| **Create Text Note** | Double-click | Creates a new card at cursor location |
| **Add Image** | `Ctrl + V` (Paste) | Paste an image directly from clipboard |
| **Move Pin** | Drag Header | Grab the colored top bar of any card |
| **Edit Title** | Single Click | Click the header text to rename (e.g., "TODO") |
| **Edit Content** | Click Text Area | Type inside the card body |
| **Undo** | `Ctrl + Z` | Reverts move, text, or delete actions |
| **Redo** | `Ctrl + Y` | Restores the last undone action |
| **Delete Pin** | Click **✕** | Located in the top-right corner of the pin |

## 📂 Project Structure
```bash
src/
├── app/
│   ├── layout.tsx      # Global font and style definitions
│   └── page.tsx        # Main canvas logic (Zoom/Pan/Events)
├── components/
│   ├── MouseTrail.tsx  # The fluid cursor animation
│   └── PinCard.tsx     # The individual card component (Logic + UI)
├── store/
│   └── useStore.ts     # Global state (Zustand) + History implementation
├── types/
│   └── board.ts        # TypeScript interfaces for Pins and Board
└── globals.css         # Tailwind directives and Kinetic CSS animations
```

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📝 License
Distributed under the MIT License.

Built with 🖤 by Aritra Ghosh
