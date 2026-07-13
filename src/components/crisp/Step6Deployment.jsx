import React, { useState } from "react";
import { Rocket, ArrowLeft, HelpCircle, FileText, CheckCircle, Sparkles, ShieldAlert, Cpu, Terminal, ArrowUpRight, Loader2 } from "lucide-react";

function Step6Deployment({ setStep, triggerDownloadPDF, isPdfDownloaded, projectData }) {
  // Sinkronisasi Data Otomatis Dari Mesin C4.5
  const modelOutputs = projectData?.modelOutputs || {
    rootNode: "energy",
    splitPoint: "0.596",
    accuracy: "70.20"
  };

  const rootNodeName = modelOutputs.rootNode?.toLowerCase() || "energy";
  const systemThreshold = parseFloat(modelOutputs.splitPoint || "0.596");

  // State Kontrol
  const [inputs, setInputs] = useState({ danceability: 0.50, energy: 0.50 });
  const [prediction, setPrediction] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showApiDoc, setShowApiDoc] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Live Prediction Engine
  const calculateLivePrediction = () => {
    setIsSimulating(true);
    setPrediction(null);

    setTimeout(() => {
      const targetValue = rootNodeName === "danceability" ? inputs.danceability : inputs.energy;
      
      if (targetValue > systemThreshold) {
        setPrediction({
          status: "POPULER",
          msg: `Lagu Hits Terdeteksi! Karakteristik ${rootNodeName.toUpperCase()} (${targetValue.toFixed(3)}) sukses melewati ambang batas pohon keputusan (> ${systemThreshold}).`,
          color: "emerald"
        });
      } else {
        setPrediction({
          status: "FLOP / REDUP",
          msg: `Kurang Kompetitif. Nilai ${rootNodeName.toUpperCase()} (${targetValue.toFixed(3)}) berada di bawah batas optimal (≤ ${systemThreshold}).`,
          color: "rose"
        });
      }
      setIsSimulating(false);
    }, 600);
  };

  // 🔥 SOLUSI TOTAL ANTI-FREEZE: Eksekusi Asinkron & Non-Blocking
  const handleSafePdfDownload = () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    
    // Pemicu independen untuk membuka paksa kursor jika file induk macet mendadak
    const backupRelease = setTimeout(() => {
      setIsGeneratingPdf(false);
      document.body.style.pointerEvents = "auto";
    }, 2500);

    // Jalankan generator PDF di antrean macro-task terpisah agar UI tidak terkunci
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
    }, 100);
  };

  return (
    <div id="spotify-insight-report" className="space-y-8 font-sans text-slate-800 p-6 bg-white rounded-3xl min-h-screen">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 relative overflow-hidden group">
        <div className="flex items-center gap-4 z-10">
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl shadow-lg shadow-emerald-500/20">
            <Rocket size={26} />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-[0.2em] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase">Fase Final 06</span>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Model Deployment</h3>
          </div>
        </div>
        <div className="max-w-xs bg-white border border-slate-100 p-3.5 rounded-2xl flex gap-2.5 items-start shadow-sm">
          <HelpCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
            <strong>Fokus Akhir:</strong> Menguji aturan model C4.5 secara <em>real-time production</em> dan mencetak dokumen pertanggungjawaban ilmiah.
          </p>
        </div>
      </div>

      {/* 2. AREA UTAMA: SIMULATOR & EXPORT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KARTU SIMULATOR INTERAKTIF */}
        <div className="lg:col-span-7 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-500" /> Live Song Classifier Engine
              </h4>
              <span className="text-[9px] bg-slate-900 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-800">
                Active Key: {rootNodeName.toUpperCase()}
              </span>
            </div>

            {/* SLIDERS BOX */}
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-slate-50/60 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                <div className="flex justify-between font-bold text-xs text-slate-600 mb-2">
                  <span className="flex items-center gap-1.5">Danceability Score {rootNodeName === "danceability" && "🎯"}</span>
                  <span className="font-mono text-emerald-600 font-black text-sm">{inputs.danceability.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={inputs.danceability} 
                  onChange={(e) => setInputs({ ...inputs, danceability: parseFloat(e.target.value) })} 
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="p-4 bg-slate-50/60 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                <div className="flex justify-between font-bold text-xs text-slate-600 mb-2">
                  <span className="flex items-center gap-1.5">Energy Intensity {rootNodeName === "energy" && "🎯"}</span>
                  <span className="font-mono text-emerald-600 font-black text-sm">{inputs.energy.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={inputs.energy} 
                  onChange={(e) => setInputs({ ...inputs, energy: parseFloat(e.target.value) })} 
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <button 
              onClick={calculateLivePrediction}
              disabled={isSimulating}
              className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-black rounded-2xl text-xs tracking-wider uppercase transition-all duration-150 active:scale-[0.98] shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Cpu size={14} className={isSimulating ? "animate-spin" : ""} />
              {isSimulating ? "Mengeksekusi Aturan C4.5..." : "Uji Validasi Lagu"}
            </button>
          </div>

          {/* DISPLAY LIVE HASIL KLASIFIKASI */}
          <div className="mt-5 h-[90px] flex items-center justify-center">
            {prediction ? (
              <div className={`w-full p-4 rounded-2xl text-xs font-bold border text-center flex flex-col justify-center items-center shadow-inner ${
                prediction.color === "emerald" 
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200/80" 
                  : "bg-rose-50 text-rose-900 border-rose-200/80"
              }`}>
                <div className="flex items-center gap-1.5 text-sm font-black tracking-wide mb-1">
                  {prediction.color === "emerald" ? <CheckCircle size={16} className="text-emerald-600" /> : <ShieldAlert size={16} className="text-rose-600" />}
                  KLASIFIKASI: {prediction.status}
                </div>
                <p className="text-[11px] font-medium text-slate-500 px-2">{prediction.msg}</p>
              </div>
            ) : (
              <div className="text-slate-400 text-xs font-medium italic border border-dashed border-slate-200 w-full h-full rounded-2xl flex items-center justify-center bg-slate-50/40">
                {isSimulating ? "Sedang menghitung..." : "Silakan sesuaikan slider dan tekan tombol di atas untuk melihat respon model."}
              </div>
            )}
          </div>
        </div>

        {/* KARTU CETAK PDF (DISEMBUNYIKAN DARI ENGINE SNAPSHOT AGAR TIDAK LOOP/FREEZE) */}
        <div 
          data-html2canvas-ignore="true" 
          className="lg:col-span-5 p-6 bg-slate-950 text-white rounded-[2rem] shadow-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="inline-flex p-3 bg-slate-900 rounded-2xl border border-slate-800 text-emerald-400">
              <FileText size={22} />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-wide">Cetak Berkas Akhir Projek</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-1.5 leading-relaxed">
                Unduh seluruh rangkuman repositori data mining Anda (Tahap 1 Data Acquisition hingga Tahap 6 Evaluasi & Deployment) menjadi dokumen PDF resmi.
              </p>
            </div>

            <div className="space-y-2 pt-1 text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-400"></div> Termasuk Matriks C4.5 Dinamis</div>
              <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-400"></div> Grafik Validasi Akurasi {modelOutputs.accuracy}%</div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={handleSafePdfDownload} 
              disabled={isGeneratingPdf}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-[#1DB954] to-teal-500 text-slate-950 font-black text-xs tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transform hover:scale-[1.03] transition-all duration-200 hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>MENGUNDUH PDF...</span>
                </>
              ) : (
                <>
                  <FileText size={16} /> 
                  <span>{isPdfDownloaded ? "UNDUH ULANG LAPORAN PDF" : "DOWNLOAD DOKUMEN CRISP-DM"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. SIMULATOR API PROD */}
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-3xl p-5 shadow-inner transition-all hover:border-slate-700">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Terminal size={15} className="text-emerald-400" />
            <span className="text-[11px] font-black tracking-wider uppercase font-mono">Production Ready API (JSON Output)</span>
          </div>
          <button 
            onClick={() => setShowApiDoc(!showApiDoc)}
            className="text-[10px] font-bold text-slate-400 hover:text-white underline cursor-pointer flex items-center gap-1"
          >
            {showApiDoc ? "Sembunyikan" : "Lihat Response Meta"} <ArrowUpRight size={10} />
          </button>
        </div>
        
        {showApiDoc ? (
          <pre className="text-[10px] font-mono p-3 bg-slate-950/80 rounded-xl text-emerald-400 overflow-x-auto leading-relaxed">
{`{
  "status": "success",
  "algorithm": "C4.5 Decision Tree",
  "root_node": "${rootNodeName}",
  "split_threshold": ${systemThreshold},
  "accuracy_score": "${modelOutputs.accuracy}%",
  "live_input_payload": { "danceability": ${inputs.danceability}, "energy": ${inputs.energy} },
  "classification_result": "${prediction ? prediction.status : "WAITING_INPUT"}"
}`}
          </pre>
        ) : (
          <p className="text-[11px] text-slate-400 font-medium">
            Aturan keputusan C4.5 Anda telah berhasil dibungkus ke dalam format logika terstruktur dan siap ditanamkan ke server aplikasi mobile/web eksternal.
          </p>
        )}
      </div>

      {/* 4. FOOTER NAVIGASI (DIABAIKAN DARI PDF) */}
      <div data-html2canvas-ignore="true" className="pt-4 border-t border-slate-100 flex">
        <button 
          onClick={() => setStep(5)} 
          className="px-6 py-3 border-2 border-slate-100 text-slate-500 font-bold text-sm rounded-2xl hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer transform hover:scale-102 active:scale-98"
        >
          <ArrowLeft size={16} /> Kembali Ke Tahap Evaluasi
        </button>
      </div>

    </div>
  );
}

export default Step6Deployment;