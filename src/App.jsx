import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AlertTriangle, LogOut } from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Prediction from "./pages/Prediction";
import Evaluation from "./pages/Evaluation";
import Methodology from "./pages/Methodology";
import GlobalTitans from "./pages/GlobalTitans";
import About from "./pages/About";
import CrispSimulator from "./pages/CrispSimulator"; 

import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [appMode, setAppMode] = useState("expert"); 
  const [simStep, setSimStep] = useState(1); 
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 🔥 SOLUSI ANTI DOUBLE REMINDER: Gunakan Ref untuk melacak step paling real-time
  const simStepRef = useRef(simStep);
  
  useEffect(() => {
    simStepRef.current = simStep;
  }, [simStep]);
  
  const [projectData, setProjectData] = useState({
    title: "",
    vibe: "",
    targetMarket: "",
    manualProblem: "", 
    fileName: "",
    fileHeaders: [],
    totalRows: 0,
    detectedDomain: "",
    missingDataCount: 0,
    uploadedFilesRaw: [], 
    rawData: [],          
    cleanedData: []       
  });
  
  const [exitSignal, setExitSignal] = useState(0);
  const [isPdfDownloaded, setIsPdfDownloaded] = useState(false);

  const [showExitWarning, setShowExitWarning] = useState(false);

  const handleSwitchToDashboard = () => {
    setIsTransitioning(true);
    setAppMode("expert");
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  const confirmExit = () => {
    setProjectData({
      title: "",
      vibe: "",
      targetMarket: "",
      manualProblem: "", 
      fileName: "",
      fileHeaders: [],
      totalRows: 0,
      detectedDomain: "",
      missingDataCount: 0,
      uploadedFilesRaw: [], 
      rawData: [],          
      cleanedData: []       
    });
    setSimStep(1);
    setShowExitWarning(false);
    handleSwitchToDashboard();
  };

  const handleNavbarExit = () => {
    if (appMode === "simulator") {
      // Menggunakan simStepRef agar tidak kena bug stale closure
      if (simStepRef.current === 1) {
        setShowExitWarning(true);
      } else {
        setExitSignal(prev => prev + 1);
      }
    } else {
      setAppMode("expert");
    }
  };

  const handleSimulatorExit = () => {
    // Mengecek state asli, jika di step 1 munculkan modal App.jsx
    // Jika di step 2+, tombol keluar paksa dari CrispSimulator akan langsung jalankan confirmExit() tanpa modal tambahan.
    if (simStepRef.current === 1) {
      setShowExitWarning(true);
    } else {
      confirmExit();
    }
  };

  const triggerDownloadPDF = async () => {
    const element = document.getElementById("spotify-insight-report"); 
    
    if (!element) {
      console.error("❌ Elemen 'spotify-insight-report' tidak ditemukan!");
      alert("Gagal mengunduh: Area konten laporan tidak ditemukan di layar.");
      return;
    }

    const options = {
      margin: [10, 10, 10, 10],
      filename: `Laporan_Spotify_Insights_${projectData.title || "Projek"}.pdf`,
      image: { type: "jpeg", quality: 0.90 }, 
      html2canvas: { 
        scale: 1, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        allowTaint: false
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    try {
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      await html2pdf().set(options).from(element).save();
      setIsPdfDownloaded(true);
    } catch (error) {
      console.error("❌ Eror fatal pada Engine PDF:", error);
      alert("Terjadi kegagalan sistem saat merender PDF. SIlakan cek F12 Console.");
    }
  };

  return (
    <Router>
      {/* TRANSITION LOADER */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-2xl z-[99999] flex flex-col items-center justify-center animate-fade-in duration-300">
          <style>{`
            @keyframes radarPulse {
              0% { transform: scale(0.95); opacity: 1; box-shadow: 0 0 0 0 rgba(29, 185, 84, 0.4); }
              70% { transform: scale(1.1); opacity: 0.5; box-shadow: 0 0 0 40px rgba(29, 185, 84, 0); }
              100% { transform: scale(0.95); opacity: 1; box-shadow: 0 0 0 0 rgba(29, 185, 84, 0); }
            }
            @keyframes spinSlow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .radar-core { animation: radarPulse 2s infinite ease-in-out; }
            .ring-spin { animation: spinSlow 3s infinite linear; }
          `}</style>
          
          <div className="relative flex items-center justify-center mb-8">
            <div className="ring-spin absolute w-28 h-28 rounded-full border-2 border-dashed border-[#1DB954]/30"></div>
            <div className="radar-core w-20 h-20 bg-gradient-to-tr from-[#1DB954] to-emerald-400 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(29,185,84,0.4)] border border-white/20">
              <span className="text-3xl filter drop-shadow-md animate-bounce">💼</span>
            </div>
          </div>
          <div className="text-center space-y-1 px-4">
            <h3 className="text-base font-black tracking-wider text-gray-800 uppercase">
              Synchronizing Analytics Core
            </h3>
            <p className="text-xs font-medium text-gray-400 max-w-xs animate-pulse">
              Reconfiguring metric engines and predictive variables...
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-between overflow-x-hidden">
        <div>
          {/* HEADER */}
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
                      Predictive Analytics System
                    </p>
                  </div>
                </div>
              </div>

              {/* MODE SWITCHER */}
              <div className="flex items-center gap-3 justify-end w-full sm:w-auto">
                <div className="bg-black/40 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/10 flex items-center gap-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] w-full sm:w-auto justify-center transition-all">
                  
                  <button
                    onClick={handleNavbarExit}
                    className={`group relative px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer select-none ${
                      appMode === "expert" 
                        ? "bg-white text-[#1DB954] shadow-[0_4px_15px_rgba(255,255,255,0.3)] scale-100 ring-1 ring-black/5" 
                        : "text-white/60 bg-transparent hover:bg-white/5 hover:text-white hover:scale-[1.03] active:scale-95"
                    }`}
                  >
                    <span className={`transition-transform duration-300 inline-block ${appMode === "expert" ? "scale-110" : "group-hover:animate-bounce"}`}>
                      💼
                    </span>
                    <span className="tracking-wide">System Dashboard</span>
                    {appMode === "expert" && (
                      <span className="w-1 h-1 rounded-full bg-[#1DB954] animate-pulse"></span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setExitSignal(0); 
                      setAppMode("simulator");
                    }}
                    className={`group relative px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer select-none ${
                      appMode === "simulator" 
                        ? "bg-gradient-to-r from-emerald-500 via-[#1DB954] to-green-400 text-white shadow-[0_4px_20px_rgba(29,185,84,0.5)] ring-1 ring-white/20 scale-100" 
                        : "text-white/70 bg-transparent hover:bg-white/5 hover:text-white hover:scale-[1.06] hover:shadow-[0_0_20px_rgba(29,185,84,0.25)] active:scale-95"
                    }`}
                  >
                    {appMode !== "simulator" && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                      </span>
                    )}
                    <span className={`transition-transform duration-300 inline-block ${appMode === "simulator" ? "animate-pulse" : "group-hover:rotate-12 group-hover:scale-120"}`}>
                      🎮
                    </span>
                    <span className="tracking-wide">CRISP Simulator</span>
                    {appMode !== "simulator" && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-emerald-400 transition-all duration-300 group-hover:w-1/3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* MAIN AREA */}
          <div className="flex relative w-full items-start">
            <Sidebar 
              isOpen={isMobileOpen} 
              setIsOpen={setIsMobileOpen} 
              appMode={appMode} 
              simStep={simStep} 
              setSimStep={setSimStep} 
            />
            <div 
              className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out ${
                appMode === "simulator" ? "w-0" : "w-64"
              }`}
            />
            <main className="relative p-5 md:p-8 min-w-0 flex-1 overflow-x-hidden transition-all duration-300">
              {appMode === "expert" ? (
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
                <CrispSimulator 
                  onBackToDashboard={handleSimulatorExit} 
                  externalExitSignal={exitSignal}
                  simStep={simStep}
                  setSimStep={setSimStep}
                  projectData={projectData}
                  setProjectData={setProjectData}
                  triggerDownloadPDF={triggerDownloadPDF}
                  isPdfDownloaded={isPdfDownloaded}
                />
              )}
            </main>
          </div>
        </div>

        <footer className={`text-center py-6 text-gray-500 text-xs sm:text-sm bg-white border-t border-gray-200 transition-all duration-300 ${
          appMode === "simulator" ? "md:pl-0" : "md:pl-64"
        }`}>
          Spotify Popularity Prediction Using C4.5 | Group 4 Data Mining | LP3I Depok 2026
        </footer>
        <ScrollToTop />
      </div>

      {/* MODAL PERINGATAN KELUAR */}
      {showExitWarning && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
            onClick={() => setShowExitWarning(false)}
          ></div>
          
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 text-center space-y-5 relative z-[100001] border border-rose-100 shadow-2xl animate-fade-in">
            <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm shadow-rose-500/10">
              <AlertTriangle size={26} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-slate-900 text-lg tracking-tight">Tinggalkan Simulator?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">
                Jika Anda kembali ke Dashboard, <b>semua progress simulasi dan data yang telah diisi akan dihapus/direset ulang</b>. Anda yakin ingin keluar?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowExitWarning(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} className="stroke-[3]" />
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </Router>
  );
}

export default App;