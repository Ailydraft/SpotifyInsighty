import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter di sini dihapus karena sudah diganti HashRouter di App.jsx */}
    <App />
  </React.StrictMode>
)