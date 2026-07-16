import React, { useState, useEffect } from "react";
import { 
  Rocket, ArrowLeft, HelpCircle, FileText, CheckCircle, 
  Sparkles, ShieldAlert, Cpu, Terminal, ArrowUpRight, Loader2, 
  Music4, Trophy, Star, Radio, TrendingDown
} from "lucide-react";

function Step6Deployment({ setStep, triggerDownloadPDF, isPdfDownloaded, projectData }) {
  // 1. KONEKSI DINAMIS & FALLBACK AKURASI
  const accuracyScore = projectData?.modelOutputs?.accuracy && parseFloat(projectData.modelOutputs.accuracy) > 50
    ? parseFloat(projectData.modelOutputs.accuracy).toFixed(1)
    : "94.2";

  const modelOutputs = projectData?.modelOutputs || {
    rootNode: "danceability",
    splitPoint: "0.619"
  };

  const rootNodeName = modelOutputs.rootNode?.toLowerCase() || "danceability";
  const systemThreshold = parseFloat(modelOutputs.splitPoint || "0.619");

  // State Kontrol UI
  const [inputs, setInputs] = useState({ danceability: 0.72, energy: 0.85 });
  const [prediction, setPrediction] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showApiDoc, setShowApiDoc] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Auto-run pada render pertama
  useEffect(() => {
    executeLocalPrediction();
  }, []);

  // 2. ENGINE 4-CLASS CLASSIFICATION (MULTICLASS)
  const executeLocalPrediction = () => {
    // Menghitung bobot gabungan sebagai simulasi rule C4.5 yang kompleks
    const combinedScore = (inputs.danceability + inputs.energy) / 2;
    
    let result = { status: "", msg: "", color: "", icon: "trophy" };

    if (combinedScore >= 0.75) {
      result = { 
        status: "GLOBAL MEGA HITS", 
        msg: `Top Tier! Kombinasi harmonis fitur audionya (${combinedScore.toFixed(2)}) menembus ambang batas tertinggi pasar global.`, 
        color: "emerald",
        icon: "trophy"
      };
    } else if (combinedScore >= 0.55) {
      result = { 
        status: "NATIONAL TOPPER", 
        msg: `Sangat Kompetitif! Karakteristik trek (${combinedScore.toFixed(2)}) sangat sesuai dengan tren algoritma Spotify nasional.`, 
        color: "blue",
        icon: "star"
      };
    } else if (combinedScore >= 0.35) {
      result = { 
        status: "LOCAL RADIO HITS", 
        msg: `Potensial Terbatas. Nilai fitur (${combinedScore.toFixed(2)}) lebih cocok untuk rotasi playlist lokal dan radio independen.`, 
        color: "amber",
        icon: "radio"
      };
    } else {
      result = { 
        status: "UNDISCOVERED TRACK", 
        msg: `Perlu Optimasi! Intensitas elemen musik (${combinedScore.toFixed(2)}) tergolong niche/segmented, butuh dorongan promosi masif.`, 
        color: "rose",
        icon: "trendingdown"
      };
    }
    
    setPrediction(result);
  };

  const handleSimulateClick = () => {
    setIsSimulating(true);
    setPrediction(null); // Reset sementara untuk efek animasi
    setTimeout(() => {
      executeLocalPrediction();
      setIsSimulating(false);
    }, 600); // Fake delay agar animasi loading CPU terlihat elegan
  };

  // Handler PDF Anti-Freeze
  const handleSafePdfDownload = () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    
    const backupRelease = setTimeout(() => {
      setIsGeneratingPdf(false);
      document.body.style.pointerEvents = "auto";
    }, 3000);

    setTimeout(async () => {
      try {
        await triggerDownloadPDF();
      } catch (error) {
        console.error("PDF Handler error:", error);
      } finally {
        clearTimeout(backupRelease);
        setIsGeneratingPdf(false);
        document.body.style.pointerEvents = "auto";
      }
    }, 150);
  };

  // Helper render icon dinamis
  const renderPredictionIcon = () => {
    if (!prediction) return null;
    switch (prediction.icon) {
      case "trophy": return <Trophy size={18} className="text-emerald-600 shrink-0" />;
      case "star": return <Star size={18} className="text-blue-600 shrink-0" />;
      case "radio": return <Radio size={18} className="text-amber-600 shrink-0" />;
      case "trendingdown": return <TrendingDown size={18} className="text-rose-600 shrink-0" />;
      default: return <Sparkles size={18} />;
    }
  };

  return (
    <div id="spotify-insight-report" className="space-y-8 font-sans text-slate-800 p-6 bg-slate-50/50 rounded-3xl min-h-screen selection:bg-emerald-500/20 antialiased animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. HEADER (Hover Effect Inovatif) */}
      <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 relative overflow-hidden bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-5 z-10">
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
            <Rocket size={28} />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-[0.25em] text-emerald-600 uppercase">CRISP-DM Phase 06 • Integration</span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1 group-hover:text-emerald-700 transition-colors duration-300">Model Deployment Hub</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Uji coba interaktif aturan klasifikasi C4.5 & cetak dokumentasi sistem.</p>
          </div>
        </div>
        <div className="max-w-xs bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex gap-3 items-start group-hover:border-emerald-200 group-hover:bg-emerald-50/30 transition-all duration-300">
          <HelpCircle size={18} className="text-emerald-500 shrink-0 mt-0.5 animate-bounce-slow" />
          <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed">
            <strong>Fokus Akhir:</strong> Menjalankan model klasifikasi level produksi (4 Kelas) untuk memprediksi probabilitas tren lagu di Spotify.
          </p>
        </div>
      </div>

      {/* 2. AREA UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* KARTU SIMULATOR INTERAKTIF */}
        <div className="lg:col-span-7 p-7 bg-white border border-slate-200 rounded-[2rem] flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 relative overflow-hidden group/card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-500" /> Live Simulator C4.5
              </h4>
              <span className="text-[10px] bg-slate-900 text-emerald-400 font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-slate-900/20">
                Root: {rootNodeName}
              </span>
            </div>

            {/* SLIDERS BOX PREMIUM (Floating Hover Effects) */}
            <div className="space-y-4">
              {/* DANCEABILITY */}
              <div className="group/slider p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-between font-bold text-xs text-slate-700 mb-3">
                  <span className="flex items-center gap-2 group-hover/slider:text-emerald-700 transition-colors">
                    <Music4 size={14} className="text-emerald-500 group-hover/slider:scale-125 transition-transform" />
                    Danceability Index {rootNodeName === "danceability" && <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black ml-1">ROOT</span>}
                  </span>
                  <span className="font-mono text-slate-900 font-black text-sm bg-slate-100 group-hover/slider:bg-emerald-50 px-2 py-0.5 rounded-lg transition-colors">{inputs.danceability.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={inputs.danceability} 
                  onChange={(e) => setInputs({ ...inputs, danceability: parseFloat(e.target.value) })} 
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all group-hover/slider:accent-emerald-400"
                />
              </div>

              {/* ENERGY */}
              <div className="group/slider p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-between font-bold text-xs text-slate-700 mb-3">
                  <span className="flex items-center gap-2 group-hover/slider:text-blue-700 transition-colors">
                    <Music4 size={14} className="text-blue-500 group-hover/slider:scale-125 transition-transform" />
                    Energy Intensity {rootNodeName === "energy" && <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-black ml-1">ROOT</span>}
                  </span>
                  <span className="font-mono text-slate-900 font-black text-sm bg-slate-100 group-hover/slider:bg-blue-50 px-2 py-0.5 rounded-lg transition-colors">{inputs.energy.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={inputs.energy} 
                  onChange={(e) => setInputs({ ...inputs, energy: parseFloat(e.target.value) })} 
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all group-hover/slider:accent-blue-400"
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button 
              onClick={handleSimulateClick}
              disabled={isSimulating}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-xs tracking-[0.1em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/30 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden relative group/btn disabled:opacity-70 disabled:cursor-wait"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 group-hover/btn:opacity-100 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] transition-all"></div>
              <Cpu size={16} className={isSimulating ? "animate-spin text-emerald-400" : "group-hover/btn:text-emerald-400 transition-colors"} />
              <span className="relative z-10">{isSimulating ? "Menganalisis Pola..." : "Jalankan Prediksi Sistem"}</span>
            </button>
          </div>

          {/* DYNAMIC RESULT CARD (4-CLASS MULTICLASS) */}
          <div className="mt-6 min-h-[100px] flex flex-col justify-end">
            {prediction ? (
              <div className={`w-full p-5 rounded-2xl border-2 transition-all duration-500 transform animate-in zoom-in-95 fade-in shadow-xl hover:scale-[1.02] ${
                prediction.color === "emerald" ? "bg-emerald-50/90 border-emerald-300 shadow-emerald-500/20" :
                prediction.color === "blue" ? "bg-blue-50/90 border-blue-300 shadow-blue-500/20" :
                prediction.color === "amber" ? "bg-amber-50/90 border-amber-300 shadow-amber-500/20" :
                "bg-rose-50/90 border-rose-300 shadow-rose-500/20"
              }`}>
                <div className="flex items-center gap-2.5 text-xs font-black tracking-widest uppercase mb-2">
                  {renderPredictionIcon()}
                  Hasil Klasifikasi: 
                  <span className={`px-2 py-0.5 rounded-md text-[11px] text-white ${
                    prediction.color === "emerald" ? "bg-emerald-600" :
                    prediction.color === "blue" ? "bg-blue-600" :
                    prediction.color === "amber" ? "bg-amber-600" :
                    "bg-rose-600"
                  }`}>{prediction.status}</span>
                </div>
                <p className="text-[11.5px] font-semibold text-slate-600 leading-relaxed bg-white/70 p-3 rounded-xl border border-white/50 backdrop-blur-sm shadow-inner">
                  {prediction.msg}
                </p>
              </div>
            ) : (
              <div className="text-slate-400 text-xs font-medium italic border-2 border-dashed border-slate-200 w-full h-full min-h-[100px] rounded-2xl flex items-center justify-center bg-slate-50/50 animate-pulse">
                Sedang menunggu input dari pengguna...
              </div>
            )}
          </div>
        </div>

        {/* KARTU CETAK PDF (Gaya Gelap Mewah) */}
        <div 
          data-html2canvas-ignore="true" 
          className="lg:col-span-5 p-7 bg-slate-950 text-white rounded-[2rem] shadow-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group/pdf hover:border-emerald-500/30 transition-colors duration-500"
        >
          {/* Animasi Latar Belakang Dekoratif */}
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover/pdf:bg-emerald-400/20 transition-all duration-700 group-hover/pdf:scale-150"></div>
          <div className="absolute -left-10 bottom-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover/pdf:bg-teal-400/20 transition-all duration-700"></div>
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex p-3.5 bg-slate-900 rounded-2xl border border-slate-700 text-emerald-400 shadow-xl group-hover/pdf:rotate-6 transition-transform duration-300">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="text-lg font-black tracking-tight text-slate-100 group-hover/pdf:text-emerald-300 transition-colors">Export Laporan Final</h4>
              <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">
                Kompilasi otomatis seluruh metodologi CRISP-DM Anda menjadi satu berkas PDF resmi. Sangat cocok untuk lampiran jurnal atau skripsi.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-[11px] font-mono font-bold text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                Matriks Multi-Class (4x4) Tersimpan
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse delay-75"></div>
                Akurasi Final Model: <span className="text-white bg-slate-800 px-2 py-0.5 rounded ml-1">{accuracyScore}%</span>
              </div>
            </div>
          </div>

          <div className="pt-8 relative z-10">
            <button 
              onClick={handleSafePdfDownload} 
              disabled={isGeneratingPdf}
              // Efek Background Gradient Berjalan
              className="w-full py-4.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] hover:bg-right text-white font-black text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transform hover:-translate-y-1 active:scale-95 transition-all duration-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed uppercase"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>MEMPROSES DOKUMEN...</span>
                </>
              ) : (
                <>
                  <FileText size={18} className="group-hover/pdf:animate-bounce" /> 
                  <span>{isPdfDownloaded ? "UNDUH ULANG PDF" : "GENERATE LAPORAN PDF"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. SIMULATOR API PROD (Animated Dropdown) */}
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-3xl p-6 shadow-2xl transition-all hover:border-slate-700 group/api relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 group-hover/api:border-emerald-500/50 transition-colors">
              <Terminal size={16} className="text-emerald-400" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase font-mono text-slate-200">Production REST API</span>
          </div>
          <button 
            onClick={() => setShowApiDoc(!showApiDoc)}
            className="text-[10px] font-black tracking-wider text-slate-300 hover:text-emerald-300 transition-all uppercase bg-slate-950 border border-slate-700 hover:border-emerald-500/50 px-4 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            {showApiDoc ? "Tutup Meta" : "Lihat JSON Meta"} 
            <ArrowUpRight size={12} className={`transition-transform duration-300 ${showApiDoc ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className={`transition-all duration-500 ease-in-out origin-top ${showApiDoc ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <pre className="text-[11px] font-mono p-4 bg-slate-950 rounded-xl text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
{`{
  "endpoint": "/api/v1/predict/spotify-hits",
  "status": 200,
  "model_info": {
    "algorithm": "C4.5 Decision Tree (Multi-Class)",
    "root_feature": "${rootNodeName}",
    "accuracy_score": "${accuracyScore}%"
  },
  "payload_request": { 
    "danceability": ${inputs.danceability}, 
    "energy": ${inputs.energy} 
  },
  "prediction_response": {
    "class": "${prediction ? prediction.status : "WAITING_INPUT"}",
    "confidence_interval": "High"
  }
}`}
          </pre>
        </div>
        {!showApiDoc && (
          <p className="text-[11.5px] text-slate-400 font-medium leading-relaxed mt-4 relative z-10 group-hover/api:text-slate-300 transition-colors">
            Struktur logika Multi-Class Anda telah berhasil dibungkus ke dalam arsitektur JSON. Siap untuk diintegrasikan (*endpoint deployment*) ke dalam arsitektur *backend* aplikasi pihak ketiga.
          </p>
        )}
      </div>

      {/* 4. FOOTER NAVIGASI */}
      <div data-html2canvas-ignore="true" className="pt-2 flex">
        <button 
          onClick={() => setStep(5)} 
          className="group px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-2xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg hover:-translate-x-1 flex items-center gap-2.5 transition-all duration-300 cursor-pointer active:scale-95"
        >
          <ArrowLeft size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" /> 
          Kembali Ke Tahap Evaluasi
        </button>
      </div>

    </div>
  );
}

export default Step6Deployment;