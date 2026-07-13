import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, AlertTriangle, DownloadCloud, CheckCircle2, 
  X, HelpCircle, ArrowRight, ArrowLeft, Sparkles, Layers, Loader2, Info, XCircle
} from "lucide-react";

// Impor statis core library html2pdf
import html2pdf from 'html2pdf.js'; 

import Step1Business from "../components/crisp/Step1Business";
import Step2DataUnderstanding from "../components/crisp/Step2DataUnderstanding";
import Step3DataPreparation from "../components/crisp/Step3DataPreparation";
import Step4Modeling from "../components/crisp/Step4Modeling"; 
import Step5Evaluation from "../components/crisp/Step5Evaluation";
import Step6Deployment from "../components/crisp/Step6Deployment";

// ============================================================
// COMPONENT ERROR BOUNDARY (PENGAMAN ANTI-WHITE SCREEN)
// ============================================================
class CrispErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Runtime error caught:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-slate-900 border border-rose-500/30 rounded-3xl text-rose-400 my-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={22} className="animate-bounce text-rose-500 shrink-0" />
            <h3 className="text-base font-black tracking-tight uppercase">Sistem Mendeteksi Kegagalan Runtime Rendering!</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium">Engine simulator mendeteksi adanya malfungsi struktural di dalam komponen pengerjaan aktif Anda.</p>
          <div className="bg-slate-950 text-rose-400 font-mono text-[11px] p-4 rounded-2xl overflow-x-auto max-h-40 border border-slate-800">
            {this.state.error?.toString()}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================
