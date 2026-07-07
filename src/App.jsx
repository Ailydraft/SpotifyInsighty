import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Prediction from "./pages/Prediction";
import Evaluation from "./pages/Evaluation";
import Methodology from "./pages/Methodology";
import GlobalTitans from "./pages/GlobalTitans";
import About from "./pages/About";
import CrispSimulator from "./pages/CrispSimulator"; // Komponen Baru Simulator

import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // STATE UTAMA: Mengatur perpindahan Section/Dashboard
  const [appMode, setAppMode] = useState("expert"); // Pilihan: 'expert' atau 'simulator'
  const [simStep, setSimStep] = useState(1); // Mengatur tahapan langkah CRISP-DM (1-6)

  return (
    <Router>
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-between overflow-x-hidden">
        <div>
          {/* NAVBAR ATAS GLOBAL WITH FLOATING MUSIC ENGINE */}
          <header className="bg-gradient-to-r from-[#0b4f24] via-[#1DB954] to-[#1ed760] text-white shadow-xl relative overflow-hidden border-b border-white/10">
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            ></div>

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

            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
              <span className="absolute bottom-0 text-xl note-1">🎵</span>
              <span className="absolute bottom-0 text-2xl note-2">🎶</span>
              <span className="absolute bottom-0 text-lg note-3">🎼</span>
              <span className="absolute bottom-0 text-xl note-4">🎵</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              
              {/* Sisi Kiri: Branding + Hamburger */}
              <div className="flex items-center gap-3 sm:gap-4 group w-full sm:w-auto">
                <button 
                  onClick={() => setIsMobileOpen(true)}
                  className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </button>

                <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg flex items-center justify-center">
                  <span className="text-xl animate-pulse">⚡</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-b from-white via-white to-green-100 bg-clip-text text-transparent">
                    Spotify Insights
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <p className="text-[9px] sm:text-[10px] text-green-100/70 font-bold tracking-widest uppercase">
                      {appMode === "expert" ? "Predictive Analytics System" : "CRISP-DM Interactive Simulator"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sisi Kanan: NEO-VIBRANT MODE SWITCHER CAPSULE */}
              <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
                <div className="bg-black/30 backdrop-blur-xl p-1 rounded-2xl border border-white/10 flex items-center gap-1 shadow-inner w-full sm:w-auto justify-center">
                  <button
                    onClick={() => setAppMode("expert")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                      appMode === "expert"
                        ? "bg-white text-[#1DB954] shadow-md scale-100"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    💼 System Dashboard
                  </button>
                  <button
                    onClick={() => setAppMode("simulator")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                      appMode === "simulator"
                        ? "bg-gradient-to-r from-emerald-500 to-[#1DB954] text-white shadow-lg ring-1 ring-white/10"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    🎮 CRISP Simulator
                  </button>
                </div>
              </div>

            </div>
          </header>

          <div className="flex relative w-full items-start">
            {/* Mengirim data kendali mode ke Sidebar */}
            <Sidebar 
              isOpen={isMobileOpen} 
              setIsOpen={setIsMobileOpen} 
              appMode={appMode} 
              simStep={simStep} 
              setSimStep={setSimStep} 
            />

            {/* AREA MAIN CONTENT KONDISIONAL (Diberi md:ml-64 agar konten bergeser aman ke kanan) */}
            <main className="flex-1 p-5 md:p-8 min-w-0 w-full overflow-x-hidden md:ml-64">
              {appMode === "expert" ? (
                /* SECTION 1: Navigasi Halaman Sistem Utama */
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/prediction" element={<Prediction />} />
                  <Route path="/evaluation" element={<Evaluation />} />
                  <Route path="/methodology" element={<Methodology />} />
                  <Route path="/global-titans" element={<GlobalTitans />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              ) : (
                /* SECTION 2: Interaksi Simulator CRISP-DM Tanpa Pindah Route */
                <CrispSimulator currentStep={simStep} setStep={setSimStep} />
              )}
            </main>
          </div>
        </div>

        {/* FOOTER GLOBAL (Diberi md:pl-64 agar posisi teks simetris di tengah dashboard) */}
        <footer className="text-center py-6 text-gray-500 text-xs sm:text-sm bg-white border-t border-gray-200 md:pl-64">
          Spotify Popularity Prediction Using C4.5 | Group 4 Data Mining | LP3I Depok 2026
        </footer>
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;