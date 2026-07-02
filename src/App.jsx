import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Prediction from "./pages/Prediction";
import Evaluation from "./pages/Evaluation";
import Methodology from "./pages/Methodology";
import GlobalTitans from "./pages/GlobalTitans";
import About from "./pages/About";

import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-between">

        <div>
          {/* NAVBAR ATAS GLOBAL - CYBER GLASSMORPHIC WITH FLOATING MUSIC EMOJIS */}
          {/* NAVBAR ATAS GLOBAL - LIGHTWEIGHT FLOATING MUSIC ENGINE */}
<header className="bg-gradient-to-r from-[#0b4f24] via-[#1DB954] to-[#1ed760] text-white shadow-xl relative overflow-hidden border-b border-white/10">
  
  {/* Pola Dot Grid Matrix di Background */}
  <div 
    className="absolute inset-0 opacity-15"
    style={{
      backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
      backgroundSize: '16px 16px'
    }}
  ></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(255,255,255,0.2),transparent_60%)]"></div>

  {/* KODE ANIMASI SUPER RINGAN (MURNI CSS AKSELERASI BROWSER) */}
  <style>{`
    @keyframes floatUp {
      0% { transform: translateY(110%) rotate(0deg); opacity: 0; }
      10% { opacity: 0.25; }
      90% { opacity: 0.25; }
      100% { transform: translateY(-110%) rotate(360deg); opacity: 0; }
    }
    .note-1 { animation: floatUp 7s infinite linear; left: 15%; animation-delay: 0s; }
    .note-2 { animation: floatUp 9s infinite linear; left: 40%; animation-delay: 2s; }
    .note-3 { animation: floatUp 6s infinite linear; left: 65%; animation-delay: 1s; }
    .note-4 { animation: floatUp 8s infinite linear; left: 85%; animation-delay: 3s; }
  `}</style>

  {/* Wadah Nada Musik Melayang */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
    <span className="absolute bottom-0 text-xl note-1">🎵</span>
    <span className="absolute bottom-0 text-2xl note-2">🎶</span>
    <span className="absolute bottom-0 text-lg note-3">🎼</span>
    <span className="absolute bottom-0 text-xl note-4">🎵</span>
  </div>

  <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between relative z-10">
    
    {/* Sisi Kiri: Branding Premium */}
    <div className="flex items-center gap-4 group">
      <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg flex items-center justify-center group-hover:bg-[#1DB954] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
        <span className="text-xl animate-pulse">⚡</span>
      </div>
      <div>
        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-b from-white via-white to-green-100 bg-clip-text text-transparent group-hover:tracking-wide transition-all duration-300">
          Spotify Insights
        </h1>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <p className="text-[10px] text-green-100/70 font-bold tracking-widest uppercase">
            Predictive Analytics System
          </p>
        </div>
      </div>
    </div>

    {/* Sisi Kanan: Status Kapsul Estetik */}
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 shadow-inner">
        <span className="text-xs font-semibold text-green-300">Algorithm v1.0</span>
        <span className="w-1 h-3 bg-white/20 rounded-full"></span>
        <span className="text-xs font-semibold text-white/80">C4.5 Engine</span>
      </div>
    </div>

  </div>
</header>

          <div className="flex">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Content */}
            <main className="flex-1 p-8">
              <Routes>
                <Route
                  path="/"
                  element={<Dashboard />}
                />

                <Route
                  path="/analytics"
                  element={<Analytics />}
                />

                <Route
                  path="/prediction"
                  element={<Prediction />}
                />

                <Route
                  path="/evaluation"
                  element={<Evaluation />}
                />

                <Route
                  path="/methodology"
                  element={<Methodology />}
                />

                <Route
                  path="/global-titans"
                  element={<GlobalTitans />}
                />

                <Route
                  path="/about"
                  element={<About />}
                />
              </Routes>
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-gray-500 text-sm bg-white border-t border-gray-200">
          Spotify Popularity Prediction Using C4.5 | Group 4 Data Mining | LP3I Depok 2026
        </footer>

      </div>
    </Router>
  );
}

export default App;