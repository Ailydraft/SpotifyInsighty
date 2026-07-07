import { useState, useEffect } from "react";
import { 
  Sparkles, Terminal, ArrowRight, Play, CheckCircle, RefreshCcw, 
  UploadCloud, FileSpreadsheet, Search, Sliders, FileText, Trash2, 
  AlertTriangle, HelpCircle, ChevronDown, ChevronUp, BarChart2, CheckCircle2, Zap,
  X, ShieldCheck, AlertCircle
} from "lucide-react";

function CrispSimulator({ currentStep, setStep }) {
  // ==========================================
  // STATE CUSTOM MODAL (POP-UP)
  // ==========================================
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'warning', // 'warning', 'confirm', 'action'
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Batal',
    onConfirm: null,
  });

  const closeModal = () => setModal({ ...modal, isOpen: false });

  const showModal = (type, title, message, onConfirm = null, confirmText = 'OK', cancelText = 'Batal') => {
    setModal({ isOpen: true, type, title, message, onConfirm, confirmText, cancelText });
  };

  // ==========================================
  // STATE TAHAP 1: BUSINESS UNDERSTANDING
  // ==========================================
  const [inputMode, setInputMode] = useState("scan");
  const [selectedVibe, setSelectedVibe] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [manualProblem, setManualProblem] = useState("");
  const [isStep1Processing, setIsStep1Processing] = useState(false);
  const [step1Result, setStep1Result] = useState(null);
  const [finalProjectTitle, setFinalProjectTitle] = useState("Analisis Prediksi Popularitas Lagu Spotify Menggunakan Algoritma C4.5");
  const [isEditingMandiri, setIsEditingMandiri] = useState(false);
  const [tempManualTitle, setTempManualTitle] = useState("");

  // ==========================================
  // STATE TAHAP 2: DATA UNDERSTANDING
  // ==========================================
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [activeDataTab, setActiveDataTab] = useState(null);

  // ==========================================
  // STATE TAHAP 3: DATA PREPARATION
  // ==========================================
  const [cleaningProgress, setCleaningProgress] = useState(0);
  const [activeCleaningStep, setActiveCleaningStep] = useState(0);
  const [calculatedEntropy, setCalculatedEntropy] = useState(null);

  // ==========================================
  // STATE TAHAP 4: MODELING (C4.5)
  // ==========================================
  const [openNode, setOpenNode] = useState(null);

  // ==========================================
  // STATE TAHAP 5: EVALUATION
  // ==========================================
  const [activeMatrixDetail, setActiveMatrixDetail] = useState(false);

  // ==========================================
  // STATE TAHAP 6: DEPLOYMENT HUB
  // ==========================================
  const [depVibe, setDepVibe] = useState("");
  const [depGenre, setDepGenre] = useState("");
  const [depEnergy, setDepEnergy] = useState("");
  const [deployedResults, setDeployedResults] = useState([]);

  // ==========================================
  // GLOBAL STATE UNTUK CUSTOM DROPDOWN
  // ==========================================
  const [openDropdown, setOpenDropdown] = useState(null);

  // Menutup dropdown jika klik di luar area
  useEffect(() => {
    const closeDropdowns = () => setOpenDropdown(null);
    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, []);

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // ==========================================
  // LOGIC & UTILITIES TAHAP 1
  // ==========================================
  const handleStep1Scan = () => {
    if (inputMode === "scan" && (!selectedVibe || !selectedTarget)) {
      showModal('warning', 'Kriteria Belum Lengkap! 🚨', 'Pilih kriteria vibe dan target market dulu ya di menu dropdown, biar AI kita bisa melakukan scanning yang akurat!');
      return;
    }
    if (inputMode === "manual" && !manualProblem) {
      showModal('warning', 'Teks Masih Kosong! ✍️', 'Ketik dulu rumusan masalah kamu di text box sebelum sistem mulai menganalisis.');
      return;
    }

    setIsStep1Processing(true);
    setStep1Result(null);

    setTimeout(() => {
      setIsStep1Processing(false);
      if (inputMode === "scan") {
        const titlesPool = [
          `Optimasi Strategi Rilis Lagu Kategori ${selectedVibe.split(' ')[1]} Khusus Pasar ${selectedTarget.split(' ')[1]} Berbasis Pohon Keputusan C4.5`,
          `Klasifikasi Fitur Audio Spotify Untuk Memprediksi Boomingnya Lagu Pada Segmentasi ${selectedTarget.split(' ')[1]}`,
          `Penerapan Data Mining C4.5 Dalam Menakar Indeks Popularitas Musik Bagi Pendengar ${selectedTarget.split(' ')[1]}`
        ];
        const randomTitle = titlesPool[Math.floor(Math.random() * titlesPool.length)];
        
        setStep1Result({
          title: randomTitle,
          pros: "Sangat spesifik, fokus pada segmentasi pasar yang jelas, dan variabel fitur audio terukur.",
          cons: "Ruang lingkup menjadi agak sempit jika dataset Spotify umum tidak difilter terlebih dahulu.",
          suggestion: `Sistem menyarankan penambahan batasan tahun rilis (misal: Dataset Era 2020-2026) agar akurasi C4.5 meningkat.`
        });
        setTempManualTitle(randomTitle);
      } else {
        setStep1Result({
          title: `Analisis Data Mining Penentu Popularitas Musik Berdasarkan Masalah: "${manualProblem}"`,
          pros: "Mengangkat keresahan riil dari kacamata user/kreator secara orisinal.",
          cons: "Kalimat judul berpotensi terlalu panjang dan kurang baku untuk standarisasi laporan ilmiah data mining.",
          suggestion: "Kerucutkan judul menjadi: 'Model Klasifikasi Pohon Keputusan C4.5 Untuk Prediksi Hit-Rate Track Berdasarkan Karakteristik Audio'."
        });
        setTempManualTitle(`Analisis Data Mining Penentu Popularitas Musik Berdasarkan Masalah: "${manualProblem}"`);
      }
    }, 1500);
  };

  const confirmLockTitle = (chosenTitle) => {
    showModal(
      'confirm', 
      'Kunci Judul Riset?', 
      `Apakah kamu yakin mengunci judul: "${chosenTitle}" untuk dibawa ke tahap Data Understanding?`, 
      () => {
        setFinalProjectTitle(chosenTitle);
        setStep(2);
        closeModal();
      },
      '🔒 Yakin & Lanjutkan'
    );
  };

  const resetTahap1 = () => {
    setStep1Result(null);
    setSelectedVibe("");
    setSelectedTarget("");
    setManualProblem("");
    setTempManualTitle("");
  };

  // ==========================================
  // LOGIC & UTILITIES TAHAP 2
  // ==========================================
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const processFiles = (filesList) => {
    if (uploadedFiles.length + filesList.length > 5) {
      showModal('warning', 'Batas Upload Tercapai ⚠️', 'Maksimal upload adalah 5 file aja ya! Biar performa engine tetap ringan dan optimal.');
      return;
    }

    const newFiles = Array.from(filesList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.name.split('.').pop().toUpperCase(),
      rows: Math.floor(Math.random() * 500) + 200,
      attributes: 8,
      missingValues: Math.floor(Math.random() * 15)
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFiles(e.dataTransfer.files);
  };

  const injectDummyDataset = () => {
    const dummies = [
      { id: "dum-1", name: "spotify_top_hits_2026.csv", size: "142.5 KB", type: "CSV", rows: 1200, attributes: 10, missingValues: 24 },
      { id: "dum-2", name: "acoustic_features_metadata.xlsx", size: "88.2 KB", type: "XLSX", rows: 450, attributes: 6, missingValues: 5 }
    ];
    setUploadedFiles(dummies);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const totalRowsLoaded = uploadedFiles.reduce((acc, curr) => acc + curr.rows, 0);
  const totalMissingValues = uploadedFiles.reduce((acc, curr) => acc + curr.missingValues, 0);

  // ==========================================
  // LOGIC & UTILITIES TAHAP 3
  // ==========================================
  const triggerColabCleaning = () => {
    if (uploadedFiles.length === 0) {
      showModal(
        'action', 
        'Dataset Kosong! 📭', 
        'Sistem tidak bisa melakukan simulasi cleaning. Kamu harus mengisi data terlebih dahulu di Tahap 2.',
        () => {
          setStep(2);
          closeModal();
        },
        '👉 Isi Tahap 2 Sekarang',
        'Tetap di Sini'
      );
      return;
    }
    setCleaningProgress(1);
    setActiveCleaningStep(1);

    setTimeout(() => { setActiveCleaningStep(2); setCleaningProgress(40); }, 800);
    setTimeout(() => { setActiveCleaningStep(3); setCleaningProgress(75); }, 1600);
    setTimeout(() => { 
      setActiveCleaningStep(4); 
      setCleaningProgress(100);
      setCalculatedEntropy({
        totalEntropy: 0.941,
        gainGenre: 0.452,
        gainEnergy: 0.281,
        bestAttribute: "GENRE (Lanjut sebagai Root Node)"
      });
    }, 2500);
  };

  // ==========================================
  // LOGIC & UTILITIES TAHAP 6
  // ==========================================
  const runEnterpriseClassifier = () => {
    if (!depVibe || !depGenre || !depEnergy) return;

    const largeSongCatalog = [
      { title: "Midnight Pulse", artist: "Al-Maraghi Projects", accuracy: "94.2%", tier: "TIER S (Mega Hit)", tempo: "128 BPM", energyScore: "0.89", status: "Highly Recommended" },
      { title: "Neon Depok Sky", artist: "Group 4 Rhythm", accuracy: "92.4%", tier: "TIER A (Viral Potential)", tempo: "115 BPM", energyScore: "0.72", status: "Stable Growth" },
      { title: "Cyber Sunset", artist: "LP3I Wave", accuracy: "89.1%", tier: "TIER A (Viral Potential)", tempo: "102 BPM", energyScore: "0.65", status: "Segmented Target" },
      { title: "Acoustic Coffee Beans", artist: "Lofi Horizon", accuracy: "91.8%", tier: "TIER B (Chill Vibes Only)", tempo: "84 BPM", energyScore: "0.34", status: "Perfect for Study" },
      { title: "Retro Overdrive", artist: "The Synthesizer", accuracy: "93.5%", tier: "TIER S (Mega Hit)", tempo: "140 BPM", energyScore: "0.95", status: "Dancefloor Magnet" }
    ];

    if (depEnergy.includes("High")) {
      setDeployedResults([largeSongCatalog[0], largeSongCatalog[1], largeSongCatalog[4]]);
    } else {
      setDeployedResults([largeSongCatalog[2], largeSongCatalog[3]]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4 relative">
      
      {/* ========================================================== */}
      {/* KEYFRAMES & CUSTOM CSS UNTUK ANIMASI MODERN & CUSTOM DROPDOWN */}
      {/* ========================================================== */}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.4);
        }
        .smooth-expand {
          transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out;
          overflow: hidden;
        }
        
        /* --- CUSTOM SELECT DROPDOWN CSS --- */
        .custom-select-wrapper {
          position: relative;
          width: 100%;
          user-select: none;
          z-index: 20; /* Biar numpuk di atas elemen lain pas dibuka */
        }
        .custom-select-trigger {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.875rem;
          color: #334155;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .custom-select-trigger:hover {
          border-color: #1DB954;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(29, 185, 84, 0.15);
        }
        .custom-select-wrapper.open .custom-select-trigger {
          border-color: #1DB954;
          box-shadow: 0 0 0 4px rgba(29, 185, 84, 0.1);
        }
        .arrow-down {
          width: 10px;
          height: 10px;
          border-right: 2px solid #64748b;
          border-bottom: 2px solid #64748b;
          transform: rotate(45deg);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .custom-select-wrapper.open .arrow-down {
          transform: rotate(-135deg);
          border-color: #1DB954;
        }
        .custom-options {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          right: 0;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(-15px) scale(0.95);
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          list-style: none;
          padding: 8px;
          margin: 0;
          max-height: 250px;
          overflow-y: auto;
        }
        .custom-select-wrapper.open .custom-options {
          opacity: 1;
          visibility: visible;
          pointer-events: all;
          transform: translateY(0) scale(1);
        }
        .custom-option {
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          color: #475569;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .custom-option:hover {
          background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%);
          color: #15803d;
          transform: translateX(5px);
        }

        /* --- CTA NEO RESET --- */
        .btn-neo-reset {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
          color: white;
          font-weight: 800;
          font-size: 12px;
          padding: 12px 24px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 10px 20px -5px rgba(255, 65, 108, 0.4);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .btn-neo-reset:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 15px 25px -5px rgba(255, 65, 108, 0.5);
        }
        .btn-neo-reset:active {
          transform: translateY(1px) scale(0.95);
        }
      `}</style>

      {/* ========================================================== */}
      {/* CUSTOM POP-UP MODAL */}
      {/* ========================================================== */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-pop border border-gray-100">
            <div className={`p-6 pb-4 flex items-center gap-4 ${
              modal.type === 'confirm' ? 'bg-gradient-to-r from-blue-50 to-white' : 
              modal.type === 'warning' ? 'bg-gradient-to-r from-amber-50 to-white' : 
              'bg-gradient-to-r from-rose-50 to-white'
            }`}>
              <div className={`p-3 rounded-2xl ${
                modal.type === 'confirm' ? 'bg-blue-100 text-blue-600' : 
                modal.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                'bg-rose-100 text-rose-600'
              }`}>
                {modal.type === 'confirm' && <ShieldCheck size={28} />}
                {modal.type === 'warning' && <AlertCircle size={28} />}
                {modal.type === 'action' && <AlertTriangle size={28} />}
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800">{modal.title}</h3>
              </div>
            </div>
            
            <div className="p-6 pt-2 text-sm text-gray-600 font-medium leading-relaxed">
              {modal.message}
            </div>

            <div className="p-5 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm"
              >
                {modal.cancelText}
              </button>
              
              {modal.type !== 'warning' && (
                <button 
                  onClick={modal.onConfirm}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${
                    modal.type === 'confirm' 
                      ? 'bg-gradient-to-r from-[#1DB954] to-emerald-500 shadow-emerald-500/30' 
                      : 'bg-gradient-to-r from-gray-900 to-black shadow-gray-900/30'
                  }`}
                >
                  {modal.confirmText}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* GLOBAL BANNER CRADLE */}
      {/* ========================================================== */}
      <div className="glass-panel p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-white to-green-50/30 transform hover:-translate-y-1 transition-all duration-300">
        <div>
          <span className="text-xs font-black text-[#1DB954] uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-lg inline-block mb-2 shadow-sm">
            ✨ CRISP-DM Wizard Workspace
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">
            {currentStep === 1 && "🎯 Tahap 1: Business Target & Initialization"}
            {currentStep === 2 && "🔍 Tahap 2: Data Ingestion & Understanding"}
            {currentStep === 3 && "🧼 Tahap 3: Data Preparation Engine"}
            {currentStep === 4 && "🌲 Tahap 4: C4.5 Decision Tree Structure"}
            {currentStep === 5 && "📈 Tahap 5: Confusion Matrix Evaluation"}
            {currentStep === 6 && "🚀 Tahap 6: Predictive Deployment Hub"}
          </h2>
        </div>
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 pl-3">Progress</span>
          <div className="bg-gradient-to-r from-[#1DB954] to-emerald-400 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md">
            Step {currentStep} / 6
          </div>
        </div>
      </div>

      {/* CORE FRAME CONTAINER */}
      <div className="bg-white p-5 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 min-h-[500px] transition-all duration-500 relative overflow-hidden">
        
        {/* ========================================================== */}
        {/* STEP 1: BUSINESS UNDERSTANDING */}
        {/* ========================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-pop">
            <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Tentukan metode inisialisasi masalah. Gunakan <strong className="text-gray-900">⚡ Smart Scanning</strong> untuk auto-generate atau <strong className="text-gray-900">✍️ Manual Box</strong> untuk ulasan otomatis dari AI Reviewer.
              </p>
              <div className="bg-white p-1.5 rounded-xl border border-gray-200 flex gap-1 shadow-sm shrink-0">
                <button 
                  onClick={() => { setInputMode("scan"); setStep1Result(null); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${inputMode === "scan" ? "bg-[#1DB954] text-white shadow-md scale-100" : "text-gray-500 hover:bg-gray-50 scale-95 hover:scale-100"}`}
                >
                  ⚡ Smart Scan
                </button>
                <button 
                  onClick={() => { setInputMode("manual"); setStep1Result(null); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${inputMode === "manual" ? "bg-[#1DB954] text-white shadow-md scale-100" : "text-gray-500 hover:bg-gray-50 scale-95 hover:scale-100"}`}
                >
                  ✍️ Manual Text
                </button>
              </div>
            </div>

            {/* INTERACTIVE INPUT CONTROLS */}
            <div className="transition-all duration-300 relative z-20">
              {inputMode === "scan" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6 rounded-3xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:border-[#1DB954] transition-colors">
                  
                  {/* CUSTOM DROPDOWN VIBE */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider group-hover:text-[#1DB954] transition-colors">Kriteria Vibe / Karakteristik</label>
                    <div className={`custom-select-wrapper ${openDropdown === 'vibe' ? 'open' : ''}`}>
                      <div className="custom-select-trigger" onClick={(e) => toggleDropdown(e, 'vibe')}>
                        <span className="selected-text">{selectedVibe || "-- Pilih Core Vibe --"}</span>
                        <div className="arrow-down"></div>
                      </div>
                      <ul className="custom-options">
                        <li className="custom-option" onClick={() => { setSelectedVibe("🔥 High-Energy & Fast Tempo (Dance/Club)"); setOpenDropdown(null); }}>🔥 High-Energy & Fast Tempo (Dance/Club)</li>
                        <li className="custom-option" onClick={() => { setSelectedVibe("😭 Melancholic & Low Valence (Sad/Galau)"); setOpenDropdown(null); }}>😭 Melancholic & Low Valence (Sad/Galau)</li>
                        <li className="custom-option" onClick={() => { setSelectedVibe("☕ Acoustic & Minimalist (Chill/Belajar)"); setOpenDropdown(null); }}>☕ Acoustic & Minimalist (Chill/Belajar)</li>
                      </ul>
                    </div>
                  </div>

                  {/* CUSTOM DROPDOWN TARGET */}
                  <div className="space-y-2 group">
                    <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider group-hover:text-[#1DB954] transition-colors">Segmentasi Pasar (Target)</label>
                    <div className={`custom-select-wrapper ${openDropdown === 'target' ? 'open' : ''}`}>
                      <div className="custom-select-trigger" onClick={(e) => toggleDropdown(e, 'target')}>
                        <span className="selected-text">{selectedTarget || "-- Pilih Segmentasi --"}</span>
                        <div className="arrow-down"></div>
                      </div>
                      <ul className="custom-options">
                        <li className="custom-option" onClick={() => { setSelectedTarget("🎧 Gen-Z Indonesia (TikTok Viral)"); setOpenDropdown(null); }}>🎧 Gen-Z Indonesia (TikTok Viral)</li>
                        <li className="custom-option" onClick={() => { setSelectedTarget("💻 Pekerja Kantoran / Fokus Study"); setOpenDropdown(null); }}>💻 Pekerja Kantoran / Fokus Study</li>
                        <li className="custom-option" onClick={() => { setSelectedTarget("🎸 Komunitas Pendengar Musik Indie"); setOpenDropdown(null); }}>🎸 Komunitas Pendengar Musik Indie</li>
                      </ul>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="space-y-2 group p-1">
                  <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider group-hover:text-[#1DB954] transition-colors">Ketik Rumusan Masalah Industri</label>
                  <textarea 
                    value={manualProblem}
                    onChange={(e) => setManualProblem(e.target.value)}
                    placeholder="Ceritakan keresahan industri musik di sini... (Contoh: Banyak lagu gagal nembus Top 50 karena...)"
                    className="w-full p-4 rounded-2xl border-2 border-gray-100 text-sm font-medium bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1DB954]/10 focus:border-[#1DB954] h-32 transition-all resize-none shadow-inner"
                  />
                </div>
              )}
            </div>

            {/* TRIGGER SCANNING BUTTON */}
            <button
              onClick={handleStep1Scan}
              disabled={isStep1Processing}
              className="w-full relative overflow-hidden bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group z-10"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
              
              {isStep1Processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memproses Analisis AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <span>Jalankan Analisis & Generate Judul</span>
                </>
              )}
            </button>

            {/* SCANNING & SYSTEM REVIEWER RESULT */}
            {step1Result && (
              <div className="mt-8 border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-lg shadow-emerald-100/50 animate-pop">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[#1DB954] font-black text-xs uppercase tracking-widest bg-emerald-100/50 px-3 py-1.5 rounded-lg w-max">
                    <CheckCircle2 size={16} />
                    <span>AI Reviewer System Result</span>
                  </div>
                  
                  {/* CTA NEO RESET BUTTON (HAPUS JUDUL) */}
                  <button onClick={resetTahap1} className="btn-neo-reset w-full sm:w-auto">
                    <RefreshCcw size={14} /> Hapus & Reset Judul
                  </button>
                </div>

                {/* EDITABLE/FIXED VIEW */}
                <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  {isEditingMandiri ? (
                    <div className="space-y-3 animate-pop">
                      <input 
                        type="text"
                        value={tempManualTitle}
                        onChange={(e) => setTempManualTitle(e.target.value)}
                        className="w-full p-3 border-2 border-[#1DB954] rounded-xl text-sm font-bold bg-green-50/20 focus:outline-none focus:bg-white transition-colors"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setIsEditingMandiri(false)} className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Batal</button>
                        <button onClick={() => { setStep1Result({...step1Result, title: tempManualTitle}); setIsEditingMandiri(false); }} className="px-4 py-2 text-xs font-black text-white bg-gray-900 rounded-xl hover:bg-black transition-colors shadow-md">Simpan Ubahan</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <h4 className="text-lg sm:text-xl font-black text-gray-800 leading-snug">
                        {step1Result.title}
                      </h4>
                      <button 
                        onClick={() => setIsEditingMandiri(true)}
                        className="text-[10px] font-black text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:text-[#1DB954] hover:border-[#1DB954] bg-white transition-all shrink-0 shadow-sm hover:shadow active:scale-95"
                      >
                        📝 Edit Mandiri
                      </button>
                    </div>
                  )}
                </div>

                {/* PROS & CONS DISCLOSURE MATRICES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300">
                    <span className="font-black text-emerald-800 block mb-2 text-sm flex items-center gap-2">
                      <div className="bg-emerald-200 p-1 rounded-md"><CheckCircle size={14} className="text-emerald-700"/></div>
                      Kelebihan Judul:
                    </span>
                    <p className="text-emerald-700 font-medium leading-relaxed">{step1Result.pros}</p>
                  </div>
                  <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300">
                    <span className="font-black text-rose-800 block mb-2 text-sm flex items-center gap-2">
                      <div className="bg-rose-200 p-1 rounded-md"><X size={14} className="text-rose-700"/></div>
                      Kekurangan / Celah:
                    </span>
                    <p className="text-rose-700 font-medium leading-relaxed">{step1Result.cons}</p>
                  </div>
                </div>

                {/* SUGGESTION BOX */}
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed flex gap-3 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200 blur-2xl rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="bg-white p-2 rounded-xl shadow-sm h-min z-10">
                    <AlertTriangle size={20} className="text-amber-500" />
                  </div>
                  <div className="z-10">
                    <strong className="block mb-1 font-black text-amber-900 text-sm">💡 Saran Perbaikan Struktural:</strong>
                    <p className="text-amber-800/80">{step1Result.suggestion}</p>
                  </div>
                </div>

                {/* CONFIRMATION STRATEGY BUTTONS */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 justify-end border-t border-emerald-100/50">
                  <button 
                    onClick={() => {
                      const optimizedTitle = "Model Klasifikasi Pohon Keputusan C4.5 Untuk Prediksi Hit-Rate Track Berdasarkan Karakteristik Audio";
                      confirmLockTitle(optimizedTitle);
                    }}
                    className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
                  >
                    ✨ Gunakan Saran Sistem
                  </button>
                  <button 
                    onClick={() => confirmLockTitle(step1Result.title)}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-[#1DB954] text-white px-6 py-3 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98] transition-all"
                  >
                    🔒 Fix, Kunci Judul & Lanjut
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* STEP 2: DATA UNDERSTANDING */}
        {/* ========================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-pop">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-gray-900 text-white rounded-3xl shadow-lg flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="bg-white/10 p-3 rounded-2xl text-emerald-400 shrink-0 backdrop-blur-md border border-white/10">
                <ShieldCheck size={24} />
              </div>
              <div className="z-10">
                <span className="text-[10px] font-black text-emerald-300 block uppercase tracking-widest mb-0.5">Judul Terkunci (Tahap 1)</span>
                <p className="text-sm sm:text-base font-black text-white leading-tight">"{finalProjectTitle}"</p>
              </div>
            </div>

            <p className="text-gray-500 text-xs sm:text-sm font-medium px-1">
              Silakan unggah dataset kamu (Maksimal <strong className="text-gray-800">5 File CSV/Excel</strong>). Klik ringkasan kotak di bawah untuk memunculkan panel analisis data (*dropdown pop-up*).
            </p>

            <div 
              onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
              onClick={() => document.getElementById("multi-csv-picker").click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center group
                ${dragActive ? "border-[#1DB954] bg-green-50/50 scale-[1.02] shadow-lg" : "border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md hover:border-gray-300"}`}
            >
              <input type="file" id="multi-csv-picker" accept=".csv,.xlsx,.xls" multiple onChange={(e) => { if(e.target.files) processFiles(e.target.files); }} className="hidden" />
              <div className="p-4 rounded-full bg-white text-gray-400 shadow-sm mb-3 group-hover:scale-110 group-hover:text-[#1DB954] transition-all duration-300">
                <UploadCloud size={28} />
              </div>
              <h4 className="font-black text-gray-700 text-sm mb-1 group-hover:text-gray-900 transition-colors">Seret Berkas ke Sini atau Klik Browse</h4>
              <p className="text-xs text-gray-400 font-medium mb-4">Format: .CSV / .XLSX (Max 5 Berkas)</p>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); injectDummyDataset(); }}
                className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:shadow hover:border-[#1DB954] hover:text-[#1DB954] active:scale-95 transition-all flex items-center gap-2"
              >
                <Zap size={14} className="text-amber-500" />
                Inject Data Simulasi Default Group 4
              </button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-5 animate-pop pt-2">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <FileSpreadsheet size={16} className="text-[#1DB954]" />
                    <span>Daftar Ingesti Data ({uploadedFiles.length}/5):</span>
                  </h4>
                  <button onClick={() => setUploadedFiles([])} className="text-[10px] font-bold text-rose-600 bg-white border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm flex items-center gap-1">
                    <Trash2 size={12} /> Bersihkan Semua
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-black shadow-inner">{file.type}</span>
                        <p className="text-xs font-bold text-gray-800 truncate mt-2">{file.name}</p>
                        <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{file.size} • {file.rows} Baris</span>
                      </div>
                      <button onClick={() => removeFile(file.id)} className="text-gray-300 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-colors shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-black text-gray-800 mb-4 px-1">📈 Ringkasan Metadata (Klik untuk Analisis):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div onClick={() => setActiveDataTab(activeDataTab === 'rows' ? null : 'rows')} className={`p-5 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${activeDataTab === 'rows' ? 'border-[#1DB954] bg-emerald-50/30 shadow-md scale-[1.02]' : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm'}`}>
                      <span className="text-2xl sm:text-3xl font-black text-gray-800 block mb-1">{totalRowsLoaded}</span>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest flex items-center justify-center gap-1">Total Instances <ChevronDown size={12} className={`transition-transform duration-300 ${activeDataTab === 'rows' ? 'rotate-180 text-[#1DB954]' : ''}`} /></p>
                    </div>
                    <div onClick={() => setActiveDataTab(activeDataTab === 'attributes' ? null : 'attributes')} className={`p-5 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${activeDataTab === 'attributes' ? 'border-[#1DB954] bg-emerald-50/30 shadow-md scale-[1.02]' : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm'}`}>
                      <span className="text-2xl sm:text-3xl font-black text-gray-800 block mb-1">{uploadedFiles[0]?.attributes || 0}</span>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest flex items-center justify-center gap-1">Atribut Terdeteksi <ChevronDown size={12} className={`transition-transform duration-300 ${activeDataTab === 'attributes' ? 'rotate-180 text-[#1DB954]' : ''}`} /></p>
                    </div>
                    <div onClick={() => setActiveDataTab(activeDataTab === 'missing' ? null : 'missing')} className={`p-5 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${activeDataTab === 'missing' ? 'border-amber-400 bg-amber-50/30 shadow-md scale-[1.02]' : 'border-gray-100 bg-white hover:border-amber-200 hover:shadow-sm'}`}>
                      <span className={`text-2xl sm:text-3xl font-black block mb-1 ${totalMissingValues > 0 ? "text-amber-500" : "text-gray-800"}`}>{totalMissingValues}</span>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest flex items-center justify-center gap-1">Missing (Null) <ChevronDown size={12} className={`transition-transform duration-300 ${activeDataTab === 'missing' ? 'rotate-180 text-amber-500' : ''}`} /></p>
                    </div>
                  </div>
                  
                  <div className={`smooth-expand ${activeDataTab ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                    <div className="p-5 bg-gray-900 text-gray-300 rounded-2xl font-mono text-xs space-y-2 border border-gray-800 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Terminal size={64}/></div>
                      {activeDataTab === 'rows' && (
                        <div className="animate-pop z-10 relative">
                          <p className="text-[#1DB954] font-black mb-2 text-sm">// Distribusi Data Latih vs Uji:</p>
                          <p className="text-gray-400">&gt; Engine mendeteksi volume data mencukupi untuk C4.5.</p>
                          <p className="text-gray-400">&gt; Standar Pembagian = <span className="text-white font-bold">80% Training</span> ({Math.floor(totalRowsLoaded * 0.8)} baris) & <span className="text-white font-bold">20% Testing</span> ({Math.floor(totalRowsLoaded * 0.2)} baris).</p>
                        </div>
                      )}
                      {activeDataTab === 'attributes' && (
                        <div className="animate-pop z-10 relative">
                          <p className="text-[#1DB954] font-black mb-2 text-sm">// Profiling Karakteristik Audio:</p>
                          <p className="text-gray-400">&gt; Tipe Kategori: <span className="text-blue-300">[Genre, Vibe, Label_Popularitas]</span></p>
                          <p className="text-gray-400">&gt; Tipe Numerik: <span className="text-purple-300">[Acousticness, Danceability, Energy, Loudness]</span></p>
                        </div>
                      )}
                      {activeDataTab === 'missing' && (
                        <div className="animate-pop z-10 relative">
                          <p className="text-amber-400 font-black mb-2 text-sm">// Audit Integritas Data (Warning):</p>
                          <p className="text-gray-400">&gt; Ditemukan <span className="text-amber-400 font-bold">{totalMissingValues} baris cacat/kosong</span>.</p>
                          <p className="text-gray-400">&gt; Resolusi Tahap 3: Sistem akan mengeksekusi metode <span className="text-white font-bold">Mean Imputation</span> agar perhitungan Algoritma Logaritma Entropy tidak menghasilkan eror matematis (NaN).</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button onClick={() => setStep(3)} className="bg-gradient-to-r from-gray-900 to-black text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                    Lanjut ke Data Preparation Engine <ArrowRight size={16} className="text-emerald-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* STEP 3, 4, 5 (Statis seperti sebelumnya, tidak dirubah logikanya) */}
        {/* ========================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-pop">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
              <HelpCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-blue-900 text-xs sm:text-sm font-medium leading-relaxed">
                Di lingkungan produksi, tahap ini dieksekusi via <strong className="font-bold">Google Colab</strong>. Di simulator ini, kita akan menjalankan <strong className="font-bold">Colab Pipeline Simulator</strong> untuk membersihkan data dan menghitung rumus Entropy C4.5 secara otomatis dan divisualisasikan secara *real-time*.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Jalur Pipeline Eksplorasi Data</h4>
                <div className="space-y-3">
                  {["1. Imputasi & Drop Missing Values", "2. Binning Numerik ke Kategori", "3. Hitung Matriks Kriteria Entropy", "4. Cari Gain Rasio Tertinggi"].map((label, index) => {
                    const stepNum = index + 1;
                    const isActive = activeCleaningStep >= stepNum;
                    return (
                      <div key={stepNum} className={`p-3.5 rounded-2xl border-2 font-bold text-xs flex items-center justify-between transition-all duration-500 ${isActive ? "border-[#1DB954] bg-emerald-50/50 text-emerald-900 shadow-sm transform scale-[1.02]" : "border-gray-100 bg-white text-gray-400"}`}>
                        <span>{label}</span>
                        {isActive && <CheckCircle2 size={18} className="text-[#1DB954] animate-pop" />}
                      </div>
                    )
                  })}
                </div>
                <button onClick={triggerColabCleaning} disabled={cleaningProgress > 0 && cleaningProgress < 100} className="w-full bg-gradient-to-r from-gray-900 to-black text-white font-bold text-sm py-4 rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-wait mt-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/10 w-0 group-hover:w-full transition-all duration-300 ease-out"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {cleaningProgress === 0 ? <><Play size={16} className="text-[#1DB954] fill-[#1DB954]" /> Jalankan Cleaning Engine</> : 
                     cleaningProgress < 100 ? <><RefreshCcw size={16} className="animate-spin text-emerald-400"/> Memproses Pipeline...</> : 
                     <><RefreshCcw size={16} /> Reset & Bersihkan Ulang</>}
                  </span>
                </button>
              </div>
              <div className="lg:col-span-7 bg-[#0D1117] p-5 sm:p-6 rounded-3xl border border-gray-800 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-gray-800/80 pb-3 mb-4">
                    <span className="text-xs font-mono text-gray-400 flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg"><Terminal size={14} className="text-emerald-400" /> group4_data_mining_workspace.ipynb</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    </div>
                  </div>
                  <div className="font-mono text-xs space-y-2 text-gray-300 h-52 overflow-y-auto custom-scrollbar pr-2">
                    {cleaningProgress === 0 && <p className="text-gray-500 italic opacity-70 animate-pulse">// Terminal idle. Menunggu instruksi eksekusi...</p>}
                    {cleaningProgress >= 1 && <p className="text-blue-400 animate-fade-in-up">&gt; import pandas as pd; import numpy as np</p>}
                    {cleaningProgress >= 1 && <p className="text-gray-300 animate-fade-in-up" style={{animationDelay: '0.2s'}}>&gt; df = pd.read_csv("uploaded_dataset.csv").dropna()</p>}
                    {activeCleaningStep >= 2 && <p className="text-emerald-400 animate-fade-in-up" style={{animationDelay: '0.1s'}}>&gt; <span className="text-emerald-200">[INFO]</span> Mengubah continuous 'Energy' &gt; 0.70 jadi 'High Energy'</p>}
                    {activeCleaningStep >= 3 && <p className="text-purple-400 animate-fade-in-up" style={{animationDelay: '0.1s'}}>&gt; Rumus: Entropy(S) = -(p_yes * log2(p_yes)) - (p_no * log2(p_no))</p>}
                    {activeCleaningStep >= 4 && <p className="text-amber-400 font-bold animate-fade-in-up" style={{animationDelay: '0.1s'}}>&gt; SUCCESS: Kalkulasi Information Gain Atribut Selesai!</p>}
                  </div>
                </div>
                {cleaningProgress > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-800/80 relative z-10">
                    <div className="flex justify-between text-[10px] font-mono mb-2 text-gray-400 uppercase tracking-widest">
                      <span>Pipeline Integration</span><span className="text-emerald-400 font-bold">{cleaningProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-emerald-600 via-[#1DB954] to-emerald-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(29,185,84,0.5)]" style={{ width: `${cleaningProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {calculatedEntropy && (
              <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl shadow-gray-200/50 animate-pop mt-6 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-5"><BarChart2 size={150}/></div>
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 relative z-10">
                  <div className="bg-emerald-100 p-1.5 rounded-lg"><BarChart2 size={16} className="text-[#1DB954]" /></div>
                  Hasil Kuantitatif Rumus C4.5
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center relative z-10">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100"><span className="text-xl font-mono font-black text-gray-800">{calculatedEntropy.totalEntropy}</span><p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Entropy Total S</p></div>
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100"><span className="text-xl font-mono font-black text-emerald-600">+{calculatedEntropy.gainGenre}</span><p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Gain (Genre)</p></div>
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100"><span className="text-xl font-mono font-black text-emerald-600">+{calculatedEntropy.gainEnergy}</span><p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Gain (Energy)</p></div>
                  <div className="p-4 bg-gradient-to-br from-[#1DB954] to-emerald-500 rounded-2xl shadow-lg text-white flex flex-col justify-center items-center transform hover:scale-105 transition-transform duration-300">
                    <span className="text-sm font-black truncate w-full px-2 drop-shadow-md">{calculatedEntropy.bestAttribute}</span><p className="text-[10px] text-emerald-100 font-bold uppercase mt-1 tracking-wider">Root Node Terpilih</p>
                  </div>
                </div>
                <div className="pt-4 flex justify-end relative z-10 border-t border-gray-100">
                  <button onClick={() => setStep(4)} className="bg-gradient-to-r from-gray-900 to-black text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-xl hover:-translate-y-1 transition-all">
                    Bentuk Pohon Keputusan <ArrowRight size={16} className="text-emerald-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-pop">
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Berdasarkan nilai Information Gain Tahap 3, <strong className="text-gray-900">GENRE</strong> terpilih sebagai akar pohon (*Root Node*).</p>
            <div className="p-6 sm:p-8 bg-gray-50 border border-gray-100 rounded-3xl space-y-6 shadow-inner relative">
              <div className="flex justify-center relative z-10">
                <div className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-mono text-sm font-black text-center border-[3px] border-[#1DB954] shadow-[0_10px_30px_rgba(29,185,84,0.2)]">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block mb-1">=== Root Node ===</span>Atribut Utama: GENRE
                </div>
              </div>
              <div className="hidden md:block absolute top-[100px] left-1/2 w-[50%] h-[40px] border-t-2 border-l-2 border-r-2 border-gray-300 rounded-t-xl -translate-x-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pt-4 md:pt-8">
                <div className="border border-gray-200 bg-white p-5 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-blue-600 font-mono bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">├── "Pop"</span>
                    <button onClick={() => setOpenNode(openNode === 'pop' ? null : 'pop')} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${openNode === 'pop' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <span>Analisis</span><ChevronDown size={14} className={`transition-transform duration-300 ${openNode === 'pop' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  <div className={`smooth-expand ${openNode === 'pop' ? 'max-h-[200px] mb-4' : 'max-h-0'}`}>
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs text-gray-600 font-medium">
                      <p className="text-blue-700 font-black mb-1 text-sm flex items-center gap-1"><Zap size={14}/> Rationale Logika:</p>
                      <p>Musik Pop mendominasi 65% total streaming. Jika sub-vibe bernilai <strong className="text-gray-900">"Happy"</strong>, probabilitas melonjak ke <strong className="text-[#1DB954]">CLASS A (96% Akurat)</strong>.</p>
                    </div>
                  </div>
                  <div className="pl-5 border-l-[3px] border-gray-100 space-y-3 text-xs font-mono">
                    <p className="font-semibold text-gray-500 flex flex-wrap items-center gap-2">├── Mood == "Happy" <ArrowRight size={12}/> <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-black shadow-sm">[CLASS A: Populer]</span></p>
                    <p className="font-semibold text-gray-500 flex flex-wrap items-center gap-2">└── Mood == "Sad" <ArrowRight size={12}/> <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded font-black shadow-sm">[CLASS B: Segmented]</span></p>
                  </div>
                </div>
                <div className="border border-gray-200 bg-white p-5 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-purple-600 font-mono bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">└── "Rock/Indie"</span>
                    <button onClick={() => setOpenNode(openNode === 'rock' ? null : 'rock')} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${openNode === 'rock' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <span>Analisis</span><ChevronDown size={14} className={`transition-transform duration-300 ${openNode === 'rock' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  <div className={`smooth-expand ${openNode === 'rock' ? 'max-h-[200px] mb-4' : 'max-h-0'}`}>
                    <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 text-xs text-gray-600 font-medium">
                      <p className="text-purple-700 font-black mb-1 text-sm flex items-center gap-1"><Zap size={14}/> Rationale Logika:</p>
                      <p>Untuk Rock/Indie, entitas terkuat adalah <strong className="text-gray-900">"Energy"</strong>. Aturan mewajibkan nilai ketukan drum/ritme berada di atas ambang batas biner 0.72 agar direkomendasikan.</p>
                    </div>
                  </div>
                  <div className="pl-5 border-l-[3px] border-gray-100 space-y-3 text-xs font-mono">
                    <p className="font-semibold text-gray-500 flex flex-wrap items-center gap-2">├── Energy &gt; 0.72 <ArrowRight size={12}/> <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-black shadow-sm">[CLASS A: High Rec]</span></p>
                    <p className="font-semibold text-gray-500 flex flex-wrap items-center gap-2">└── Energy &lt;= 0.72 <ArrowRight size={12}/> <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded font-black shadow-sm">[CLASS C: Low Stream]</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button onClick={() => setStep(5)} className="bg-gradient-to-r from-gray-900 to-black text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-xl hover:-translate-y-1 transition-all">
                Uji Validasi Evaluasi Model <ArrowRight size={16} className="text-emerald-400" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6 animate-pop">
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Pembuktian validitas pohon C4.5 diuji menggunakan matriks konfusi (*Confusion Matrix*).</p>
            <div className="bg-gradient-to-br from-white via-emerald-50/20 to-emerald-100/40 border border-emerald-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-emerald-100/30 group">
              <div className="space-y-3 text-center md:text-left">
                <span className="text-[10px] font-black text-[#1DB954] bg-white border border-emerald-100 px-4 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Verified Accuracy Score
                </span>
                <h3 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tighter drop-shadow-sm group-hover:scale-105 transition-transform duration-500 origin-left">
                  92.4<span className="text-emerald-500">%</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium max-w-sm leading-relaxed">Model sangat stabil dan layak *deploy*. Tingkat kesalahan prediksi minim di bawah batas toleransi &lt; 10%.</p>
              </div>
              <button onClick={() => setActiveMatrixDetail(!activeMatrixDetail)} className="w-full md:w-auto bg-gray-900 text-white font-black text-xs px-8 py-4 rounded-2xl hover:bg-black transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95">
                <div className={`transition-transform duration-500 ${activeMatrixDetail ? 'rotate-180' : ''}`}><Sliders size={18} className="text-emerald-400" /></div>
                <span>{activeMatrixDetail ? "Tutup Detail Audit" : "Bedah Confusion Matrix"}</span>
              </button>
            </div>
            <div className={`smooth-expand ${activeMatrixDetail ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 sm:p-8 border border-gray-100 bg-gray-50 rounded-3xl shadow-inner">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Tabel Testing Set</h4>
                  <div className="overflow-hidden border border-gray-200 rounded-2xl bg-white shadow-sm">
                    <table className="w-full text-center text-xs font-mono">
                      <thead className="bg-gray-100/50 font-black text-gray-700">
                        <tr><th className="p-4 border-b border-gray-200">N = 200 Lagu</th><th className="p-4 border-b border-gray-200 bg-emerald-50/50 text-emerald-800">Pred: POPULER</th><th className="p-4 border-b border-gray-200 bg-rose-50/50 text-rose-800">Pred: GAGAL</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50 transition-colors"><td className="p-4 font-bold text-gray-600 bg-gray-50/30">Asli: POPULER</td><td className="p-4 font-black text-emerald-600 bg-emerald-50/30 text-sm">142 (TP)</td><td className="p-4 font-medium text-gray-400">8 (FN)</td></tr>
                        <tr className="hover:bg-gray-50 transition-colors"><td className="p-4 font-bold text-gray-600 bg-gray-50/30">Asli: GAGAL</td><td className="p-4 font-medium text-gray-400">7 (FP)</td><td className="p-4 font-black text-emerald-600 bg-emerald-50/30 text-sm">43 (TN)</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="p-6 bg-gray-900 text-gray-300 rounded-2xl font-mono text-xs space-y-3 leading-relaxed relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><CheckCircle2 size={100} /></div>
                  <p className="text-emerald-400 font-black text-sm mb-4 relative z-10">// Eksekusi Audit Performa Algoritma:</p>
                  <div className="space-y-3 relative z-10">
                    <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50"><strong className="text-white block mb-1">Akurasi (92.4%):</strong> (142 TP + 43 TN) / 200 total dataset.</div>
                    <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50"><strong className="text-emerald-300 block mb-1">Kelebihan (Precision):</strong> Mengenali lagu sukses 95.3%. Sangat reliabel.</div>
                    <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50"><strong className="text-amber-300 block mb-1">Kekurangan (Bias):</strong> Terdapat 7 eror bias minor (*False Positive*).</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 flex justify-end border-t border-gray-100">
              <button onClick={() => setStep(6)} className="w-full sm:w-auto bg-gradient-to-r from-[#1DB954] to-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-[0_10px_30px_rgba(29,185,84,0.3)] text-center hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3">
                Buka Gerbang Akhir: Deployment Hub 🚀
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* STEP 6: DEPLOYMENT HUB (DENGAN CUSTOM DROPDOWN) */}
        {/* ========================================================== */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-pop">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DB954]/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000 ease-in-out"></div>
              <div className="bg-white/10 p-4 rounded-2xl text-emerald-400 backdrop-blur-md border border-white/10 shrink-0 relative z-10 shadow-lg"><Sparkles size={32} /></div>
              <div className="relative z-10 text-center sm:text-left space-y-2">
                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-900/50 px-3 py-1 rounded-full border border-emerald-700/50">Enterprise Edition</span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">Predictive Audio Classifier</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-lg leading-relaxed">Ini adalah simulasi bentuk nyata (deployment) aplikasi. Silakan atur filter lagu di bawah untuk menguji rekomendasi AI berbasis aturan C4.5 yang telah kita buat.</p>
              </div>
            </div>

            {/* INTERACTIVE FILTERS DENGAN CUSTOM DROPDOWN REACT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 bg-gray-50 border border-gray-100 rounded-3xl shadow-inner relative z-20">
              
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 group-hover:text-emerald-500 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-emerald-500"></div> Mood Lagu
                </label>
                <div className={`custom-select-wrapper ${openDropdown === 'depVibe' ? 'open' : ''}`}>
                  <div className="custom-select-trigger" onClick={(e) => toggleDropdown(e, 'depVibe')}>
                    <span className="selected-text">{depVibe || "-- Pilih Mood --"}</span>
                    <div className="arrow-down"></div>
                  </div>
                  <ul className="custom-options">
                    <li className="custom-option" onClick={() => { setDepVibe("😊 Happy & Upbeat"); setOpenDropdown(null); }}>😊 Happy & Upbeat</li>
                    <li className="custom-option" onClick={() => { setDepVibe("😭 Melankolis / Sad"); setOpenDropdown(null); }}>😭 Melankolis / Sad</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 group-hover:text-emerald-500 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-emerald-500"></div> Core Genre
                </label>
                <div className={`custom-select-wrapper ${openDropdown === 'depGenre' ? 'open' : ''}`}>
                  <div className="custom-select-trigger" onClick={(e) => toggleDropdown(e, 'depGenre')}>
                    <span className="selected-text">{depGenre || "-- Pilih Genre --"}</span>
                    <div className="arrow-down"></div>
                  </div>
                  <ul className="custom-options">
                    <li className="custom-option" onClick={() => { setDepGenre("Pop"); setOpenDropdown(null); }}>Pop</li>
                    <li className="custom-option" onClick={() => { setDepGenre("Rock / Indie"); setOpenDropdown(null); }}>Rock / Indie</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 group-hover:text-emerald-500 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-emerald-500"></div> Energy Threshold
                </label>
                <div className={`custom-select-wrapper ${openDropdown === 'depEnergy' ? 'open' : ''}`}>
                  <div className="custom-select-trigger" onClick={(e) => toggleDropdown(e, 'depEnergy')}>
                    <span className="selected-text">{depEnergy || "-- Ambang Energi --"}</span>
                    <div className="arrow-down"></div>
                  </div>
                  <ul className="custom-options">
                    <li className="custom-option" onClick={() => { setDepEnergy("⚡ High Beats (> 0.72)"); setOpenDropdown(null); }}>⚡ High Beats (&gt; 0.72)</li>
                    <li className="custom-option" onClick={() => { setDepEnergy("☕ Low Acoustical (<= 0.72)"); setOpenDropdown(null); }}>☕ Low Acoustical (&lt;= 0.72)</li>
                  </ul>
                </div>
              </div>

            </div>

            <button
              onClick={runEnterpriseClassifier}
              disabled={!depVibe || !depGenre || !depEnergy}
              className="w-full bg-[#1DB954] text-white font-black text-sm py-4 rounded-2xl hover:bg-emerald-600 shadow-[0_8px_20px_rgba(29,185,84,0.25)] hover:shadow-[0_12px_25px_rgba(29,185,84,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:transform-none flex items-center justify-center gap-2 relative z-10"
            >
              🎯 Eksekusi Engine Filter Klasifikasi
            </button>

            {/* RICH SONG RECOMMENDATIONS CATALOG */}
            <div className={`smooth-expand ${deployedResults.length > 0 ? 'max-h-[1000px] opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="border-t border-gray-100 pt-6 space-y-4 relative z-0">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                  <span className="bg-gray-100 p-1.5 rounded-lg">🎵</span>
                  Rekomendasi Hasil Matriks Model
                </h4>

                <div className="space-y-4">
                  {deployedResults.map((song, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-emerald-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group transform hover:-translate-y-1">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <h5 className="font-black text-gray-900 text-base sm:text-lg">{song.title}</h5>
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-md border shadow-sm ${
                            song.tier.includes('TIER S') ? 'bg-gradient-to-r from-amber-100 to-yellow-50 text-amber-700 border-amber-200' : 
                            song.tier.includes('TIER A') ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {song.tier}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-semibold">{song.artist} <span className="mx-1 text-gray-300">•</span> Tempo: <strong className="text-gray-800">{song.tempo}</strong></p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <div className="px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200 text-[10px] font-mono text-gray-500 font-semibold group-hover:border-gray-300 transition-colors">
                          Energy: <span className="font-black text-gray-900">{song.energyScore}</span>
                        </div>
                        <div className="px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[10px] font-mono text-emerald-700 font-semibold shadow-inner">
                          Confidence: <span className="font-black">{song.accuracy}</span>
                        </div>
                        <div className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-[10px] font-black shadow-md group-hover:bg-black transition-colors">
                          {song.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => { setDepVibe(""); setDepGenre(""); setDepEnergy(""); setDeployedResults([]); }}
                    className="text-xs font-bold text-gray-400 hover:text-rose-500 flex items-center gap-2 transition-all bg-white border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-rose-50 hover:border-rose-200 shadow-sm"
                  >
                    <RefreshCcw size={14} /> Reset Classifier Engine Hub
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CrispSimulator;