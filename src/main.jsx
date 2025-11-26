import React from 'react'
import ReactDOM from 'react-dom/client'
window.global = window; // Polyfill for simple-peer
import App from './App.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SocketProvider>
            <App />
        </SocketProvider>
    </React.StrictMode>,
)
