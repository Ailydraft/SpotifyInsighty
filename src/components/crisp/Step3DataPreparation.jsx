import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  ArrowRight, ArrowLeft, Play, RefreshCw, CheckCircle2, 
  Terminal, Loader2, BarChart3, Code2, AlertTriangle, 
  Settings, Sliders, Layers, Sparkles
} from "lucide-react";

function Step3DataPreparation({ advanceToNextStep, setStep, projectData, setProjectData }) {
  
  const rawDataset = useMemo(() => {
    if (projectData && Array.isArray(projectData.rawData) && projectData.rawData.length > 0) {
      return projectData.rawData;
    }
    return [];
  }, [projectData?.rawData]);

  const isUsingRealData = rawDataset.length > 0;
  const sourceFileName = projectData?.fileName || "Dataset_Kosong.csv";
  const allHeaders = rawDataset.length > 0 ? Object.keys(rawDataset[0]).filter(k => k !== "id") : [];

  const [targetAttribute, setTargetAttribute] = useState(() => {
    return projectData?.targetAttribute || allHeaders[allHeaders.length - 1] || "";
  });
  
  const [predictorFeatures, setPredictorFeatures] = useState(() => {
    return projectData?.selectedFeatures || allHeaders.filter(h => h !== (projectData?.targetAttribute || allHeaders[allHeaders.length - 1]));
  });
  
  const [cleaningStrategy, setCleaningStrategy] = useState("impute"); 

  useEffect(() => {
    if (!projectData?.selectedFeatures && allHeaders.length > 0) {
      setPredictorFeatures(allHeaders.filter(h => h !== targetAttribute));
    }
  }, [targetAttribute, allHeaders, projectData?.selectedFeatures]);

  const featureTypes = useMemo(() => {
    const types = {};
    allHeaders.forEach(header => {
      let numericCount = 0;
      let validCount = 0;
      rawDataset.slice(0, 500).forEach(row => {
        const val = row[header];
        if (val !== undefined && val !== null && String(val).trim() !== "") {
          validCount++;
          if (!isNaN(parseFloat(val)) && isFinite(val)) {
            numericCount++;
          }
        }
      });
      types[header] = (numericCount / (validCount || 1)) > 0.70 ? "Kontinu" : "Kategorial";
    });
    return types;
  }, [rawDataset, allHeaders]);

  const [currentSubStep, setCurrentSubStep] = useState(() => projectData?.pipelineMetrics ? 4 : 0);
  const [isCleaning, setIsCleaning] = useState(false);
  const [progress, setProgress] = useState(() => projectData?.pipelineMetrics ? 100 : 0);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [calculatedMetrics, setCalculatedMetrics] = useState(projectData?.pipelineMetrics || null);
  const [sampleTransformedRows, setSampleTransformedRows] = useState([]);

  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./c45Worker.js", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (e) => {
      const { type, message, progress, logType, payload } = e.data;

      if (type === "PROGRESS") {
        setProgress(progress);
        setConsoleLogs((prev) => {
          let modifiedText = message;
          if (logType === "SUCCESS") modifiedText = `[SUCCESS] ${message}`;
          return [...prev, modifiedText];
        });
      }

      if (type === "SUCCESS") {
        const { finalMetrics, sampleRows, binnedDataset } = payload;
        
        setCurrentSubStep(4);
        setProgress(100);
        setIsCleaning(false);
        setCalculatedMetrics(finalMetrics);
        setSampleTransformedRows(sampleRows); 

        setProjectData(prev => ({
          ...prev,
          cleanedRows: finalMetrics.totalClean,
          droppedRows: finalMetrics.dropped,
          targetAttribute: targetAttribute,
          selectedFeatures: predictorFeatures,
          processedBinnedData: binnedDataset, 
          pipelineMetrics: finalMetrics
        }));
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [targetAttribute, predictorFeatures, cleaningStrategy, rawDataset]);

  const executeDataCleaningPipeline = () => {
    if (!isUsingRealData) return;
    if (!workerRef.current) return;

    setIsCleaning(true);
    setCurrentSubStep(1);
    setProgress(5);
    setConsoleLogs([
      `> [UI Thread] Melakukan offloading komputasi ke Web Worker...`,
      `> Mengirim ${rawDataset.length} baris records data ke Background Thread...`
    ]);

    workerRef.current.postMessage({
      rawDataset,
      targetAttribute,
      predictorFeatures,
      cleaningStrategy,
      featureTypes,
      sourceFileName
    });
  };

  const handleResetPipeline = () => {
    setCurrentSubStep(0);
    setProgress(0);
    setConsoleLogs([]);
    setCalculatedMetrics(null);
    setSampleTransformedRows([]);
    setProjectData(prev => ({
      ...prev,
      cleanedRows: 0,
      droppedRows: 0,
      processedBinnedData: [],
      pipelineMetrics: null
    }));
  };

  const toggleFeatureSelection = (feat) => {
    if (isCleaning || currentSubStep === 4) return;
    if (predictorFeatures.includes(feat)) {
      if (predictorFeatures.length > 1) {
        setPredictorFeatures(predictorFeatures.filter(f => f !== feat));
      }
    } else {
      setPredictorFeatures([...predictorFeatures, feat]);
    }
  };

  const pipelineSteps = [
    { id: 1, title: "Eksekusi Strategi & Rapat Data Masukan" },
    { id: 2, title: "Deteksi Tipe & Kalkulasi Median Split" },
    { id: 3, title: "Kalkulasi Shannon Base Entropy Target" },
    { id: 4, title: "Validasi Pipeline Atribut C4.5" }
  ];

  return (
    <div className="space-y-6 text-slate-800 antialiased selection:bg-emerald-500/20">
      
      {/* STATUS INDICATOR */}
      <div className={`p-4 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
        isUsingRealData ? "bg-emerald-50/80 border-emerald-200 text-emerald-900" : "bg-amber-50/80 border-amber-200 text-amber-900"
      }`}>
        <div className="flex items-center gap-3">
          {isUsingRealData ? (
            <div className="p-2 bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-sm shadow-emerald-500/20">RIIL</div>
          ) : (
            <div className="p-2 bg-amber-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm shadow-amber-500/20">
              <AlertTriangle size={12} className="animate-pulse" /> KOSONG
            </div>
          )}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wide">
              {isUsingRealData ? "Sumber Data Terverifikasi (Skala Besar)" : "Dataset Mentah Kosong"}
            </h4>
            <p className="text-[11px] font-medium opacity-80 mt-0.5">
              {isUsingRealData 
                ? `Berhasil mendeteksi "${sourceFileName}" terisi ${rawDataset.length.toLocaleString('id-ID')} baris data riil.` 
                : "Silakan kembali ke Step 2 untuk mengunggah dataset CSV Anda terlebih dahulu."
              }
            </p>
          </div>
        </div>
        <div className="font-mono text-[10px] font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 self-start sm:self-center shadow-xs">
          File: {sourceFileName}
        </div>
      </div>

      {/* CONFIGURATION WORKSPACE */}
      {currentSubStep === 0 && (
        <div className="p-6 bg-white border border-slate-200 rounded-[24px] shadow-sm hover:shadow-lg transition-all duration-500 space-y-5 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings size={18} className="text-slate-700 animate-spin-slow" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Konfigurasi Atribut & Mesin Pembersih C4.5</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-2.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block flex items-center gap-1.5 transition-colors hover:text-indigo-600">
                <Layers size={14} className="text-indigo-500" /> Target Kelas (Y)
              </label>
              <select
                value={targetAttribute}
                onChange={(e) => setTargetAttribute(e.target.value)}
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all cursor-pointer hover:border-slate-300 shadow-xs"
              >
                {allHeaders.map((header) => (
                  <option key={header} value={header}>{header} ({featureTypes[header]})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 space-y-2.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block flex items-center gap-1.5 transition-colors hover:text-amber-600">
                <Sparkles size={14} className="text-amber-500" /> Strategi Missing Value
              </label>
              <select
                value={cleaningStrategy}
                onChange={(e) => setCleaningStrategy(e.target.value)}
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all cursor-pointer hover:border-slate-300 shadow-xs"
              >
                <option value="impute">Imputasi Cerdas (Median / Modus)</option>
                <option value="drop">Eksklusi Agresif (Hapus Baris Kosong)</option>
              </select>
            </div>

            <div className="md:col-span-12 space-y-2.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block flex items-center gap-1.5">
                <Sliders size={14} className="text-emerald-500" /> Fitur Prediktor Atribut Terpilih (X) — <span className="text-amber-600 font-bold animate-pulse">Harap Pilih Fitur Sebelum Start</span>
              </label>
              <div className="flex flex-wrap gap-2.5 p-3 bg-slate-50/80 border-2 border-slate-100 rounded-xl min-h-[52px] shadow-inner">
                {allHeaders.filter(h => h !== targetAttribute).map((feat) => {
                  const isSelected = predictorFeatures.includes(feat);
                  return (
                    <button
                      key={feat}
                      onClick={() => toggleFeatureSelection(feat)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 border hover:scale-105 active:scale-95 hover:shadow-md ${
                        isSelected 
                          ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/20" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800"
                      }`}
                    >
                      <span>{feat}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded transition-colors ${isSelected ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-400"}`}>
                        {featureTypes[feat]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PANEL KIRI: PROGRESS STEPS */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pipeline Progress</span>
          <div className="space-y-3">
            {pipelineSteps.map((step) => {
              const isDone = currentSubStep > step.id || (currentSubStep === 4 && !isCleaning);
              const isActive = isCleaning && currentSubStep === step.id;
              
              return (
                <div 
                  key={step.id} 
                  className={`p-4 border-2 rounded-2xl flex items-center justify-between transition-all duration-500 ${
                    isDone 
                      ? "border-emerald-200 bg-emerald-50/50 text-emerald-900 shadow-sm" 
                      : isActive 
                        ? "border-slate-900 bg-slate-50 font-black shadow-lg scale-[1.02] -translate-y-1" 
                        : "border-slate-100 bg-white opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-colors duration-500 ${
                      isDone ? "bg-emerald-500 text-white shadow-emerald-500/30 shadow-sm" : isActive ? "bg-slate-900 text-emerald-400 shadow-md shadow-slate-900/20" : "bg-slate-100 text-slate-400"
                    }`}>
                      {step.id}
                    </span>
                    {step.title}
                  </span>
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 stroke-[3] animate-in zoom-in" />
                  ) : isActive ? (
                    <Loader2 size={16} className="text-emerald-600 animate-spin shrink-0" />
                  ) : null}
                </div>
              );
            })}
          </div>

          {currentSubStep < 4 || isCleaning ? (
            <button
              onClick={executeDataCleaningPipeline}
              disabled={isCleaning || !isUsingRealData}
              className="w-full p-4.5 bg-slate-950 hover:bg-black text-white text-xs font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 uppercase tracking-wider shadow-lg hover:shadow-slate-900/30 hover:-translate-y-1 active:scale-95 group"
            >
              {isCleaning ? (
                <><Loader2 size={16} className="animate-spin text-emerald-400" /> Memproses di Background Thread...</>
              ) : (
                <><Play size={14} fill="currentColor" className="text-emerald-400 group-hover:scale-125 transition-transform" /> Bersihkan & Proses Data (Web Worker)</>
              )}
            </button>
          ) : (
            <button
              onClick={handleResetPipeline}
              className="w-full p-4 bg-white border-2 border-slate-200 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 group"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> Set Ulang Parameter Pembersihan
            </button>
          )}
        </div>

        {/* PANEL KANAN: LIVE WORKER LOGS */}
        <div className="lg:col-span-7">
          <div className="bg-[#0b0f17] text-slate-300 rounded-[28px] overflow-hidden shadow-2xl border border-slate-800/80 flex flex-col min-h-[320px] transition-all duration-500 hover:shadow-emerald-900/20 hover:border-slate-700 group/term">
            <div className="px-5 py-4 bg-[#111823] border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code2 size={15} className="text-emerald-400 group-hover/term:scale-110 transition-transform" />
                <span className="text-slate-400 font-mono text-[10px] font-bold tracking-wider">c45Worker.js (Thread Isolated)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${isCleaning ? "bg-amber-400 animate-pulse shadow-amber-400/50" : "bg-emerald-500 shadow-emerald-500/50"}`}></span>
              </div>
            </div>

            <div className="p-6 font-mono text-[11px] leading-relaxed flex-1 space-y-2.5 bg-[#090d14] overflow-y-auto max-h-[220px] custom-scrollbar">
              {consoleLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 font-sans py-14 text-center animate-in fade-in zoom-in-95 duration-500">
                  <Terminal size={24} className="mb-3 opacity-40 text-slate-400" />
                  <p className="font-semibold text-xs tracking-wide">Worker Standby. Pilih atribut, lalu klik jalankan pipeline.</p>
                </div>
              ) : (
                consoleLogs.map((log, index) => {
                  let textClass = "text-slate-400";
                  if (log.includes("[SUCCESS]")) textClass = "text-emerald-400 font-bold";
                  return <div key={index} className={`whitespace-pre-wrap animate-in slide-in-from-left-2 fade-in duration-300 ${textClass}`}>{log}</div>;
                })
              )}
            </div>

            <div className="p-5 bg-[#0e141f] border-t border-slate-800/80 flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase font-mono">
                <span>Worker Activity Engine</span>
                <span className="text-emerald-400">{progress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden shadow-inner border border-slate-800">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* METRICS & PREVIEW */}
      {currentSubStep === 4 && calculatedMetrics && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out pt-2">
          
          {/* METRIC CARD */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="p-5 bg-emerald-50/60 border border-emerald-100 rounded-2xl hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Siap Proses</span>
              <span className="text-lg font-mono font-black text-emerald-600 block mt-1">{calculatedMetrics.totalClean.toLocaleString('id-ID')} <span className="text-xs font-sans text-emerald-600/70">Baris</span></span>
            </div>
            <div className="p-5 bg-amber-50/60 border border-amber-100 rounded-2xl hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Diimputasi (Filled)</span>
              <span className="text-lg font-mono font-black text-amber-600 block mt-1">{calculatedMetrics.imputed.toLocaleString('id-ID')} <span className="text-xs font-sans text-amber-600/70">Baris</span></span>
            </div>
            <div className="p-5 bg-rose-50/50 border border-rose-100 rounded-2xl hover:shadow-lg hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Dibuang (Dropped)</span>
              <span className="text-lg font-mono font-black text-rose-600 block mt-1">{calculatedMetrics.dropped.toLocaleString('id-ID')} <span className="text-xs font-sans text-rose-600/70">Baris</span></span>
            </div>
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Entropy Target H(S)</span>
              <span className="text-lg font-mono font-black text-slate-900 block mt-1">{calculatedMetrics.baseEntropy}</span>
            </div>
          </div>

          {/* CLEAN TABLE VIEW */}
          <div className="border border-slate-200 rounded-[24px] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-500">
            <div className="p-5 bg-slate-50/90 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={16} className="text-emerald-600" /> Inspeksi Hasil Pembersihan & Splitting C4.5
              </span>
              <span className="text-[10px] text-slate-600 font-bold bg-white px-3 py-1 rounded-lg font-mono shadow-sm border border-slate-200">
                Pratinjau Ringan 5 Baris Teratas
              </span>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar pb-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/40 text-slate-500 uppercase border-b border-slate-200 text-[10px] font-bold tracking-wider">
                    <th className="p-4 pl-6 w-16 text-center text-slate-400">No</th>
                    {predictorFeatures.length === 0 ? (
                      <th className="p-4 text-slate-400 italic font-normal">Tidak ada prediktor terpilih</th>
                    ) : (
                      predictorFeatures.slice(0, 3).map((feat) => (
                        <th key={feat} className="p-4 border-r border-slate-100 last:border-r-0 hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col gap-1">
                            <span className="text-slate-800 font-mono font-bold text-[11px]">{feat}</span>
                            <span className="text-[9px] text-slate-400 lowercase font-medium tracking-normal">Asli → Kategori C4.5</span>
                          </div>
                        </th>
                      ))
                    )}
                    <th className="p-4 pr-6 text-right text-slate-700 font-bold bg-slate-50/60 w-64 font-mono shadow-inner border-l border-slate-200">
                      [Class] Target: {targetAttribute}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs group/table">
                  {sampleTransformedRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-emerald-50/40 transition-colors duration-200">
                      <td className="p-4 pl-6 text-center text-slate-400 font-sans font-medium bg-slate-50/20">{rIdx + 1}</td>
                      
                      {predictorFeatures.slice(0, 3).map((feat) => {
                        const isKontinu = calculatedMetrics.featureTypes[feat] === "Kontinu";
                        const rawValue = row[feat] !== null && row[feat] !== undefined && String(row[feat]).trim() !== "" ? row[feat] : "-";
                        const binnedValue = row[`${feat}_binned`] || "-";
                        
                        return (
                          <td key={feat} className="p-4 border-r border-slate-100 last:border-r-0">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-600 font-semibold">{rawValue}</span>
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black border whitespace-nowrap shadow-sm transition-all hover:scale-105 ${
                                isKontinu
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}>
                                {binnedValue}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                      
                      <td className="p-4 pr-6 text-right bg-slate-50/30 border-l border-slate-100">
                        <span className="inline-block px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-sans font-black tracking-widest shadow-md uppercase hover:bg-black hover:-translate-y-0.5 transition-all">
                          {row[targetAttribute] || "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="pt-5 border-t border-slate-200/80 flex justify-between items-center">
        <button
          onClick={() => setStep(2)}
          className="p-3.5 px-6 bg-white text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:scale-95 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Tahap 2
        </button>
        <button
          onClick={() => advanceToNextStep(4)}
          disabled={currentSubStep < 4 || isCleaning}
          className={`p-4 px-8 text-xs font-black rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer group ${
            currentSubStep === 4 && !isCleaning
              ? "bg-slate-950 text-white hover:bg-black hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-1 active:scale-95" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
          }`}
        >
          Masuk Tahap Modeling <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-emerald-400" />
        </button>
      </div>

    </div>
  );
}

export default Step3DataPreparation;