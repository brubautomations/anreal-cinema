import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // This keeps your neon styling

// 1. The App Component (The Interface)
function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans">
      <h1 className="text-6xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
        ANREAL CINEMA
      </h1>
      <p className="text-xl text-gray-300">The Vault of Time is now Open.</p>
    </div>
  )
}

// 2. The Ignition (Connects to index.html)
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)