// MAIN COMPONENT ENGINE (CRISP-DM WORKSPACE)
// ============================================================
function CrispSimulator({ onBackToDashboard, externalExitSignal }) {
  const [isSimulatorLoading, setIsSimulatorLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Menghubungkan Pipeline Spotify API...");
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [currentStep, setStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1); 
  const [isPdfDownloaded, setIsPdfDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [customErrorMsg, setCustomErrorMsg] = useState(""); 
  const downloadIntervalRef = useRef(null);

  const defaultProjectData = {
    title: "", vibe: "", targetMarket: "", fileName: "", fileHeaders: [],
    totalRows: 0, cleanedRows: 0, droppedRows: 0, entropyTotal: "0.984",
    selectedFeatures: [], accuracyScore: "93.5%", precisionScore: "91.4%", rules: []
  };

  const [projectData, setProjectData] = useState({ ...defaultProjectData });
  const [systemModal, setSystemModal] = useState({ show: false, type: 'NONE' }); 

  useEffect(() => {
    let progressTimer;
    let textTimer;

    progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setIsSimulatorLoading(false), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const statusLogs = [
      "Mengunduh Arsitektur CRISP-DM...",
      "Sinkronisasi Matriks Audio Fitur...",
      "Inisialisasi Algoritma C4.5 Engine...",
      "Mengamankan Sandbox Workspace...",
      "Workspace Siap Ditempati!"
    ];
    
    let logIndex = 0;
    textTimer = setInterval(() => {
      if (logIndex < statusLogs.length - 1) {
        logIndex++;
        setLoadingText(statusLogs[logIndex]);
      }
    }, 380);

    return () => {
      clearInterval(progressTimer);
      clearInterval(textTimer);
    };
  }, []);

  useEffect(() => {
    if (!isSimulatorLoading) {
      const justReset = sessionStorage.getItem("crisp_just_reset");
      if (justReset === "true") {
        setSystemModal({ show: true, type: "JUST_RESET_NOTICE" });
        sessionStorage.removeItem("crisp_just_reset"); 
      }
    }
  }, [isSimulatorLoading]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const isDataChanged = JSON.stringify(projectData) !== JSON.stringify(defaultProjectData);
      if (!isPdfDownloaded && (currentStep > 1 || isDataChanged)) {
        e.preventDefault(); e.returnValue = 'Proses simulasi sedang berjalan.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (downloadIntervalRef.current) clearInterval(downloadIntervalRef.current);
    };
  }, [isPdfDownloaded, currentStep, projectData]);

  useEffect(() => { if (externalExitSignal > 0) handleExitRequest(); }, [externalExitSignal]);

  const advanceToNextStep = (nextStepNumber) => {
    if (nextStepNumber > furthestStep) setFurthestStep(nextStepNumber);
    setStep(nextStepNumber);
  };

  const handleForceExitAndClear = () => {
    setProjectData({ ...defaultProjectData }); setStep(1); setFurthestStep(1); setIsPdfDownloaded(false);
    setSystemModal({ show: false, type: 'NONE' }); sessionStorage.setItem("crisp_just_reset", "true");
    if (onBackToDashboard) onBackToDashboard();
  };

  // ============================================================
  // ENGINE GENERATE PDF DENGAN SETTING UKURAN AMAN & ANTI POTONG
  // ============================================================
  const executePDFGeneration = (resolvePromise) => {
    const element = document.getElementById('pdf-report-content');
    if (!element) {
      setCustomErrorMsg("Elemen dokumen '#pdf-report-content' tidak ditemukan.");
      setSystemModal({ show: true, type: 'SYSTEM_ERROR' });
      if (resolvePromise) resolvePromise();
      return;
    }

    const shortTitle = projectData.title
      ? projectData.title.trim().split(/\s+/).slice(0, 3).join('_').replace(/[^a-zA-Z0-9_]/g, '')
      : "Riset";

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5], // Atas, Kiri, Bawah, Kanan dikunci proporsional
      filename: `Spotify_CRISP_DM_${shortTitle}.pdf`, 
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, // Menaikkan ketajaman resolusi font saat dirender
        useCORS: true, 
        letterRendering: true, 
        logging: false,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * { box-sizing: border-box !important; }
            body { background: #ffffff !important; }
          `;
          clonedDoc.head.appendChild(style);
        }
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save()
      .then(() => {
        setIsPdfDownloaded(true);
        setSystemModal({ show: true, type: 'REDIRECT_CONFIRM' });
      })
      .catch(err => {
        console.error("Eror internal html2pdf Engine:", err);
        setCustomErrorMsg(err.message || "Terjadi kegagalan rendering matriks.");
        setSystemModal({ show: true, type: 'SYSTEM_ERROR' });
      })
      .finally(() => {
        document.querySelectorAll('.html2canvas-container').forEach(el => el.remove());
        document.body.style.pointerEvents = "auto";
        if (resolvePromise) resolvePromise();
      });
  };

  const triggerDownloadPDF = () => {
    return new Promise((resolve) => {
      if (downloadIntervalRef.current) clearInterval(downloadIntervalRef.current);
      setSystemModal({ show: true, type: 'DOWNLOADING' });
      setDownloadProgress(0);
      
      let progress = 0;
      downloadIntervalRef.current = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 10; 
        if (progress >= 100) {
          progress = 100;
          clearInterval(downloadIntervalRef.current);
          setDownloadProgress(100);
          setTimeout(() => { executePDFGeneration(resolve); }, 300);
        } else {
          setDownloadProgress(progress);
        }
      }, 100);
    });
  };

  const handleExitRequest = () => {
    if (isPdfDownloaded) { if (onBackToDashboard) onBackToDashboard(); return; }
    const isDataPristine = JSON.stringify(projectData) === JSON.stringify(defaultProjectData);
    if (currentStep === 1 && isDataPristine) { if (onBackToDashboard) onBackToDashboard(); return; }
    setSystemModal({ show: true, type: currentStep === 6 ? 'EXIT_FINISHED_STAGE' : 'EXIT_IN_PROGRESS' });
  };

  if (isSimulatorLoading) {
    return (
      <div className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden select-none animate-fade-in">
        <div className="absolute w-[450px] h-[450px] bg-[#1DB954]/10 rounded-full blur-[140px] animate-pulse pointer-events-none" />
        <div className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="relative p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl shadow-emerald-950/30 w-full max-w-[280px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#1DB954]/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex justify-center items-end gap-1 h-11 mb-4 relative z-10">
              <div className="w-1.5 bg-[#1DB954] rounded-full animate-[pulse_0.8s_infinite_ease-in-out] h-6"></div>
              <div className="w-1.5 bg-emerald-400 rounded-full animate-[pulse_0.5s_infinite_ease-in-out] h-11"></div>
              <div className="w-1.5 bg-[#1DB954] rounded-full animate-[pulse_0.7s_infinite_ease-in-out] h-4"></div>
              <div className="w-1.5 bg-emerald-500 rounded-full animate-[pulse_0.6s_infinite_ease-in-out] h-10"></div>
              <div className="w-1.5 bg-[#1DB954] rounded-full animate-[pulse_0.9s_infinite_ease-in-out] h-5"></div>
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] relative z-10">
              <Loader2 size={12} className="animate-spin text-[#1DB954]" /> Tuning System
            </div>
          </div>
          <div className="w-full space-y-3 px-4">
            <div className="h-5 flex items-center justify-center">
              <p className="text-xs font-bold text-slate-300 tracking-tight transition-all duration-300 animate-pulse">
                {loadingText}
              </p>
            </div>
            <div className="w-full max-w-xs mx-auto h-1.5 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
              <div className="h-full bg-gradient-to-r from-[#1DB954] to-emerald-400 rounded-full transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
            </div>
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest block">{loadingProgress}% Loaded</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-slate-100 to-emerald-50/20 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between relative overflow-x-hidden">
      
      <div className="max-w-5xl w-full mx-auto space-y-6 flex-1 flex flex-col justify-center">
        
        {/* PERSISTENT HEADER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/90 backdrop-blur-md p-4 px-6 rounded-2xl border border-slate-200/60 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-[#1DB954] rounded-xl shadow-inner"><Layers size={20} /></div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">CRISP-DM Process Simulator</h2>
              {projectData.title ? (
                <p className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                  Projek: <span className="text-slate-800 font-bold italic">"{projectData.title}"</span>
                </p>
              ) : (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace Linear Mode</p>
              )}
            </div>
          </div>
          <button 
            onClick={handleExitRequest}
            className="w-full sm:w-auto p-2 px-4 bg-slate-50 border border-slate-200/80 text-slate-700 font-black text-xs rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <X size={13} /> Keluar Workspace
          </button>
        </div>

        {/* PROGRESS STEPPER NAVIGATION */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/60 p-4 shadow-sm">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center">
            {[
              { id: 1, label: "01. Business Target" }, { id: 2, label: "02. Data Understand" },
              { id: 3, label: "03. Data Prep" }, { id: 4, label: "04. C4.5 Modeling" },
              { id: 5, label: "05. Evaluation" }, { id: 6, label: "06. Deployment" }
            ].map((s) => {
              const isPast = s.id < currentStep;
              const isCurrent = s.id === currentStep;
              return (
                <div key={s.id} className="space-y-1.5 relative group select-none pointer-events-none">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    isCurrent ? "bg-gradient-to-r from-[#1DB954] to-emerald-400 shadow-sm shadow-emerald-400/50" : isPast ? "bg-emerald-500" : "bg-slate-100"
                  }`} />
                  <span className={`text-[10px] font-black block tracking-tight transition-all duration-300 ${
                    isCurrent ? "text-[#1DB954]" : isPast ? "text-slate-700" : "text-slate-300"
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN VIEWPORT CONTROLLER */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 min-h-[490px] flex flex-col justify-between">
          <div className="w-full animate-fade-in">
            <CrispErrorBoundary>
              {currentStep === 1 && <Step1Business advanceToNextStep={advanceToNextStep} projectData={projectData} setProjectData={setProjectData} />}
              {currentStep === 2 && <Step2DataUnderstanding advanceToNextStep={advanceToNextStep} setStep={setStep} projectData={projectData} setProjectData={setProjectData} />}
              {currentStep === 3 && <Step3DataPreparation advanceToNextStep={advanceToNextStep} setStep={setStep} projectData={projectData} setProjectData={setProjectData} />}
              {currentStep === 4 && <Step4Modeling advanceToNextStep={advanceToNextStep} setStep={setStep} projectData={projectData} setProjectData={setProjectData} />}
              {currentStep === 5 && <Step5Evaluation advanceToNextStep={advanceToNextStep} setStep={setStep} projectData={projectData} />}
              {currentStep === 6 && <Step6Deployment setStep={setStep} triggerDownloadPDF={triggerDownloadPDF} isPdfDownloaded={isPdfDownloaded} projectData={projectData} />}
            </CrispErrorBoundary>
          </div>
        </div>

      </div>

      {/* MODAL OVERLAYS LAYER CONTROL */}
      {systemModal.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          
          {systemModal.type === 'JUST_RESET_NOTICE' && (
            <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border border-slate-100">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <Info size={26} />
              </div>
              <div className="space-y-2 px-2 mb-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Informasi Workspace</h3>
                <p className="text-xs text-slate-500 font-medium">Anda baru saja keluar dari simulator sebelumnya. Seluruh parameter data lama telah dibersihkan.</p>
              </div>
              <button onClick={() => setSystemModal({ show: false, type: 'NONE' })} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer">
                Siap, Mulai Pengujian Baru
              </button>
            </div>
          )}

          {systemModal.type === 'EXIT_IN_PROGRESS' && (
            <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border border-slate-100 relative">
              <button onClick={() => setSystemModal({ show: false, type: 'NONE' })} className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-50">
                <X size={14} />
              </button>
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <AlertTriangle size={26} />
              </div>
              <div className="space-y-2 px-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Progres Pengisian Berjalan!</h3>
                <p className="text-xs text-slate-500 font-medium">Meninggalkan halaman sekarang akan menghapus progres secara permanen.</p>
              </div>
              <div className="space-y-2 pt-5">
                <button onClick={() => setSystemModal({ show: false, type: 'NONE' })} className="w-full py-3 bg-[#111827] text-white font-black text-xs rounded-xl shadow-md cursor-pointer">
                  Kembali Lanjutkan Simulasi
                </button>
                <button onClick={handleForceExitAndClear} className="w-full py-2.5 bg-rose-50 text-rose-600 font-black text-xs rounded-xl border border-rose-100 cursor-pointer">
                  Hapus Progres & Keluar Paksa
                </button>
              </div>
            </div>
          )}

          {systemModal.type === 'EXIT_FINISHED_STAGE' && (
            <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border border-slate-100 relative">
              <button onClick={() => setSystemModal({ show: false, type: 'NONE' })} className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-50">
                <X size={14} />
              </button>
              <div className="w-14 h-14 bg-emerald-50 text-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle size={26} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Cetak Hasil Laporan Riset?</h3>
              <p className="text-xs text-slate-500 mt-2 mb-6 font-medium px-2">Metodologi penambangan data CRISP-DM telah selesai. Jika Anda keluar sekarang tanpa mengunduh PDF, data akan dihapus.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleForceExitAndClear} className="py-3 bg-rose-500 text-white font-black text-xs rounded-xl cursor-pointer">Hapus & Keluar Paksa</button>
                <button onClick={triggerDownloadPDF} className="py-3 bg-emerald-500 text-white font-black text-xs rounded-xl cursor-pointer">Simpan & Download PDF</button>
              </div>
            </div>
          )}

          {systemModal.type === 'DOWNLOADING' && (
            <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border border-slate-100">
              <div className="w-16 h-16 bg-emerald-50 text-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-3 relative overflow-hidden shadow-inner">
                <DownloadCloud size={26} className="animate-bounce relative z-10" />
                <div className="absolute bottom-0 left-0 right-0 bg-emerald-100 transition-all duration-300" style={{ height: `${downloadProgress}%` }}></div>
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Menyusun Struktur Dokumen Laporan</h3>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-4 mb-2">
                <div className="h-full bg-gradient-to-r from-[#1DB954] to-emerald-400 transition-all duration-300" style={{ width: `${downloadProgress}%` }}></div>
              </div>
              <span className="text-xs font-mono font-black text-[#1DB954]">{downloadProgress}% Kompilasi Matriks</span>
            </div>
          )}

          {systemModal.type === 'SYSTEM_ERROR' && (
            <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border border-rose-100 relative">
              <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <XCircle size={28} />
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Gagal Mengekspor Berkas</h3>
              <p className="text-xs text-slate-500 mt-2 mb-6 font-medium px-4 leading-relaxed bg-slate-50 py-3 rounded-xl border border-slate-100 font-mono text-left">
                {customErrorMsg}
              </p>
              <button onClick={() => setSystemModal({ show: false, type: 'NONE' })} className="w-full py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-colors shadow-md cursor-pointer">Tutup Batalkan Dialog</button>
            </div>
          )}

          {systemModal.type === 'REDIRECT_CONFIRM' && (
            <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border border-slate-100 relative">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Dokumentasi PDF Berhasil Diekspor</h3>
              <p className="text-xs text-slate-500 mt-2 mb-6 font-medium px-2">Seluruh log parameter simulasi penambangan data C4.5 telah diunduh dengan aman.</p>
              <div className="flex gap-3">
                <button onClick={() => setSystemModal({ show: false, type: 'NONE' })} className="flex-1 py-3 bg-slate-100 text-slate-600 text-xs font-black rounded-xl cursor-pointer">Tetap Di Sini</button>
                <button onClick={() => { setSystemModal({ show: false, type: 'NONE' }); if(onBackToDashboard) onBackToDashboard(); }} className="flex-1 py-3 bg-slate-900 text-white text-xs font-black rounded-xl cursor-pointer">Kembali ke Dasbor</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 🚀 VERSI FINAL: PDF LAYOUT PREMIUM, ANTI-POTONG KANAN, ANTI-BELAH TENGAH */}
      {/* ===================================================================== */}
      <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none select-none">
        <div id="pdf-report-content" style={{ width: '690px', padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', color: '#1e293b', boxSizing: 'border-box' }}>
          
          {/* BANNER HEADER */}
          <div style={{ paddingBottom: '16px', marginBottom: '20px', borderBottom: '3px solid #1DB954', display: 'table', width: '100%' }}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '70%' }}>
              <div style={{ backgroundColor: '#e6f7ed', color: '#1DB954', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', display: 'inline-block', marginBottom: '6px', tracking: '0.1em' }}>
                EXECUTIVE CRISP-DM ANALYSIS REPORT
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0', letterSpacing: '-0.02em' }}>
                LAPORAN HASIL PENAMBANGAN DATA SPOTIFY
              </h1>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0', fontWeight: '500' }}>
                Klasifikasi Pola Fitur Audio Menggunakan Algoritma Decision Tree C4.5
              </p>
            </div>
            <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '30%', textAlign: 'right' }}>
              <span style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                ID: C45-{Date.now().toString().slice(-6)}
              </span>
              <p style={{ fontSize: '9px', color: '#94a3b8', margin: '6px 0 0 0', fontWeight: 'bold' }}>Tgl Sinkronisasi: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* TAHAP 1: BUSINESS UNDERSTANDING */}
          <div style={{ marginBottom: '20px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontWeight: '800', fontSize: '11px', color: '#0f172a', textTransform: 'uppercase' }}>
              <span style={{ width: '4px', height: '12px', backgroundColor: '#1DB954', marginRight: '6px', display: 'inline-block', borderRadius: '1px' }}></span>
              01. Tahap Business Understanding
            </div>
            <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold', width: '30%', backgroundColor: '#f8fafc', color: '#475569' }}>Judul Riset Projek</td>
                  <td style={{ padding: '8px', fontWeight: 'bold', color: '#0f172a' }}>"{projectData.title || "Analisis Prediksi Efektivitas Track Spotify"}"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold', backgroundColor: '#f8fafc', color: '#475569' }}>Kriteria Vibe Target</td>
                  <td style={{ padding: '8px', color: '#334155' }}>{projectData.vibe || "Acoustic & Low-Fidelity Mode (Chill Vibes)"}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold', backgroundColor: '#f8fafc', color: '#475569' }}>Segmentasi Audiens</td>
                  <td style={{ padding: '8px', color: '#334155' }}>{projectData.targetMarket || "Kreator Konten & Pengembang Playlist Eksklusif"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TAHAP 2: DATA UNDERSTANDING */}
          <div style={{ marginBottom: '20px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontWeight: '800', fontSize: '11px', color: '#0f172a', textTransform: 'uppercase' }}>
              <span style={{ width: '4px', height: '12px', backgroundColor: '#1DB954', marginRight: '6px', display: 'inline-block', borderRadius: '1px' }}></span>
              02. Tahap Data Understanding
            </div>
            <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold', width: '30%', backgroundColor: '#f8fafc', color: '#475569' }}>Nama Sumber Berkas</td>
                  <td style={{ padding: '8px', fontFamily: 'monospace', color: '#2563eb', fontWeight: 'bold' }}>{projectData.fileName || "dataset_spotify_raw.csv"}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold', backgroundColor: '#f8fafc', color: '#475569' }}>Total Volume Baris</td>
                  <td style={{ padding: '8px', fontWeight: 'bold', color: '#0f172a' }}>{projectData.totalRows ? Number(projectData.totalRows).toLocaleString('id-ID') : "114.000"} Rekam Sampel</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold', backgroundColor: '#f8fafc', color: '#475569' }}>Struktur Headers</td>
                  <td style={{ padding: '8px', color: '#64748b', fontSize: '9px', lineHeight: '1.4' }}>
                    {projectData.fileHeaders && projectData.fileHeaders.length > 0 
                      ? projectData.fileHeaders.join(", ") 
                      : "track_id, artists, album_name, track_name, popularity, duration_ms, explicit, danceability, energy, key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TAHAP 3: DATA PREPARATION */}
          <div style={{ marginBottom: '20px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontWeight: '800', fontSize: '11px', color: '#0f172a', textTransform: 'uppercase' }}>
              <span style={{ width: '4px', height: '12px', backgroundColor: '#1DB954', marginRight: '6px', display: 'inline-block', borderRadius: '1px' }}></span>
              03. Tahap Data Preparation
            </div>
            
            {/* Tabel pembersih baris data */}
            <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', marginBottom: '8px', fontSize: '10px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%', paddingRight: '6px' }}>
                    <div style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>Lolos Filter & Cleaning</span>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#10b981' }}>{projectData.cleanedRows ? Number(projectData.cleanedRows).toLocaleString('id-ID') : "113.999"}</span>
                    </div>
                  </td>
                  <td style={{ width: '50%', paddingLeft: '6px' }}>
                    <div style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}>Anomali/Missing Dropped</span>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#dc2626' }}>{projectData.droppedRows || 1} Baris</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
              <span style={{ display: 'block', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>Fitur Terseleksi (Prediktor Utama):</span>
              <div style={{ display: 'block' }}>
                {(() => {
                  const features = Array.isArray(projectData.selectedFeatures) && projectData.selectedFeatures.length > 0
                    ? projectData.selectedFeatures 
                    : ['instrumentalness', 'danceability', 'tempo', 'energy', 'valence'];
                  return features.map((f, i) => (
                    <span key={i} style={{ display: 'inline-block', backgroundColor: '#f1f5f9', color: '#334155', padding: '3px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', border: '1px solid #cbd5e1', marginRight: '4px', marginBottom: '4px' }}>
                      ⚡ {f.trim()}
                    </span>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* TAHAP 4: MODELING (ALGORITMA C4.5) */}
          <div style={{ marginBottom: '20px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontWeight: '800', fontSize: '11px', color: '#0f172a', textTransform: 'uppercase' }}>
              <span style={{ width: '4px', height: '12px', backgroundColor: '#1DB954', marginRight: '6px', display: 'inline-block', borderRadius: '1px' }}></span>
              04. Tahap Modeling (C4.5 Decision Tree Structure)
            </div>
            <div style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
                Nilai Total Entropy Awal (Node 0): <span style={{ color: '#d97706', fontWeight: '800' }}>{projectData.entropyTotal || "0.984"}</span>
              </div>
              <h4 style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8', margin: '4px 0' }}>Aturan Keputusan Hasil Ekstraksi Pohon (Ruleset):</h4>
              <div style={{ fontFamily: 'monospace', fontSize: '9.5px', color: '#334155', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px', lineHeight: '1.4' }}>
                <div><span style={{ color: '#059669', fontWeight: 'bold' }}>RULE 01: IF</span> instrumentalness &gt; 0.523 <span style={{ color: '#d97706', fontWeight: 'bold' }}>AND</span> danceability &gt; 0.612 <span style={{ color: '#2563eb', fontWeight: 'bold' }}>THEN</span> Class = <b>BOOMING</b></div>
                <div style={{ paddingLeft: '12px', borderLeft: '2px solid #e2e8f0', color: '#94a3b8', fontSize: '8.5px', margin: '2px 0' }}>↳ Gain Rasio: 0.412 | Confidence: 91.4%</div>
                <div style={{ marginTop: '4px' }}><span style={{ color: '#059669', fontWeight: 'bold' }}>RULE 02: IF</span> valence &lt; 0.341 <span style={{ color: '#d97706', fontWeight: 'bold' }}>AND</span> energy &lt; 0.450 <span style={{ color: '#2563eb', fontWeight: 'bold' }}>THEN</span> Class = <b>NOT_BOOMING</b></div>
                <div style={{ paddingLeft: '12px', borderLeft: '2px solid #e2e8f0', color: '#94a3b8', fontSize: '8.5px', margin: '2px 0' }}>↳ Gain Rasio: 0.287 | Confidence: 94.1%</div>
              </div>
            </div>
          </div>

          {/* TAHAP 5: EVALUATION */}
          <div style={{ marginBottom: '20px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontWeight: '800', fontSize: '11px', color: '#0f172a', textTransform: 'uppercase' }}>
              <span style={{ width: '4px', height: '12px', backgroundColor: '#1DB954', marginRight: '6px', display: 'inline-block', borderRadius: '1px' }}></span>
              05. Tahap Evaluation (Matriks Pengujian Performa)
            </div>
            
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
              <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    {/* Kolom Informasi Kiri */}
                    <td style={{ width: '60%', padding: '12px', verticalAlign: 'middle', backgroundColor: '#fdfdfd' }}>
                      <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' }}>METODE VALIDASI KONTINGENSI (CONFUSION MATRIX)</div>
                      <p style={{ fontSize: '9px', color: '#64748b', margin: '4px 0 0 0', lineHeight: '1.3' }}>
                        Pengujian silang dilakukan otomatis dengan memecah porsi data secara linear menjadi 80% Training Data dan 20% Testing Data.
                      </p>
                    </td>
                    {/* Kolom Indikator Kanan (Aman & Tidak Terpotong) */}
                    <td style={{ width: '40%', padding: '12px', verticalAlign: 'middle', textAlign: 'right', backgroundColor: '#fafafa', borderLeft: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'inline-block', textAlign: 'center', padding: '6px 10px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', marginRight: '6px', width: '75px' }}>
                        <span style={{ display: 'block', fontSize: '7.5px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>ACCURACY</span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#10b981' }}>{projectData.accuracyScore || "93.5%"}</span>
                      </div>
                      <div style={{ display: 'inline-block', textAlign: 'center', padding: '6px 10px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', width: '75px' }}>
                        <span style={{ display: 'block', fontSize: '7.5px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>PRECISION</span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#0d9488' }}>{projectData.precisionScore || "91.4%"}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TAHAP 6: DEPLOYMENT */}
          <div style={{ marginBottom: '24px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontWeight: '800', fontSize: '11px', color: '#0f172a', textTransform: 'uppercase' }}>
              <span style={{ width: '4px', height: '12px', backgroundColor: '#1DB954', marginRight: '6px', display: 'inline-block', borderRadius: '1px' }}></span>
              06. Tahap Deployment & Kesimpulan Aksi
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '10px' }}>
              <div style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>
                Status Validasi Sistem: <span style={{ color: '#1DB954', fontWeight: '800' }}>READY TO INTEGRATE (PRODUCTION LEVEL)</span>
              </div>
              <p style={{ margin: '0', color: '#475569', fontSize: '9.5px', lineHeight: '1.4', textAlign: 'justify' }}>
                Berdasarkan pohon keputusan yang terbentuk, produser direkomendasikan untuk memprioritaskan penyaringan audio track dengan tingkat ketukan konstan serta nilai instrumentalitas tinggi guna mengamankan retensi audiens di target pasar <b>{projectData.targetMarket || "Content Creator & Digital Marketer"}</b>. Aturan logika IF-THEN ini siap diekspor ke sistem backend aplikasi pihak ketiga via skrip JSON standardisasi.
              </p>
            </div>
          </div>

          {/* CLOSING FOOTER BAR */}
          <div style={{ paddingTop: '10px', borderTop: '1px dashed #cbd5e1', fontSize: '8.5px', fontWeight: 'bold', color: '#94a3b8', display: 'table', width: '100%' }}>
            <div style={{ display: 'table-cell', textTransform: 'uppercase' }}>METODOLOGI VERIFIKASI DIGITAL SIMULATOR KELOMPOK C4.5</div>
            <div style={{ display: 'table-cell', textAlign: 'right', color: '#1DB954' }}>● SINKRONISASI AKHIR BERHASIL</div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default CrispSimulator;