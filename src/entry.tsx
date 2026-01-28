import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // <--- This grabs your ORIGINAL design
import './index.css'    // <--- This grabs your ORIGINAL css

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)