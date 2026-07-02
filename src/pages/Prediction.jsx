import { useState, useEffect } from "react";

function Prediction() {
  // Inisialisasi state dari localStorage
  const [form, setForm] = useState(() => {
    const savedForm = localStorage.getItem("sle_form_data");
    return savedForm ? JSON.parse(savedForm) : {
      danceability: "",
      energy: "",
      valence: "",
      tempo: "",
      acousticness: "",
      loudness: "",
    };
  });

  const [result, setResult] = useState(() => {
    return localStorage.getItem("sle_predict_result") || null;
  });
  
  const [confidence, setConfidence] = useState(() => {
    return Number(localStorage.getItem("sle_predict_confidence")) || 0;
  });

  const [primaryDriver, setPrimaryDriver] = useState(() => {
    return localStorage.getItem("sle_predict_driver") || "";
  });

  const [analysis, setAnalysis] = useState(() => {
    const savedAnalysis = localStorage.getItem("sle_predict_analysis");
    return savedAnalysis ? JSON.parse(savedAnalysis) : [];
  });

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(false);
  
  // State baru untuk melacak kelas mana yang sedang diklik/aktif untuk melihat contoh lagu & metrik detail
  const [selectedClassTab, setSelectedClassTab] = useState(null);

  // Sinkronisasi data ke localStorage
  useEffect(() => {
    localStorage.setItem("sle_form_data", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (result) localStorage.setItem("sle_predict_result", result);
    else localStorage.removeItem("sle_predict_result");
  }, [result]);

  useEffect(() => {
    localStorage.setItem("sle_predict_confidence", confidence);
  }, [confidence]);

  useEffect(() => {
    localStorage.setItem("sle_predict_driver", primaryDriver);
  }, [primaryDriver]);

  useEffect(() => {
    localStorage.setItem("sle_predict_analysis", JSON.stringify(analysis));
  }, [analysis]);

  // Master Data Kelas Komplit dengan Benchmark Lagu & Blueprint Angka Spesifik masing-masing kelas
  const CLASS_LEVELS = [
    { 
      id: "low", 
      name: "Undiscovered Track", 
      range: "0 - 39", 
      desc: "Lagu indie/niche dengan target pendengar segmented.", 
      color: "border-l-slate-400 bg-slate-50 text-slate-700 hover:shadow-slate-200",
      tracks: [
        { title: "Ocean Eyes", artist: "Billie Eilish (2016)", vibe: "Minimalist Pop" },
        { title: "Skinny Love", artist: "Bon Iver (2007)", vibe: "Indie Folk" },
        { title: "Mystery of Love", artist: "Sufjan Stevens (2017)", vibe: "Acoustic Indie" },
        { title: "No Surprises", artist: "Radiohead (1997)", vibe: "Alternative Melancholy" },
        { title: "Re Stacks", artist: "Bon Iver (2008)", vibe: "Raw Acoustic" }
      ],
      blueprint: {
        rhythmic: { dance: "0.20 - 0.45", tempo: "65 - 95 BPM" },
        dynamics: { energy: "0.10 - 0.35", loudness: "-15 s/d -10 dB" },
        soundscape: { valence: "≤ 0.35 (Sangat Galau/Melankolis)", acoustic: "≥ 0.75 (Dominan Alat Musik Alami)" }
      }
    },
    { 
      id: "medium", 
      name: "Local Radio Hits", 
      range: "40 - 59", 
      desc: "Hits biasa yang populer di radio & playlist lokal.", 
      color: "border-l-amber-400 bg-amber-50/40 text-amber-800 hover:shadow-amber-100",
      tracks: [
        { title: "Hati-Hati di Jalan", artist: "Tulus (2022)", vibe: "Mid-Tempo Pop" },
        { title: "Sial", artist: "Mahalini (2023)", vibe: "Pop Ballad" },
        { title: "Fix You", artist: "Coldplay (2005)", vibe: "Alternative Rock Anthem" },
        { title: "Monokrom", artist: "Tulus (2016)", vibe: "Acoustic Pop Jazz" },
        { title: "Runtuh", artist: "Feby Putri ft. Fiersa Besari (2021)", vibe: "Folk Pop" }
      ],
      blueprint: {
        rhythmic: { dance: "0.45 - 0.60", tempo: "95 - 115 BPM" },
        dynamics: { energy: "0.40 - 0.60", loudness: "-9 s/d -7 dB" },
        soundscape: { valence: "0.40 - 0.55 (Netral/Kontemplatif)", acoustic: "0.35 - 0.65 (Hybrid Elektrik-Akustik)" }
      }
    },
    { 
      id: "high", 
      name: "National Chart Topper", 
      range: "60 - 79", 
      desc: "Hits besar mendominasi chart musik nasional.", 
      color: "border-l-emerald-500 bg-emerald-50/40 text-emerald-800 hover:shadow-emerald-100",
      tracks: [
        { title: "As It Was", artist: "Harry Styles (2022)", vibe: "Synth-Pop Energetic" },
        { title: "Blinding Lights", artist: "The Weeknd (2019)", vibe: "80s Retro Wave" },
        { title: "Flowers", artist: "Miley Cyrus (2023)", vibe: "Nu-Disco / Funk Pop" },
        { title: "Perfect", artist: "Ed Sheeran (2017)", vibe: "Romantic Pop Ballad" },
        { title: "Cruel Summer", artist: "Taylor Swift (2019)", vibe: "Electropop High Energy" }
      ],
      blueprint: {
        rhythmic: { dance: "0.65 - 0.80", tempo: "110 - 135 BPM" },
        dynamics: { energy: "0.60 - 0.85", loudness: "-7 s/d -4 dB" },
        soundscape: { valence: "≥ 0.60 (Ceria/Penuh Semangat)", acoustic: "≤ 0.20 (Efek Elektrik Modern)" }
      }
    },
    { 
      id: "very_high", 
      name: "Global Mega Hits", 
      range: "80 - 100", 
      desc: "Lagu mega viral global pemegang rekor streaming.", 
      color: "border-l-purple-600 bg-purple-50 text-purple-800 hover:shadow-purple-100",
      tracks: [
        { title: "Shape of You", artist: "Ed Sheeran (2017)", vibe: "Dance-Pop Dancehall" },
        { title: "Stay", artist: "The Kid LAROI & Justin Bieber (2021)", vibe: "Pop Rock Radio Beast" },
        { title: "Dynamite", artist: "BTS (2020)", vibe: "Disco-Pop High Tempo" },
        { title: "Starboy", artist: "The Weeknd ft. Daft Punk (2016)", vibe: "R&B / Electro Heavy Beat" },
        { title: "Levitating", artist: "Dua Lipa (2020)", vibe: "Pure Space Disco Funk" }
      ],
      blueprint: {
        rhythmic: { dance: "≥ 0.80 (Super High Groove)", tempo: "120 - 145 BPM" },
        dynamics: { energy: "≥ 0.85 (Maximum Sound Density)", loudness: "-4 s/d -2 dB (Ultra Loud)" },
        soundscape: { valence: "≥ 0.75 (High Dopamine Vibe)", acoustic: "≤ 0.10 (Full Digital Electronic)" }
      }
    },
  ];

  const handleChange = (e) => {
    setValidationError(false);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleClearAll = () => {
    setForm({
      danceability: "",
      energy: "",
      valence: "",
      tempo: "",
      acousticness: "",
      loudness: "",
    });
    setResult(null);
    setConfidence(0);
    setPrimaryDriver("");
    setAnalysis([]);
    setValidationError(false);
    setSelectedClassTab(null);
    localStorage.removeItem("sle_form_data");
    localStorage.removeItem("sle_predict_result");
    localStorage.removeItem("sle_predict_confidence");
    localStorage.removeItem("sle_predict_driver");
    localStorage.removeItem("sle_predict_analysis");
  };

  const handlePredict = () => {
    const hasEmptyField = Object.values(form).some(value => value.trim() === "");
    
    if (hasEmptyField) {
      setValidationError(true);
      setResult(null);
      return;
    }

    setValidationError(false);
    setLoading(true);

    setTimeout(() => {
      const wDance = Number(form.danceability) * 20;
      const wEnergy = Number(form.energy) * 20;
      const wValence = Number(form.valence) * 15;
      const wAcoustic = Number(form.acousticness) * 10;
      const wTempo = (Number(form.tempo) / 200) * 20;
      const wLoudness = ((60 + Number(form.loudness)) / 60) * 15;

      const score = wDance + wEnergy + wValence + wAcoustic + wTempo + wLoudness;

      let currentResult = "";
      let currentConfidence = 0;

      if (score >= 80) {
        currentResult = "Global Mega Hits";
        currentConfidence = 96;
      } else if (score >= 60) {
        currentResult = "National Chart Topper";
        currentConfidence = 87;
      } else if (score >= 40) {
        currentResult = "Local Radio Hits";
        currentConfidence = 75;
      } else {
        currentResult = "Undiscovered Track";
        currentConfidence = 64;
      }

      setResult(currentResult);
      setConfidence(currentConfidence);

      // Auto-focus tab dropdown referensi sesuai hasil prediksi biar keren!
      const foundTab = CLASS_LEVELS.find(lvl => lvl.name === currentResult);
      if (foundTab) setSelectedClassTab(foundTab.id);

      const drivers = [
        { name: "Danceability (Kekuatan Ketukan Ritme)", value: wDance },
        { name: "Energy (Kepadatan Instrumen & Power)", value: wEnergy },
        { name: "Valence (Tingkat Kecerian Nada)", value: wValence },
        { name: "Tempo (Kecepatan Ketukan BPM)", value: wTempo },
      ];
      const maxDriver = drivers.reduce((prev, current) => (prev.value > current.value) ? prev : current);
      setPrimaryDriver(maxDriver.name);

      const insights = [];
      if (Number(form.danceability) >= 0.7) insights.push("🕺 High Danceability: Ketukan (beat strength) sangat stabil, terbukti secara statistik mempercepat akselerasi sebuah lagu menjadi viral.");
      else if (Number(form.danceability) <= 0.4 && form.danceability !== "") insights.push("🪑 Low Danceability: Komposisi menggunakan ritme santai/abstrak, tidak ditujukan untuk pasar musik lantai dansa.");

      if (Number(form.energy) >= 0.7) insights.push("⚡ High Energy: Aransemen instrumen padat dan nyaring, secara psikologis memicu antusiasme tinggi pendengar.");
      else if (Number(form.energy) <= 0.4 && form.energy !== "") insights.push("🌙 Low Energy: Karakter suara sayup dan tenang, ideal diputar untuk menemani aktivitas santai atau istirahat.");

      if (Number(form.valence) >= 0.6) insights.push("☀️ Positive Valence: Melodi memancarkan aura kegembiraan yang optimis (karakteristik utama Major Key).");
      else if (Number(form.valence) <= 0.4 && form.valence !== "") insights.push("🌧️ Negative Valence: Pembawaan nada cenderung melankolis, emosional, atau menyentuh hati (karakteristik Minor Key).");

      setAnalysis(insights);
      setLoading(false);
    }, 1200);
  };

  const getActiveStyle = (className) => {
    if (result === className) return "ring-4 ring-offset-2 ring-emerald-500 scale-[1.02] shadow-lg border-emerald-500 opacity-100 z-10";
    return "opacity-50 scale-95";
  };

  // Mencari data objek kelas yang sedang aktif diklik oleh user
  const activeTabDetails = CLASS_LEVELS.find(lvl => lvl.id === selectedClassTab);

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-8 px-4 sm:px-0">
      
      {/* TITLE BANNER WITH GLOW ORB BACKGROUND */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group border border-emerald-900/40">
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
        <div className="absolute bottom-[-30px] left-[20%] w-36 h-36 bg-emerald-600/5 rounded-full blur-2xl"></div>
        
        <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-sm shadow-sm inline-block animate-pulse">
          C4.5 Decision Tree Classifier
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight mt-3 bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-200">
          Predictive Music Engine
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed font-medium">
          Sistem analitik berbasis pohon keputusan untuk menguji kelayakan instrumen audio terhadap target pasar industri streaming Spotify.
        </p>
      </div>

      {/* SEKSI 1: TRANSPARANSI TARGET KELAS (INTERACTIVE CLICKABLE MATRIX) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border-b-4 border-b-slate-100/80">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1 gap-2">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            📋 Target Matrix Classification Reference
          </h3>
          <span className="text-[11px] bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full border border-emerald-100 animate-pulse hidden sm:inline-block">
            💡 Klik kartu untuk info dataset lagu & metrik
          </span>
        </div>
        <p className="text-slate-400 text-xs mb-5">Daftar ambang batas parameter pembagian kelas target popularitas hasil kalkulasi pohon keputusan</p>
        
        {/* GRID KARTU KELAS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLASS_LEVELS.map((level) => (
            <div 
              key={level.id} 
              onClick={() => setSelectedClassTab(selectedClassTab === level.id ? null : level.id)}
              className={`border-l-4 rounded-2xl p-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:scale-95 select-none relative overflow-hidden group ${level.color} ${result ? getActiveStyle(level.name) : ""} ${selectedClassTab === level.id ? "ring-2 ring-slate-800 shadow-md bg-white -translate-y-1" : ""}`}
            >
              <div className="flex justify-between items-start">
                <span className="font-extrabold text-sm tracking-tight group-hover:text-emerald-700 transition-colors">{level.name}</span>
                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-md shadow-sm border border-black/5 tracking-wider">Score: {level.range}</span>
              </div>
              <p className="text-[11px] opacity-80 mt-2.5 leading-relaxed font-medium">{level.desc}</p>
              
              <div className="mt-4 flex items-center justify-between text-[10px] font-bold opacity-60 group-hover:opacity-100 text-slate-500 transition-all">
                <span>{selectedClassTab === level.id ? "📂 Tutup Detail" : "📂 Lihat Blueprint"}</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* DYNAMIC DROPDOWN PANEL (BENCHMARK DATASET & AUDIO BLUEPRINT PROFILE) */}
        {activeTabDetails && (
          <div className="mt-6 p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 animate-[fadeIn_0.4s_ease-out] grid md:grid-cols-12 gap-6 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
            
            {/* SUB-KOLOM 1: TOP 5 TRACK BENCHMARKS */}
            <div className="md:col-span-5 space-y-4 border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
              <div>
                <h4 className="text-sm font-black tracking-wider text-emerald-400 uppercase flex items-center gap-2">
                  🎧 Top 5 Benchmark Tracks
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Sampel rekam data trek populer dunia di kelas {activeTabDetails.name}</p>
              </div>
              <div className="space-y-2">
                {activeTabDetails.tracks.map((track, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60 hover:border-emerald-500/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-500 bg-slate-950 w-6 h-6 rounded-md flex items-center justify-center group-hover:text-emerald-400 transition-colors">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white tracking-wide">{track.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{track.artist}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold bg-slate-950 px-2 py-0.5 rounded text-emerald-400 tracking-wider">
                      {track.vibe}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SUB-KOLOM 2: BLUEPRINT ANGKA SPESIFIK */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h4 className="text-sm font-black tracking-wider text-teal-400 uppercase flex items-center gap-2">
                  📊 Technical Audio Blueprint Metrics
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Ambang ideal variabel audio pembentuk nilai entropi pada kelas ini</p>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-3">
                {/* 1. Rhythmic & Groove */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/40 space-y-2.5">
                  <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest block border-b border-slate-800 pb-1.5">
                    1. Rhythmic & Groove
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Danceability</p>
                    <p className="text-xs font-black text-white mt-0.5">{activeTabDetails.blueprint.rhythmic.dance}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Tempo (BPM)</p>
                    <p className="text-xs font-black text-white mt-0.5">{activeTabDetails.blueprint.rhythmic.tempo}</p>
                  </div>
                </div>

                {/* 2. Dynamics & Sonorics */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/40 space-y-2.5">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block border-b border-slate-800 pb-1.5">
                    2. Dynamics Power
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Energy</p>
                    <p className="text-xs font-black text-white mt-0.5">{activeTabDetails.blueprint.dynamics.energy}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Loudness</p>
                    <p className="text-xs font-black text-white mt-0.5">{activeTabDetails.blueprint.dynamics.loudness}</p>
                  </div>
                </div>

                {/* 3. Soundscape & Vibe */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/40 space-y-2.5 sm:col-span-1">
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block border-b border-slate-800 pb-1.5">
                    3. Soundscape Tone
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Valence (Positivity)</p>
                    <p className="text-xs font-black text-white mt-0.5 leading-tight">{activeTabDetails.blueprint.soundscape.valence}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Acousticness</p>
                    <p className="text-xs font-black text-white mt-0.5 leading-tight">{activeTabDetails.blueprint.soundscape.acoustic}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* KOLOM KIRI: FORM CONFIGURATION */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] transition-all duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block animate-bounce"></span>
                Audio Feature Parameters Input
              </h2>
              {/* CTA BUTTON CLEAR DATA */}
              {(result || validationError || Object.values(form).some(x => x !== "")) && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 border border-rose-100/60 shadow-sm active:scale-95"
                >
                  🗑️ Bersihkan Data
                </button>
              )}
            </div>

            <div className="space-y-4">
              
              {/* 1. RHYTHMIC & GROOVE METRIC */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100/80 group hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 transform">
                <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600 uppercase tracking-wider block mb-4 transition-colors">
                  1. Rhythmic & Groove Metric
                </span>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Danceability</label>
                    <input type="number" step="0.01" name="danceability" value={form.danceability} onChange={handleChange} placeholder="0.00" className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl p-2.5 outline-none transition-all text-sm bg-white font-medium" />
                    <span className="text-[11px] text-slate-400 mt-1.5 block">Rata-rata hits: <b className="text-emerald-600 font-bold">0.65 - 0.80</b></span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Tempo (BPM)</label>
                    <input type="number" name="tempo" value={form.tempo} onChange={handleChange} placeholder="120" className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl p-2.5 outline-none transition-all text-sm bg-white font-medium" />
                    <span className="text-[11px] text-slate-400 mt-1.5 block">Rata-rata hits: <b className="text-emerald-600 font-bold">110 - 135 BPM</b></span>
                  </div>
                </div>
              </div>

              {/* 2. DYNAMICS & SONORICS POWER */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100/80 group hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 transform">
                <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600 uppercase tracking-wider block mb-4 transition-colors">
                  2. Dynamics & Sonorics Power
                </span>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Energy</label>
                    <input type="number" step="0.01" name="energy" value={form.energy} onChange={handleChange} placeholder="0.00" className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl p-2.5 outline-none transition-all text-sm bg-white font-medium" />
                    <span className="text-[11px] text-slate-400 mt-1.5 block">Rata-rata hits: <b className="text-emerald-600 font-bold">0.60 - 0.85</b></span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Loudness (dB)</label>
                    <input type="number" name="loudness" value={form.loudness} onChange={handleChange} placeholder="-6" className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl p-2.5 outline-none transition-all text-sm bg-white font-medium" />
                    <span className="text-[11px] text-slate-400 mt-1.5 block">Rata-rata hits: <b className="text-emerald-600 font-bold">-7 s/d -4 dB</b></span>
                  </div>
                </div>
              </div>

              {/* 3. SOUNDSCAPE & VIBE TONE */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100/80 group hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 transform">
                <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600 uppercase tracking-wider block mb-4 transition-colors">
                  3. Soundscape & Vibe Tone
                </span>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Valence (Positivity)</label>
                    <input type="number" step="0.01" name="valence" value={form.valence} onChange={handleChange} placeholder="0.00" className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl p-2.5 outline-none transition-all text-sm bg-white font-medium" />
                    <span className="text-[11px] text-slate-400 mt-1.5 block leading-relaxed">
                      Tinggi (<span className="text-emerald-600 font-bold">≥0.60</span>) = Ceria/Semangat <br />
                      Rendah (<span className="text-amber-600 font-bold">≤0.40</span>) = Galau/Sedih
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Acousticness</label>
                    <input type="number" step="0.01" name="acousticness" value={form.acousticness} onChange={handleChange} placeholder="0.00" className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl p-2.5 outline-none transition-all text-sm bg-white font-medium" />
                    <span className="text-[11px] text-slate-400 mt-1.5 block leading-relaxed">
                      Rendah (<span className="text-purple-600 font-bold">≤0.20</span>) = Efek Elektrik Modern <br />
                      Tinggi = Dominan Alat Musik Alami
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-bold hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] disabled:opacity-50 flex items-center justify-center tracking-wide text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Information Gain...
                </span>
              ) : "Execute C4.5 Classification Tree"}
            </button>
          </div>
        </div>

        {/* KOLOM KANAN: LIVE DIAGNOSTIC OUTPUT */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] min-h-[515px] flex flex-col justify-between border-b-4 border-b-slate-100/80">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                🎯 Live Diagnostic Monitor
              </h2>
              <hr className="border-slate-100 mb-6" />

              {/* LOADING STATE */}
              {loading ? (
                <div className="text-center py-28 space-y-4">
                  <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto shadow-sm"></div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-emerald-700 tracking-widest animate-pulse uppercase">
                      Calculating Class Metrics...
                    </p>
                    <p className="text-[10px] text-slate-400 max-w-[210px] mx-auto leading-relaxed">
                      Traversing tree nodes & analyzing entropy threshold values
                    </p>
                  </div>
                </div>

              ) : validationError ? (
                <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-6 text-center space-y-4 shadow-sm animate-[pulse_1.5s_infinite] transition-all">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 text-xl font-bold shadow-inner border border-rose-200 animate-bounce">
                    ✕
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-rose-800 font-extrabold text-sm uppercase tracking-wider">Data Integrity Warning!</h4>
                    <p className="text-rose-700 text-xs font-medium leading-relaxed">
                      Node Decision Tree C4.5 mendeteksi adanya parameter kosong. Harap isi seluruh metrik audio di kolom kiri sebelum melakukan kalkulasi nilai entropi.
                    </p>
                  </div>
                </div>

              ) : result ? (
                <div className="space-y-5 animate-[fadeIn_0.5s_ease-out]">
                  {/* Papan Hasil Utama */}
                  <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 p-6 rounded-2xl text-center text-white shadow-xl border border-emerald-900/40 transform transition hover:scale-[1.01]">
                    <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">Class Assigned</span>
                    <h3 className="text-2xl font-black mt-3 tracking-tight bg-clip-text bg-gradient-to-r from-white to-slate-200">{result}</h3>
                  </div>

                  {/* Pengukur Kepastian Persentase */}
                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Model Confidence Level</span>
                      <span className="text-emerald-600 font-black">{confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300/30 shadow-inner">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${confidence}%` }}></div>
                    </div>
                  </div>

                  {/* Aspek Pendorong Terkuat */}
                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 shadow-sm transform transition hover:bg-emerald-50">
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">🔥 Atribut Pendorong Terkuat Utama:</p>
                    <p className="text-emerald-800 font-extrabold text-xs mt-1">{primaryDriver}</p>
                  </div>

                  {/* Evaluasi Detak Fisik Audio */}
                  {analysis.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Aspek Penilaian Komponen Fisis:</span>
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {analysis.map((note, index) => (
                          <div key={index} className="bg-slate-50 border border-slate-150 text-slate-600 rounded-xl p-3 text-xs leading-relaxed font-semibold transition hover:bg-white hover:border-emerald-200">
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              ) : (
                <div className="text-center py-32 text-slate-400 space-y-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                  <div className="text-4xl filter grayscale opacity-70 animate-pulse">📊</div>
                  <p className="text-xs font-bold max-w-[220px] mx-auto leading-relaxed text-slate-400/90">
                    Masukkan parameter di kolom kiri dan jalankan kalkulasi klasifikasi untuk melihat detail hasil prediksi.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[9px] text-center text-slate-400 mt-6 border-t border-slate-100 pt-3 font-bold tracking-widest uppercase">
              Politeknik LP3I Jakarta Kampus Depok • Spotify Insights 
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Prediction;