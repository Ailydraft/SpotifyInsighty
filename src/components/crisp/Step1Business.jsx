import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  Sparkles, Wand2, RefreshCw, CheckCircle2, AlertTriangle, 
  ChevronDown, Target, Edit3, Lock, Unlock, MessageSquare, 
  ShieldAlert, Check, X, HelpCircle as QuestionIcon, Info, Sliders, Users
} from "lucide-react";

function Step1Business({ advanceToNextStep, projectData, setProjectData }) {
  const DEFAULT_SIMULATOR_TITLE = "Analisis Prediksi Popularitas Lagu Spotify Menggunakan Algoritma C4.5";

  const [initMode, setInitMode] = useState(() => {
    if (projectData.vibe === "Kustomisasi Teks Manual User" || projectData.manualProblem) {
      return "MANUAL";
    }
    return "SCAN";
  });
  
  const [selectedVibe, setSelectedVibe] = useState(() => {
    return projectData.vibe && projectData.vibe !== "Kustomisasi Teks Manual User" ? projectData.vibe : "";
  });

  const [selectedMarket, setSelectedMarket] = useState(() => {
    return projectData.targetMarket && projectData.targetMarket !== "Spesifikasi Analisis Naratif" ? projectData.targetMarket : "";
  });

  const [manualProblem, setManualProblem] = useState(() => {
    return projectData.manualProblem || "";
  });
  
  const [generatedTitle, setGeneratedTitle] = useState(projectData.title || "");
  const [showReviewer, setShowReviewer] = useState(() => {
    return !!projectData.title && projectData.title !== DEFAULT_SIMULATOR_TITLE;
  });

  const [isTitleLocked, setIsTitleLocked] = useState(false);

  // --- STATE BARU UNTUK VALIDASI POP-UP REMINDER ---
  const [validationAlert, setValidationAlert] = useState({ show: false, message: "" });

  const [aiAnalysis, setAiAnalysis] = useState(() => {
    if (projectData.title && projectData.title !== DEFAULT_SIMULATOR_TITLE) {
      const isManualMode = projectData.vibe === "Kustomisasi Teks Manual User" || !!projectData.manualProblem;
      if (!isManualMode) {
        return {
          kelebihan: "Sangat spesifik, fokus pada segmentasi pasar yang jelas, dan variabel parameter fitur audio terukur secara matematis.",
          kekurangan: "Ruang lingkup pengujian pohon keputusan menjadi agak sempit jika dataset Spotify umum tidak difilter terlebih dahulu.",
          saran: "Sistem menyarankan penambahan batasan tahun rilis (misal: Dataset Era Berjalan 2020-2026) agar akurasi pemisahan atribut C4.5 meningkat.",
          suggestedTitleRefined: `Klasifikasi Fitur Audio Spotify Menggunakan C4.5 Untuk Memprediksi Popularitas Lagu Pada ${projectData.targetMarket || 'Pasar'} (Studi Kasus Era 2020-2026)`,
          isInvalid: false
        };
      } else {
        const textSnippet = projectData.manualProblem || "";
        return {
          kelebihan: "Mampu mengangkat problematika riil dan komersial langsung dari perspektif pengamat industri musik.",
          kekurangan: "Naratif teks bebas memiliki risiko bias atribut tinggi jika tidak dikonversi ke variabel data terstruktur.",
          saran: "Sistem menyarankan agar draf masalah ini diimplementasikan menggunakan algoritma Decision Tree C4.5 berbasis pengujian fitur audio target.",
          suggestedTitleRefined: `Analisis Atribut Audio Spotify Menggunakan C4.5 Berdasarkan Studi Kasus Kendala: "${textSnippet.substring(0, 30)}..."`,
          isInvalid: false
        };
      }
    }
    return { kelebihan: "", kekurangan: "", saran: "", suggestedTitleRefined: "", isInvalid: false };
  });

  const [isOpenVibe, setIsOpenVibe] = useState(false);
  const [isOpenMarket, setIsOpenMarket] = useState(false);
  const vibeRef = useRef(null);
  const marketRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (vibeRef.current && !vibeRef.current.contains(event.target)) setIsOpenVibe(false);
      if (marketRef.current && !marketRef.current.contains(event.target)) setIsOpenMarket(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("CUSTOM");

  const vibeOptions = [
    { id: "v1", label: "High-Energy & Fast Tempo (Dance/Club)" },
    { id: "v2", label: "Melancholic & Low Valence (Sad/Galau)" },
    { id: "v3", label: "Acoustic & Minimalist (Chill/Belajar)" },
    { id: "v4", label: "Hyperpop & High Loudness (Trendy/Gen-Z)" },
    { id: "v5", label: "Organic & High Acousticness (Indie/Folk)" }
  ];

  const marketOptions = [
    { id: "m1", label: "Komunitas Pendengar Musik Indie" },
    { id: "m2", label: "Generasi Z Pengguna Aktif Spotify" },
    { id: "m3", label: "Olahragawan & Fitness Enthusiast" },
    { id: "m4", label: "Content Creator & Digital Marketer" },
    { id: "m5", label: "Mahasiswa Fokus Belajar / Produktivitas" }
  ];

  const parseOptionLabel = (label) => {
    const match = label.match(/(.*?)\s*\((.*?)\)/);
    if (match) {
      return { main: match[1], badge: match[2] };
    }
    return { main: label, badge: null };
  };

  const handleExecuteAnalysis = () => {
    if (isTitleLocked) return;

    // --- MODIFIKASI: MENGGANTI ALERT BAWAAN BROWSER DENGAN CUSTOM MODAL STATE ---
    if (initMode === "SCAN" && (!selectedVibe || !selectedMarket)) {
      setValidationAlert({
        show: true,
        message: "Harap pilih Kriteria Vibe dan Segmentasi Pasar terlebih dahulu sebelum melakukan generate!"
      });
      return;
    }
    if (initMode === "MANUAL" && !manualProblem.trim()) {
      setValidationAlert({
        show: true,
        message: "Harap ketik rumusan masalah industri musik terlebih dahulu sebelum memproses analisis!"
      });
      return;
    }

    if (initMode === "SCAN") {
      const vibeLabel = vibeOptions.find(o => o.label === selectedVibe)?.label.split(" (")[0];
      const rawTitle = `Klasifikasi Fitur Audio Spotify Untuk Memprediksi Boomingnya Lagu Pada ${selectedMarket} Berdasarkan Karakteristik ${vibeLabel}`;
      
      setGeneratedTitle(rawTitle);
      setAiAnalysis({
        kelebihan: "Sangat spesifik, fokus pada segmentasi pasar yang jelas, dan variabel parameter fitur audio terukur secara matematis.",
        kekurangan: "Ruang lingkup pengujian pohon keputusan menjadi agak sempit jika dataset Spotify umum tidak difilter terlebih dahulu.",
        saran: "Sistem menyarankan penambahan batasan tahun rilis (misal: Dataset Era Berjalan 2020-2026) agar akurasi pemisahan atribut C4.5 meningkat.",
        suggestedTitleRefined: `Klasifikasi Fitur Audio Spotify Menggunakan C4.5 Untuk Memprediksi Popularitas Lagu Pada ${selectedMarket} (Studi Kasus Era 2020-2026)`,
        isInvalid: false
      });
    } 
    else {
      const userText = manualProblem.trim();
      const isGibberishOrShort = 
        userText.length < 15 || 
        /bla\s*bla|asd|qwer|zxcv|dfgh|jkl|wkwk|haha|huhu|asdf/i.test(userText) ||
        /([a-zA-Z])\1{4,}/.test(userText) || 
        (userText.length > 12 && !userText.includes(" "));

      if (isGibberishOrShort) {
        setGeneratedTitle("❓ KATA INPUT TIDAK SESUAI CONTEXT / TERDETEKSI TYPO MASSAL");
        setAiAnalysis({
          kelebihan: "Data masukan tidak memenuhi syarat kualifikasi minimum riset data mining.",
          kekurangan: `Teks yang dimasukkan ("${userText}") terdeteksi sebagai ketikan simulasi acak, mengandung typo parah, atau tidak bermakna secara kebahasaan industri musik.`,
          saran: "Mohon perbaiki tulisan Anda. Masukkan kalimat rumusan masalah yang logis (Contoh: sebutkan platform Spotify, preferensi lagu, fitur audio, atau perilaku pendengar).",
          suggestedTitleRefined: "",
          isInvalid: true 
        });
        setShowReviewer(true);
        return;
      }

      const clippedText = userText.length > 60 ? `${userText.substring(0, 60)}...` : userText;
      setGeneratedTitle(`Klasifikasi Data Mining Kasus Spotify Untuk Menjawab Masalah: "${clippedText}"`);
      setAiAnalysis({
        kelebihan: "Mampu mengangkat problematika riil dan komersial langsung dari perspektif pengamat industri musik.",
        kekurangan: "Naratif teks bebas memiliki risiko bias atribut tinggi jika tidak dikonversi ke variabel data terstruktur.",
        saran: "Sistem menyarankan agar draf masalah ini diimplementasikan menggunakan algoritma Decision Tree C4.5 berbasis pengujian fitur audio target.",
        suggestedTitleRefined: `Analisis Atribut Audio Spotify Menggunakan C4.5 Berdasarkan Studi Kasus Kendala: "${userText.substring(0, 30)}..."`,
        isInvalid: false
      });
    }

    setShowReviewer(true);
  };

  const triggerSystemSuggestionModal = () => {
    setModalType("SYSTEM");
    setShowModal(true);
  };

  const triggerCustomLockModal = () => {
    setModalType("CUSTOM");
    setShowModal(true);
  };

  const handleFinalConfirm = () => {
    setShowModal(false);
    const finalTitle = modalType === "SYSTEM" ? aiAnalysis.suggestedTitleRefined : generatedTitle;

    setProjectData((prev) => ({
      ...prev,
      title: finalTitle,
      vibe: initMode === "SCAN" ? selectedVibe : "Kustomisasi Teks Manual User",
      targetMarket: initMode === "SCAN" ? selectedMarket : "Spesifikasi Analisis Naratif",
      manualProblem: initMode === "MANUAL" ? manualProblem : ""
    }));
    
    advanceToNextStep(2);
  };

  const handleReset = () => {
    if (isTitleLocked) return;
    setShowReviewer(false);
    setGeneratedTitle("");
    setSelectedVibe("");
    setSelectedMarket("");
    setManualProblem("");
    setAiAnalysis({ kelebihan: "", kekurangan: "", saran: "", suggestedTitleRefined: "", isInvalid: false });
  };

  return (
    <div className="space-y-8 text-slate-800 antialiased selection:bg-emerald-500/20">
      
      {/* HEADER TAHAPAN */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 rounded-[28px] shadow-2xl relative overflow-hidden group border border-slate-800/60 transition-all duration-500 hover:shadow-emerald-900/40 hover:-translate-y-1">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/30 group-hover:scale-110 transition-all duration-700 pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 rounded-2xl shadow-xl shadow-emerald-500/20 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <Target size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase block mb-1 drop-shadow-sm">CRISP-DM Wizard Workspace</span>
              <h3 className="text-2xl font-black text-white tracking-tight">Tahap 1: Business Target & Initialization</h3>
            </div>
          </div>
          <span className="p-2.5 px-4 bg-white/5 backdrop-blur-xl border border-white/10 text-emerald-400 text-xs font-black rounded-xl uppercase tracking-wider shadow-inner group-hover:bg-white/10 transition-colors">
            Progress: Step 1 / 6
          </span>
        </div>
      </div>

      {/* SEGMENT SWITCHER */}
      <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-3xl shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition-all duration-300 hover:shadow-md">
        <div className="space-y-0.5 pl-3 pt-1">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            Metode Inisialisasi Analisis
          </h4>
          <p className="text-xs text-slate-500 font-medium max-w-xl leading-relaxed">
            Pilih <span className="font-bold text-emerald-600">⚡ Smart Scan</span> untuk kecocokan otomatis variabel atau <span className="font-bold text-slate-700">✍️ Manual Text</span> untuk analisis berbasis kasus terarah.
          </p>
        </div>
        <div className="flex items-center bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/30 shrink-0 w-full lg:w-auto relative overflow-hidden group">
          <button
            onClick={() => { if(!isTitleLocked) { setInitMode("SCAN"); handleReset(); } }}
            disabled={isTitleLocked}
            className={`flex-1 lg:flex-none py-2.5 px-6 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer select-none ${
              isTitleLocked ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
            } ${
              initMode === "SCAN" ? "bg-white text-slate-950 shadow-md font-black border border-slate-200" : "text-slate-500 hover:text-slate-800 hover:bg-slate-300/30"
            }`}
          >
            ⚡ Smart Scan
          </button>
          <button
            onClick={() => { if(!isTitleLocked) { setInitMode("MANUAL"); handleReset(); } }}
            disabled={isTitleLocked}
            className={`flex-1 lg:flex-none py-2.5 px-6 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer select-none ${
              isTitleLocked ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
            } ${
              initMode === "MANUAL" ? "bg-white text-slate-950 shadow-md font-black border border-slate-200" : "text-slate-500 hover:text-slate-800 hover:bg-slate-300/30"
            }`}
          >
            ✍️ Manual Text
          </button>
        </div>
      </div>

      {/* CORE WORKSPACE INPUT AREA */}
      <div className="transition-all duration-300">
        {initMode === "SCAN" ? (
          <div className={`p-6 bg-white border border-slate-200 rounded-[32px] shadow-sm hover:shadow-lg hover:border-emerald-200 grid grid-cols-1 md:grid-cols-2 gap-6 relative transition-all duration-500 ${isTitleLocked ? "opacity-50 pointer-events-none" : ""}`}>
            
            {/* DROPDOWN 1 */}
            <div className="space-y-2.5 relative" ref={vibeRef}>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1.5 transition-colors group-hover:text-emerald-500">
                <Sliders size={12} className="text-emerald-500" /> Kriteria Vibe / Karakteristik Audio
              </label>
              
              <div className="relative group/dropdown">
                <button
                  type="button"
                  onClick={() => setIsOpenVibe(!isOpenVibe)}
                  className={`w-full p-4 px-5 bg-slate-50 border-2 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-between transition-all duration-300 shadow-xs cursor-pointer text-left ${
                    isOpenVibe ? "border-emerald-500 bg-white ring-4 ring-emerald-50 scale-[1.01]" : "border-slate-200 group-hover/dropdown:border-emerald-300 group-hover/dropdown:shadow-md"
                  }`}
                >
                  {selectedVibe ? (
                    <div className="flex items-center justify-between w-full pr-2">
                      <span className="font-extrabold text-slate-900">{parseOptionLabel(selectedVibe).main}</span>
                      {parseOptionLabel(selectedVibe).badge && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md uppercase tracking-wide">
                          {parseOptionLabel(selectedVibe).badge}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 font-medium">-- Pilih Konsep Vibe Audio --</span>
                  )}
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 shrink-0 ${isOpenVibe ? "rotate-180 text-emerald-500 scale-125" : "group-hover/dropdown:text-emerald-400"}`} />
                </button>

                {isOpenVibe && (
                  <div className="absolute z-50 w-full mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-44 overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 slide-in-from-top-3 duration-200 origin-top select-none text-left">
                    <div className="p-1.5 space-y-1">
                      {vibeOptions.map((opt) => {
                        const parsed = parseOptionLabel(opt.label);
                        const isSelected = selectedVibe === opt.label;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              setSelectedVibe(opt.label);
                              setIsOpenVibe(false);
                            }}
                            className={`p-3 px-4 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
                              isSelected 
                                ? "bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-500/20 scale-[0.98]" 
                                : "hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-bold hover:scale-[1.02] hover:shadow-sm"
                            }`}
                          >
                            <span className="text-xs">{parsed.main}</span>
                            {parsed.badge && (
                              <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase transition-colors ${
                                isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100"
                              }`}>
                                {parsed.badge}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DROPDOWN 2 */}
            <div className="space-y-2.5 relative" ref={marketRef}>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                <Users size={12} className="text-emerald-500" /> Segmentasi Pasar / Target Populasi
              </label>
              
              <div className="relative group/dropdown">
                <button
                  type="button"
                  onClick={() => setIsOpenMarket(!isOpenMarket)}
                  className={`w-full p-4 px-5 bg-slate-50 border-2 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-between transition-all duration-300 shadow-xs cursor-pointer text-left ${
                    isOpenMarket ? "border-emerald-500 bg-white ring-4 ring-emerald-50 scale-[1.01]" : "border-slate-200 group-hover/dropdown:border-emerald-300 group-hover/dropdown:shadow-md"
                  }`}
                >
                  {selectedMarket ? (
                    <span className="font-extrabold text-slate-900">{selectedMarket}</span>
                  ) : (
                    <span className="text-slate-400 font-medium">-- Pilih Segmentasi Populasi --</span>
                  )}
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 shrink-0 ${isOpenMarket ? "rotate-180 text-emerald-500 scale-125" : "group-hover/dropdown:text-emerald-400"}`} />
                </button>

                {isOpenMarket && (
                  <div className="absolute z-50 w-full mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-44 overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 slide-in-from-top-3 duration-200 origin-top select-none text-left">
                    <div className="p-1.5 space-y-1">
                      {marketOptions.map((opt) => {
                        const isSelected = selectedMarket === opt.label;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              setSelectedMarket(opt.label);
                              setIsOpenMarket(false);
                            }}
                            className={`p-3 px-4 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 text-xs ${
                              isSelected 
                                ? "bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-500/20 scale-[0.98]" 
                                : "hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-bold hover:scale-[1.02] hover:shadow-sm"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check size={14} className="stroke-[3] animate-in zoom-in" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* MANUAL PROBLEMATICS TEXT AREA INPUT WORKSPACE */
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare size={13} className="text-emerald-500" /> Ketik Rumusan Masalah Industri Musik
              </span>
              {manualProblem.length > 0 && (
                <span className="text-[10px] text-emerald-600 bg-emerald-50 font-bold px-2 py-0.5 rounded-md font-mono border border-emerald-100 transition-all">{manualProblem.length} karakter</span>
              )}
            </label>
            <div className="relative group">
              <textarea
                value={manualProblem}
                onChange={(e) => !isTitleLocked && setManualProblem(e.target.value)}
                disabled={isTitleLocked}
                rows={4}
                className={`w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-[24px] text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-inner transition-all duration-300 resize-none leading-relaxed focus:ring-4 focus:ring-emerald-50 group-hover:border-emerald-300 group-hover:shadow-md ${
                  isTitleLocked ? "opacity-50 bg-slate-100 cursor-not-allowed" : "focus:-translate-y-1 focus:shadow-xl"
                }`}
                placeholder="Contoh: Banyak lagu indie lokal dengan tempo cepat gagal menembus urutan tangga putar Top 50 karena tidak sesuai dengan preferensi fitur audio pasar Gen-Z..."
              />
            </div>
            
            <div className="p-4 bg-amber-50/80 hover:bg-amber-100/60 border border-amber-200/70 text-amber-950 rounded-2xl flex items-start gap-3 shadow-xs transition-colors duration-300 cursor-default hover:shadow-sm">
              <div className="p-1 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5 shadow-sm">
                <Info size={14} className="stroke-[2.5]" />
              </div>
              <div className="text-[11px] leading-relaxed font-semibold text-slate-600">
                <strong className="font-extrabold text-amber-900">💡 Aturan Algoritma C4.5:</strong> Variabel target harus berupa data <span className="font-black underline text-amber-950">Kategorial/Diskrit</span> (misal: *High/Low Popularity*). Hindari memasukkan nilai kontinu/angka desimal murni langsung ke narasi agar pohon keputusan terbentuk sempurna.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BUTTON TRIGGER RUN ANALYSIS */}
      {!showReviewer && (
        <button
          onClick={handleExecuteAnalysis}
          className="w-full p-4.5 bg-slate-950 hover:bg-black text-white text-xs font-black rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 tracking-widest uppercase hover:scale-[1.01] hover:-translate-y-1 active:scale-95 cursor-pointer group hover:shadow-emerald-500/20"
        >
          <Wand2 size={16} className="text-emerald-400 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300" /> Jalankan Analisis & Generate Judul
        </button>
      )}

      {/* OUTPUT PANEL: AI REVIEWER */}
      {showReviewer && (
        <div className="pt-6 space-y-6 border-t border-slate-200/80 animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out">
          
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 px-5 rounded-2xl shadow-lg border text-white transition-all duration-500 hover:shadow-xl ${
            aiAnalysis.isInvalid 
              ? "bg-gradient-to-r from-amber-600 to-orange-700 border-amber-500 shadow-amber-600/20 hover:shadow-amber-500/30 hover:-translate-y-0.5" 
              : "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-800 shadow-slate-950/20 hover:shadow-emerald-900/20 hover:-translate-y-0.5"
          }`}>
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full shadow-xs ${aiAnalysis.isInvalid ? "bg-white animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
              <span className="text-xs font-mono font-black tracking-[0.15em] uppercase">
                {aiAnalysis.isInvalid ? "⚠️ VERIFIKASI INPUT GAGAL" : "AI REVIEWER ENGINE RESULT"}
              </span>
            </div>
            <button 
              onClick={() => { if(!isTitleLocked) handleReset(); }}
              disabled={isTitleLocked}
              className={`text-[10px] bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black p-2.5 px-4 rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md ${
                isTitleLocked ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95 group"
              }`}
            >
              <RefreshCw size={11} className="group-hover:rotate-180 transition-transform duration-500" /> Coba Ulang Teks
            </button>
          </div>

          <div className={`p-6 border-2 shadow-inner rounded-[28px] relative space-y-3.5 transition-all duration-500 group/titlebox hover:shadow-md ${
            aiAnalysis.isInvalid 
              ? "bg-amber-50/40 border-amber-300 hover:border-amber-400" 
              : isTitleLocked 
                ? "bg-slate-50/80 border-slate-300/80 ring-4 ring-slate-100" 
                : "bg-gradient-to-br from-slate-50 to-white border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 hover:border-emerald-300"
          }`}>
            <div className="flex justify-between items-center select-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block transition-colors group-hover/titlebox:text-slate-600">Draf Judul Utama Riset:</span>
              <div className="flex items-center gap-2">
                {!aiAnalysis.isInvalid && (
                  <button 
                    onClick={() => setIsTitleLocked(!isTitleLocked)}
                    className={`text-[10px] p-1.5 px-3 rounded-xl font-black flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                      isTitleLocked 
                        ? "bg-slate-950 text-white shadow-md border border-slate-800 hover:bg-slate-900 hover:scale-105 active:scale-95" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 hover:shadow-sm hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isTitleLocked ? (
                      <>
                        <Lock size={11} className="text-emerald-400 stroke-[2.5]" /> Terkunci
                      </>
                    ) : (
                      <>
                        <Unlock size={11} /> Kunci Matriks
                      </>
                    )}
                  </button>
                )}
                <span className={`text-[9px] font-black p-1.5 px-2.5 rounded-xl flex items-center gap-1.5 border transition-all duration-300 shadow-sm ${
                  aiAnalysis.isInvalid ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  {aiAnalysis.isInvalid ? <QuestionIcon size={11} className="animate-pulse" /> : <Edit3 size={11} />}
                  {aiAnalysis.isInvalid ? "Input Tidak Valid" : isTitleLocked ? "Read-Only (Locked)" : "Live Editor Active"}
                </span>
              </div>
            </div>
            <textarea
              value={generatedTitle}
              onChange={(e) => !isTitleLocked && setGeneratedTitle(e.target.value)}
              disabled={aiAnalysis.isInvalid || isTitleLocked}
              rows={2}
              className={`w-full text-base font-black bg-transparent resize-none border-none focus:ring-0 focus:outline-none p-0 leading-relaxed tracking-tight transition-all duration-300 ${
                aiAnalysis.isInvalid ? "text-amber-800 italic cursor-not-allowed" : isTitleLocked ? "text-slate-500 selection:bg-slate-200" : "text-slate-900 focus:text-emerald-900"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`p-5 rounded-2xl space-y-2.5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${aiAnalysis.isInvalid ? "bg-slate-50 text-slate-400 border-slate-200" : "bg-emerald-50/50 border-emerald-200 shadow-sm hover:border-emerald-300 hover:shadow-emerald-500/10"}`}>
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-slate-500">
                <CheckCircle2 size={14} className={aiAnalysis.isInvalid ? "text-slate-300" : "text-emerald-600"} /> Analisis Kontekstual Kalimat:
              </div>
              <p className="text-xs font-semibold leading-relaxed text-slate-600">{aiAnalysis.kelebihan}</p>
            </div>

            <div className={`p-5 rounded-2xl space-y-2.5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${aiAnalysis.isInvalid ? "bg-amber-50/80 border-amber-300 text-amber-900 hover:shadow-amber-500/10 hover:border-amber-400" : "bg-rose-50/50 border-rose-200 text-slate-600 shadow-sm hover:border-rose-300 hover:shadow-rose-500/10"}`}>
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-rose-800">
                <AlertTriangle size={14} className={aiAnalysis.isInvalid ? "text-amber-600 animate-pulse" : "text-rose-500"} /> Pemicu Kesalahan Atribut C4.5:
              </div>
              <p className="text-xs font-bold leading-relaxed text-slate-600">{aiAnalysis.kekurangan}</p>
            </div>
          </div>

          <div className={`p-5 border rounded-2xl space-y-3 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${aiAnalysis.isInvalid ? "bg-amber-50/50 border-amber-300 hover:border-amber-400" : "bg-amber-50/30 border-amber-200/80 hover:border-amber-300"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-wider">
                <QuestionIcon size={15} className={aiAnalysis.isInvalid ? "animate-bounce text-amber-600" : "text-amber-600"} />
                {aiAnalysis.isInvalid ? "PANDUAN SOLUSI PERBAIKAN TYPO:" : "Rekomendasi Struktur Penyempurnaan AI:"}
              </div>
              {!aiAnalysis.isInvalid && (
                <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">Algoritma C4.5 Optimized</span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-700 leading-relaxed italic bg-white border border-amber-200/80 p-4 rounded-xl shadow-xs transition-all hover:shadow-md hover:border-amber-300">
              "{aiAnalysis.saran}"
            </p>
          </div>

          {/* CONTROL BLOCKER / ACTION BUTTON PANEL */}
          {aiAnalysis.isInvalid ? (
            <div className="w-full p-4.5 bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-black rounded-2xl text-center flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md hover:bg-rose-100/50 transition-all duration-300">
              <ShieldAlert size={16} className="text-rose-600 animate-pulse" />
              Sistem Mengunci Akses! Mohon hapus teks asal / typo di kolom paling atas lalu klik 'Jalankan Analisis' kembali.
            </div>
          ) : (
            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:border-slate-300">
              <div className="text-left pl-2">
                <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">Status Konfigurasi Saat Ini</span>
                <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  {isTitleLocked ? <><Lock size={12} className="text-emerald-500" /> Terkunci Permanen (Siap Submit)</> : <><Unlock size={12} className="text-amber-500" /> Draft Terbuka (Siap Disimpan)</>}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={triggerSystemSuggestionModal}
                  className="w-full sm:w-auto p-3.5 px-6 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-900 font-black text-xs rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 group"
                >
                  <Sparkles size={13} className="text-amber-500 fill-amber-500 group-hover:scale-125 transition-transform" />
                  Gunakan Saran Sistem
                </button>
                <button
                  onClick={triggerCustomLockModal}
                  className="w-full sm:w-auto p-3.5 px-6 bg-gradient-to-r from-slate-950 to-slate-900 hover:from-black hover:to-slate-950 text-white font-black text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-slate-950/10 cursor-pointer hover:scale-105 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/20 active:scale-95 group"
                >
                  <Lock size={13} className="text-emerald-400 stroke-[2.5] group-hover:scale-110 transition-transform" /> Fix, Kunci Judul & Lanjut
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- RENDER MODAL 1: PORTAL JENDELA REMINDER VALIDASI (YANG BARU) --- */}
      {validationAlert.show && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" 
            onClick={() => setValidationAlert({ show: false, message: "" })}
          ></div>
          
          <div className="bg-white rounded-[28px] max-w-sm w-full p-6 text-center space-y-4 relative z-[100000] border border-slate-100 shadow-2xl transform transition-all duration-300 animate-in fade-in zoom-in-95 ease-out">
            <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-sm shadow-amber-500/10">
              <AlertTriangle size={22} className="animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">Aksi Diperlukan!</h4>
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                {validationAlert.message}
              </p>
            </div>

            <button
              onClick={() => setValidationAlert({ show: false, message: "" })}
              className="w-full py-3 bg-slate-950 hover:bg-black text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider hover:shadow-xl hover:shadow-emerald-950/10"
            >
              Oke, Mengerti
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: PORTAL KONFIRMASI PEMILIHAN JUDUL (BAWAAN SEBELUMNYA) */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in" 
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative z-[100000] border border-slate-100 transform transition-all duration-300 animate-in fade-in zoom-in-95 ease-out scale-100">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer hover:scale-110 active:scale-95 duration-200"
            >
              <X size={18} className="stroke-[2.5]" />
            </button>

            <div className="flex items-start gap-4.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md border ${
                modalType === "SYSTEM" 
                  ? "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 border-amber-200 animate-pulse" 
                  : "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 border-emerald-200 shadow-emerald-500/10"
              }`}>
                {modalType === "SYSTEM" ? <Sparkles size={22} className="text-amber-500 fill-amber-500" /> : <ShieldAlert size={22} />}
              </div>
              
              <div className="space-y-5 w-full">
                <h3 className="text-xl font-black text-slate-950 tracking-tight">
                  {modalType === "SYSTEM" ? "Terapkan Saran Perbaikan AI?" : "Kunci Draft Judul Mandiri?"}
                </h3>
                
                {modalType === "SYSTEM" ? (
                  <div className="space-y-3">
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                      Sistem akan menyuntikkan <span className="font-black text-amber-600">Rekomendasi Parameter Atribut Tambahan</span> secara otomatis untuk mengoptimalkan akurasi algoritma C4.5:
                    </p>
                    <div className="p-4 bg-amber-50/40 border border-amber-200 text-xs font-black text-slate-800 rounded-xl leading-relaxed italic shadow-inner">
                      "{aiAnalysis.suggestedTitleRefined}"
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                      Anda memilih untuk melanjutkan dengan <span className="font-black text-emerald-600">Judul Kustomisasi Aktif Anda</span> saat ini. Pastikan variabel fitur audio pilihan Anda sudah terstruktur:
                    </p>
                    <div className="p-4 bg-emerald-50/30 border border-emerald-200 text-xs font-black text-slate-800 rounded-xl leading-relaxed shadow-inner">
                      "{generatedTitle}"
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer hover:shadow-sm active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleFinalConfirm}
                    className={`flex items-center gap-1.5 px-5 py-2.5 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer hover:scale-105 hover:-translate-y-0.5 group ${
                      modalType === "SYSTEM"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20 hover:shadow-amber-500/40"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20 hover:shadow-emerald-500/40"
                    }`}
                  >
                    <Check size={14} className="stroke-[3] group-hover:scale-110 transition-transform" />
                    Ya, Kunci & Lanjut
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

export default Step1Business;