import React, { useState, useRef } from "react";
import { 
  ArrowRight, ArrowLeft, Database, UploadCloud, FileText, 
  Trash2, ChevronDown, ChevronUp, AlertTriangle, Info, Sparkles,
  Loader2 
} from "lucide-react";
import * as XLSX from "xlsx"; 

function Step2DataUnderstanding({ advanceToNextStep, setStep, projectData, setProjectData }) {
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    if (projectData.uploadedFilesRaw && projectData.uploadedFilesRaw.length > 0) {
      return projectData.uploadedFilesRaw;
    }
    
    if (projectData.fileName) {
      const names = projectData.fileName.split(", ");
      return names.map((name, idx) => ({
        id: `hydrated-file-${idx}-${Math.random().toString(36).substring(2, 5)}`,
        name: name,
        size: "Terhitung KB",
        rows: idx === 0 ? (projectData.totalRows || 0) : 0, 
        headers: projectData.fileHeaders || [],
        missingCount: idx === 0 ? (projectData.missingDataCount || 0) : 0,
        missingMap: {},
        domain: projectData.detectedDomain?.includes("Music") ? "Music Atributes" : "General Tabular (Non-Musik)",
        type: name.split(".").pop().toUpperCase() || "CSV"
      }));
    }
    
    return [];
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false); 
  const [parsingProgress, setParsingProgress] = useState(0); 
  const [activeTab, setActiveTab] = useState("instances"); 
  const fileInputRef = useRef(null);

  const totalInstances = uploadedFiles.reduce((acc, file) => acc + (file.rows || 0), 0);
  
  const allUniqueHeaders = Array.from(
    new Set(uploadedFiles.flatMap(file => file.headers || []))
  );
  
  const totalMissing = uploadedFiles.reduce((acc, file) => acc + (file.missingCount || 0), 0);
  
  const isDominantMusic = uploadedFiles.some(file => file.domain?.includes("Music"));

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
  };

  const processFiles = (files) => {
    const validExtensions = ["csv", "xlsx", "xls"];
    
    Array.from(files).forEach((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      if (!validExtensions.includes(extension)) {
        alert(`Format file .${extension} tidak didukung! Harap masukkan file CSV atau Excel.`);
        return;
      }

      setIsParsing(true);
      setParsingProgress(0);

      if (extension === "csv") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
          if (lines.length === 0) {
            setIsParsing(false);
            return;
          }

          const delimiter = lines[0].includes(";") ? ";" : ",";
          const headers = lines[0].split(delimiter).map(h => h.replace(/['"]+/g, "").trim());
          
          const parsedRows = [];
          let missingCount = 0;
          const missingColumnsMap = {};
          headers.forEach(h => { missingColumnsMap[h] = 0; });

          let currentLine = 1;
          const totalLines = lines.length;
          const chunkSize = 15000; 

          const parseCSVChunk = () => {
            const endLimit = Math.min(currentLine + chunkSize, totalLines);
            
            for (let i = currentLine; i < endLimit; i++) {
              const cells = lines[i].split(delimiter);
              if (cells.length < headers.length) continue; 

              const rowObject = {};
              for (let cellIdx = 0; cellIdx < headers.length; cellIdx++) {
                const header = headers[cellIdx];
                const rawValue = cells[cellIdx] ? cells[cellIdx].trim() : "";
                rowObject[header] = rawValue;

                const checkVal = rawValue.toLowerCase();
                if (checkVal === "" || checkVal === "null" || checkVal === "na" || checkVal === "-" || checkVal === "undefined") {
                  missingCount++;
                  missingColumnsMap[header] = (missingColumnsMap[header] || 0) + 1;
                }
              }
              parsedRows.push(rowObject);
            }

            const currentPct = Math.floor((endLimit / totalLines) * 100);
            setParsingProgress(currentPct);

            if (endLimit < totalLines) {
              currentLine = endLimit;
              setTimeout(parseCSVChunk, 0);
            } else {
              const musicKeywords = ["danceability", "energy", "tempo", "loudness", "acousticness", "valence", "track", "artist", "song", "music", "liveness"];
              const isMusicDataset = headers.some(h => musicKeywords.includes(h.toLowerCase()));

              const newMeta = {
                id: Math.random().toString(36).substring(2, 9),
                name: file.name,
                size: (file.size / 1024).toFixed(1) + " KB",
                rows: parsedRows.length,
                headers: headers,
                missingCount: missingCount,
                missingMap: missingColumnsMap,
                domain: isMusicDataset ? "Music Atributes" : "General Tabular (Non-Musik)",
                type: "CSV",
                extractedRows: parsedRows 
              };
              setUploadedFiles(prev => [...prev, newMeta]);
              setIsParsing(false);
            }
          };
          parseCSVChunk();
        };
        reader.readAsText(file);
      } 
      else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
          if (jsonData.length === 0) {
            setIsParsing(false);
            return;
          }

          const headers = jsonData[0].map(h => String(h).trim());
          const parsedRows = [];
          let missingCount = 0;
          const missingColumnsMap = {};
          headers.forEach(h => { missingColumnsMap[h] = 0; });

          let currentLine = 1;
          const totalLines = jsonData.length;
          const chunkSize = 15000;

          const parseExcelChunk = () => {
            const endLimit = Math.min(currentLine + chunkSize, totalLines);
            
            for (let i = currentLine; i < endLimit; i++) {
              const row = jsonData[i];
              if (!row) continue;
              const rowObject = {};
              
              for (let cellIdx = 0; cellIdx < headers.length; cellIdx++) {
                const header = headers[cellIdx];
                const rawValue = row[cellIdx] !== undefined ? String(row[cellIdx]).trim() : "";
                rowObject[header] = rawValue;

                const checkVal = rawValue.toLowerCase();
                if (checkVal === "" || checkVal === "null" || checkVal === "na" || checkVal === "-" || checkVal === "undefined") {
                  missingCount++;
                  missingColumnsMap[header] = (missingColumnsMap[header] || 0) + 1;
                }
              }
              parsedRows.push(rowObject);
            }

            const currentPct = Math.floor((endLimit / totalLines) * 100);
            setParsingProgress(currentPct);

            if (endLimit < totalLines) {
              currentLine = endLimit;
              setTimeout(parseExcelChunk, 0);
            } else {
              const musicKeywords = ["danceability", "energy", "tempo", "loudness", "acousticness", "valence", "track", "artist", "song", "music", "liveness"];
              const isMusicDataset = headers.some(h => musicKeywords.includes(h.toLowerCase()));

              const newMeta = {
                id: Math.random().toString(36).substring(2, 9),
                name: file.name,
                size: (file.size / 1024).toFixed(1) + " KB",
                rows: parsedRows.length,
                headers: headers,
                missingCount: missingCount,
                missingMap: missingColumnsMap,
                domain: isMusicDataset ? "Music Atributes" : "General Tabular (Non-Musik)",
                type: extension.toUpperCase(),
                extractedRows: parsedRows 
              };
              setUploadedFiles(prev => [...prev, newMeta]);
              setIsParsing(false);
            }
          };

          parseExcelChunk();
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleProceedNext = () => {
    const combinedRawData = uploadedFiles.flatMap(f => f.extractedRows || []);

    setProjectData(prev => ({
      ...prev,
      fileName: uploadedFiles.map(f => f.name).join(", "),
      fileHeaders: allUniqueHeaders,
      totalRows: totalInstances,
      detectedDomain: isDominantMusic ? "Music/Spotify Atributes" : "General Tabular Data",
      missingDataCount: totalMissing,
      uploadedFilesRaw: uploadedFiles,
      rawData: combinedRawData 
    }));
    advanceToNextStep(3);
  };

  return (
    <div className="space-y-8 text-slate-800 antialiased selection:bg-teal-500/20">
      
      {/* CARD DESKRIPSI TAHAP PREMIUM HEAD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 rounded-[24px] shadow-xl shadow-teal-900/10 relative overflow-hidden group hover:shadow-2xl hover:shadow-teal-900/20 transition-all duration-500 hover:-translate-y-1 border border-slate-700/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-colors duration-700"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-2xl shadow-lg shadow-teal-950/40 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Database size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-teal-400 uppercase block mb-0.5">CRISP-DM Ingestion Area</span>
              <h3 className="text-xl font-black text-white tracking-tight">Tahap 2: Data Understanding Workspace</h3>
            </div>
          </div>
          <span className="p-2 px-4 bg-white/10 backdrop-blur-md border border-white/10 text-teal-400 text-xs font-black rounded-xl uppercase tracking-wider group-hover:bg-white/20 transition-colors duration-300 shadow-inner">
            Progress: Step 2 / 6
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-semibold px-1 -mt-4 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        Unggah berkas riil Anda (<span className="text-teal-600 font-bold">.CSV / .XLSX</span>). Mesin komputasi akan membedah skema struktur data biner secara akurat, mendeteksi jumlah baris, serta memetakan sebaran sel kosong otomatis.
      </p>

      {/* DRAG & DROP INGEST BOX ANIMATIF / LOADING STATE */}
      {isParsing ? (
        <div className="border-2 border-dashed border-teal-500 p-10 rounded-[32px] text-center bg-teal-50/20 flex flex-col items-center justify-center space-y-3 shadow-md animate-pulse transform scale-[1.02] transition-transform duration-300">
          <Loader2 size={36} className="text-teal-600 animate-spin" />
          <span className="text-sm font-black text-slate-800 uppercase tracking-wide">
            Sedang Membaca & Membedah Skema Struktur Data Raksasa...
          </span>
          <p className="text-xs font-bold text-teal-700 font-mono bg-white/60 px-4 py-1.5 rounded-full shadow-sm">
            Mengekstrak Objek Biner: {parsingProgress}% Selesai (Browser Tetap Aman/Bebas Freeze)
          </p>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`border-2 border-dashed p-10 rounded-[32px] text-center transition-all duration-500 cursor-pointer relative group overflow-hidden ${
            isDragging 
              ? "border-teal-500 bg-teal-50/50 scale-[1.03] shadow-2xl shadow-teal-500/10 ring-4 ring-teal-500/20 rotate-1" 
              : "border-slate-200 bg-slate-50/40 hover:bg-white hover:border-teal-400 hover:shadow-xl hover:shadow-teal-100 hover:-translate-y-1 hover:scale-[1.01]"
          }`}
        >
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform group-hover:animate-shimmer pointer-events-none"></div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => processFiles(e.target.files)}
            multiple
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md border mb-4 transition-all duration-500 ease-out ${
            isDragging 
              ? "bg-teal-500 text-white border-teal-600 scale-125 shadow-lg shadow-teal-500/30" 
              : "bg-white text-slate-400 group-hover:text-teal-500 group-hover:border-teal-200 group-hover:scale-110 group-hover:bg-teal-50 group-hover:shadow-teal-100"
          }`}>
            <UploadCloud size={28} className={isDragging || isDragging ? "animate-bounce" : "transition-transform duration-300 group-hover:-translate-y-1"} />
          </div>
          
          <span className="text-sm font-black text-slate-800 block uppercase tracking-wide group-hover:text-teal-950 transition-colors duration-300">
            {isDragging ? "Lepaskan File Di Sini!" : "Seret Berkas ke Sini atau Klik untuk Unggah Data"}
          </span>
          <p className="text-xs font-semibold text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed group-hover:text-slate-500 transition-colors">
            Mendukung penuh ekstraksi otomatis file biner riil berekstensi <span className="font-bold text-slate-600 group-hover:text-teal-700">.CSV</span>, <span className="font-bold text-slate-600 group-hover:text-teal-700">.XLSX</span>, atau <span className="font-bold text-slate-600 group-hover:text-teal-700">.XLS</span>.
          </p>
        </div>
      )}

      {/* FILE LIST GRID */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center px-1">
            <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileText size={14} className="text-teal-500" /> BERKAS YANG BERHASIL DI-INGEST ({uploadedFiles.length}/5):
            </h5>
            <button 
              onClick={(e) => { e.stopPropagation(); clearAllFiles(); }}
              disabled={isParsing}
              className="text-[10px] font-black text-rose-500 border border-rose-200 bg-rose-50/60 p-2 px-4 rounded-xl hover:bg-rose-500 hover:text-white hover:shadow-md hover:shadow-rose-200 transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105 disabled:opacity-40"
            >
              Bersihkan Semua
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedFiles.map((file) => (
              <div 
                key={file.id} 
                className="p-4.5 bg-white border border-slate-100 hover:border-teal-300 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-500 hover:-translate-y-1 flex items-center justify-between group/card relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-slate-200 group-hover/card:bg-teal-500 transition-colors duration-300"></div>
                
                <div className="flex items-center gap-3.5 overflow-hidden pl-2">
                  <span className="p-3 bg-slate-50 border border-slate-100 text-slate-800 font-mono text-[10px] font-black rounded-xl shrink-0 shadow-sm group-hover/card:bg-teal-50 group-hover/card:text-teal-700 group-hover/card:border-teal-200 transition-colors duration-300 group-hover/card:scale-105">
                    {file.type}
                  </span>
                  <div className="overflow-hidden space-y-0.5">
                    <h6 className="text-xs font-black text-slate-900 truncate pr-4 group-hover/card:text-teal-950 transition-colors" title={file.name}>
                      {file.name}
                    </h6>
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                      <span>{file.size}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-slate-700 font-black bg-slate-100 px-1.5 py-0.5 rounded-md group-hover/card:bg-teal-100 group-hover/card:text-teal-800 transition-colors">{file.rows.toLocaleString('id-ID')} Baris Asli</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md mt-1.5 inline-block shadow-sm transition-all duration-300 ${
                      file.domain.includes("Music") 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover/card:bg-emerald-100" 
                        : "bg-purple-50 text-purple-700 border border-purple-100 group-hover/card:bg-purple-100"
                    }`}>
                      ✨ {file.domain}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                  disabled={isParsing}
                  className="p-2.5 text-slate-300 hover:text-white rounded-xl hover:bg-rose-500 transition-all duration-300 shrink-0 cursor-pointer group-hover/card:opacity-100 hover:shadow-md disabled:opacity-30 hover:scale-110 active:scale-95"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* METADATA INTERACTIVE DROPDOWN ANALYSIS TABS */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 pt-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1">
            📊 Rincian Komputasi Eksplorasi (Pilih Tab untuk Analisis):
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div 
              onClick={() => setActiveTab("instances")}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group/tab hover:shadow-xl hover:-translate-y-1 ${
                activeTab === "instances" 
                  ? "border-emerald-500 bg-emerald-50/40 shadow-lg shadow-emerald-500/10 ring-4 ring-emerald-500/10 scale-[1.02]" 
                  : "border-slate-100 bg-white hover:border-emerald-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl font-black tracking-tight text-slate-900 block font-mono group-hover/tab:text-emerald-700 transition-colors">{totalInstances.toLocaleString('id-ID')}</span>
                <span className={`p-1.5 rounded-lg transition-all duration-300 ${activeTab === "instances" ? "bg-emerald-500 text-white shadow-md rotate-180" : "bg-slate-50 text-slate-400 group-hover/tab:bg-emerald-100 group-hover/tab:text-emerald-600"}`}>
                  <ChevronDown size={14} className={activeTab === "instances" ? "rotate-180" : ""} />
                </span>
              </div>
              <span className="text-[10px] font-black text-slate-400 group-hover/tab:text-emerald-600 uppercase tracking-wider mt-3 block transition-colors">
                TOTAL INSTANCES
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-1 transition-transform duration-500 ease-out ${activeTab === "instances" ? "bg-emerald-500 scale-x-100" : "bg-emerald-200 scale-x-0 group-hover/tab:scale-x-100"}`}></div>
            </div>

            {/* Card 2 */}
            <div 
              onClick={() => setActiveTab("attributes")}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group/tab hover:shadow-xl hover:-translate-y-1 ${
                activeTab === "attributes" 
                  ? "border-teal-500 bg-teal-50/40 shadow-lg shadow-teal-500/10 ring-4 ring-teal-500/10 scale-[1.02]" 
                  : "border-slate-100 bg-white hover:border-teal-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl font-black tracking-tight text-slate-900 block font-mono group-hover/tab:text-teal-700 transition-colors">{allUniqueHeaders.length}</span>
                <span className={`p-1.5 rounded-lg transition-all duration-300 ${activeTab === "attributes" ? "bg-teal-500 text-white shadow-md rotate-180" : "bg-slate-50 text-slate-400 group-hover/tab:bg-teal-100 group-hover/tab:text-teal-600"}`}>
                   <ChevronDown size={14} className={activeTab === "attributes" ? "rotate-180" : ""} />
                </span>
              </div>
              <span className="text-[10px] font-black text-slate-400 group-hover/tab:text-teal-600 uppercase tracking-wider mt-3 block transition-colors">
                ATRIBUT TERDETEKSI
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-1 transition-transform duration-500 ease-out ${activeTab === "attributes" ? "bg-teal-500 scale-x-100" : "bg-teal-200 scale-x-0 group-hover/tab:scale-x-100"}`}></div>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => setActiveTab("missing")}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group/tab hover:shadow-xl hover:-translate-y-1 ${
                activeTab === "missing" 
                  ? "border-amber-500 bg-amber-50/40 shadow-lg shadow-amber-500/10 ring-4 ring-amber-500/10 scale-[1.02]" 
                  : "border-slate-100 bg-white hover:border-amber-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-3xl font-black tracking-tight block font-mono transition-colors ${totalMissing > 0 ? "text-amber-600 group-hover/tab:text-amber-700" : "text-slate-900 group-hover/tab:text-amber-600"}`}>
                  {totalMissing.toLocaleString('id-ID')}
                </span>
                <span className={`p-1.5 rounded-lg transition-all duration-300 ${activeTab === "missing" ? "bg-amber-500 text-white shadow-md rotate-180" : "bg-slate-50 text-slate-400 group-hover/tab:bg-amber-100 group-hover/tab:text-amber-600"}`}>
                  <ChevronDown size={14} className={activeTab === "missing" ? "rotate-180" : ""} />
                </span>
              </div>
              <span className="text-[10px] font-black text-slate-400 group-hover/tab:text-amber-600 uppercase tracking-wider mt-3 block transition-colors">
                MISSING (NULL) CELLS
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-1 transition-transform duration-500 ease-out ${activeTab === "missing" ? "bg-amber-500 scale-x-100" : "bg-amber-200 scale-x-0 group-hover/tab:scale-x-100"}`}></div>
            </div>
          </div>

          {/* DYNAMIC ANALYSIS PANEL - TERMINAL BOX */}
          <div className="bg-slate-950 text-slate-100 rounded-[24px] font-mono text-xs leading-relaxed overflow-hidden shadow-2xl border border-slate-900 transition-all duration-500 hover:shadow-emerald-900/10 group/terminal">
            <div className="bg-slate-900 p-3.5 px-5 border-b border-slate-800/60 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm hover:scale-125 transition-transform cursor-pointer"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm hover:scale-125 transition-transform cursor-pointer"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm hover:scale-125 transition-transform cursor-pointer"></div>
                <span className="text-[10px] text-slate-400 font-bold ml-2 group-hover/terminal:text-slate-300 transition-colors">crisp_dm_analytics_core.log</span>
              </div>
              <span className="text-[9px] bg-slate-800/80 text-emerald-400 px-2 py-0.5 rounded-md font-sans font-black uppercase tracking-wider animate-pulse border border-emerald-900/50">
                Live Output
              </span>
            </div>

            <div className="p-6 space-y-4">
              {activeTab === "instances" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 text-teal-400 font-bold">
                    <Sparkles size={14} className="animate-spin-slow" />
                    <span>// DISTRIBUSI VOLUME DATA DAN SKEMA UJI:</span>
                  </div>
                  <p className="text-slate-300">
                    <span className="text-slate-600">&gt;</span> Engine mendeteksi total volume sebanyak <span className="text-emerald-400 font-black bg-emerald-900/30 px-1 rounded">{totalInstances.toLocaleString('id-ID')} baris data asli</span> dari seluruh berkas unggahan.
                  </p>
                  {isDominantMusic ? (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-900/60 text-emerald-400/90 rounded-xl space-y-1.5 shadow-inner hover:bg-emerald-950/60 transition-colors">
                      <p className="font-bold flex items-center gap-2"><Database size={12}/> &gt; [Domain Matriks Spotify Teridentifikasi]</p>
                      <p className="text-[11px] text-emerald-200/70 font-sans leading-relaxed">
                        Standar pembagian otomatis CRISP-DM: 80% Training ({Math.floor(totalInstances * 0.8).toLocaleString('id-ID')} baris) & 20% Testing ({Math.floor(totalInstances * 0.2).toLocaleString('id-ID')} baris) siap diindeks pohon keputusan.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-purple-950/40 border border-purple-900/60 text-purple-400/90 rounded-xl space-y-1.5 shadow-inner hover:bg-purple-950/60 transition-colors">
                      <p className="font-bold flex items-center gap-2"><Database size={12}/> &gt; [Domain Tabel Sektor Umum Teridentifikasi]</p>
                      <p className="text-[11px] text-purple-200/70 font-sans leading-relaxed">
                        Algoritma C4.5 akan menyesuaikan target penentuan entropi pohon klasifikasi berdasarkan {totalInstances.toLocaleString('id-ID')} baris rekaman kustomisasi yang diunggah.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "attributes" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 text-teal-400 font-bold">
                    <Sparkles size={14} className="animate-spin-slow" />
                    <span>// SKEMA STRUKTUR KOLOM ATRIBUT TERBACA:</span>
                  </div>
                  <p className="text-slate-300"><span className="text-slate-600">&gt;</span> Daftar nama fitur/kolom eksplorasi terestrak riil:</p>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {allUniqueHeaders.map((header, index) => (
                      <span key={index} className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-teal-500 rounded-lg text-[11px] font-bold shadow-sm transition-all duration-300 cursor-default hover:scale-105 hover:-translate-y-0.5">
                        📊 {header}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 flex items-center gap-2 font-sans bg-slate-900/30 p-2 rounded-lg mt-2">
                    <Info size={14} className="text-teal-500 shrink-0" />
                    <span>Matriks kolom di atas akan dijadikan prediktor untuk menghitung perolehan <i>Information Gain</i>.</span>
                  </div>
                </div>
              )}

              {activeTab === "missing" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <AlertTriangle size={14} className="animate-bounce" />
                    <span>// LAPORAN INTEGRITAS DATA & KUALITAS DATA REKAMAN (NULL CHECK):</span>
                  </div>
                  <p className="text-slate-300">
                    <span className="text-slate-600">&gt;</span> Total sel rekaman kosong/cacat terhitung: <span className="text-white font-black bg-rose-900/50 px-1.5 rounded">{totalMissing.toLocaleString('id-ID')} cells</span>.
                  </p>
                  
                  {totalMissing > 0 ? (
                    <div className="space-y-2 text-[11px]">
                      <p className="text-amber-400/90">&gt; Celah anomali ditemukan pada koordinat kolom berikut:</p>
                      <ul className="bg-slate-900/80 p-4 border border-slate-800 rounded-xl space-y-2 text-slate-300 max-h-40 overflow-y-auto shadow-inner custom-scrollbar">
                        {uploadedFiles.map(f => 
                          Object.entries(f.missingMap)
                            .filter(([_, count]) => count > 0)
                            .map(([colName, count]) => (
                              <li key={`${f.id}-${colName}`} className="flex items-center gap-2 hover:bg-slate-800 p-1.5 rounded transition-colors">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                <span>File <strong className="text-white">"{f.name}"</strong> → Kolom <strong className="text-amber-400">[{colName}]</strong>: Mengandung <span className="text-rose-400 font-bold">{count.toLocaleString('id-ID')} null</span> value.</span>
                              </li>
                            ))
                        )}
                      </ul>
                      <p className="text-slate-500 text-[10px] italic font-sans flex items-start gap-1 pt-1">
                        <Info size={12} className="shrink-0 mt-0.5 text-slate-400"/>
                        * Catatan Keamanan Data: Nilai kosong ini direkomendasikan untuk dieliminasi (Drop) atau diimputasi pada Tahap 3 (Data Preparation) agar tidak merusak perhitungan pohon keputusan.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-900/60 text-emerald-400/90 rounded-xl font-sans text-xs flex items-start gap-2 shadow-inner">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-emerald-300 mb-0.5 text-sm">Kualitas Data Sempurna (0% Data Noise)!</strong> 
                        Tidak ditemukan celah kosong atau data cacat pada seluruh sheet berkas. Data dinilai sangat murni dan siap di-eksekusi ke tahap modeling tanpa filter pembersihan berat.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER NAVIGATION CONTROL */}
      <div className="pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-3">
        <button
          onClick={() => setStep(1)}
          disabled={isParsing}
          className="w-full sm:w-auto p-3.5 px-6 bg-white text-slate-600 text-xs font-black rounded-xl hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:-translate-y-0.5 disabled:opacity-40 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Tahap 1
        </button>
        <button
          onClick={handleProceedNext}
          disabled={uploadedFiles.length === 0 || isParsing}
          className={`w-full sm:w-auto p-3.5 px-8 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer group/next ${
            uploadedFiles.length > 0 && !isParsing
              ? "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white hover:from-black hover:shadow-slate-900/30 hover:shadow-xl hover:-translate-y-1 active:scale-95 border border-slate-800" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
          }`}
        >
          Lanjutkan ke Data Prep 
          <ArrowRight size={14} className="transition-transform group-hover/next:translate-x-1 text-teal-400" />
        </button>
      </div>

    </div>
  );
}

export default Step2DataUnderstanding;