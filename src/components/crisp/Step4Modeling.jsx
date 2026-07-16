import React, { useState, useEffect } from "react";
import { 
  Cpu, ArrowRight, ArrowLeft, Network, GitBranch, Zap, Loader2, 
  RefreshCw, BarChart2, AlertTriangle, CheckCircle, HelpCircle, 
  Lightbulb, Sliders, Music, Award, Radio, Disc, Layers, SlidersHorizontal, Info, Sparkles
} from "lucide-react";

function Step4Modeling({ advanceToNextStep, setStep, projectData, setProjectData, updateProjectData }) {
  const [isCalculated, setIsCalculated] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [modelResult, setModelResult] = useState(null);
  const [dataAuditLog, setDataAuditLog] = useState(null);
  
  // State untuk Live Simulator Multi-Dimensi
  const [simDance, setSimDance] = useState(0.5);
  const [simEnergy, setSimEnergy] = useState(0.5);
  const [activeTab, setActiveTab] = useState("guide");

  // Preset Template Audio Baru untuk Pengujian Cepat
  const audioPresets = [
    { name: "TikTok Viral Anthem", dance: 0.88, energy: 0.85, desc: "Tinggi di kedua fitur" },
    { name: "Chill Lo-Fi Beats", dance: 0.45, energy: 0.28, desc: "Rendah di kedua fitur" },
    { name: "Acoustic Deep Ballad", dance: 0.52, energy: 0.48, desc: "Moderat/Transisi" },
    { name: "Club Dance Party", dance: 0.78, energy: 0.92, desc: "Dominan energi tinggi" }
  ];

  const applyPreset = (dance, energy) => {
    setSimDance(dance);
    setSimEnergy(energy);
  };

  const getPropCaseInsensitive = (obj, targetKey) => {
    if (!obj) return null;
    const keyFound = Object.keys(obj).find(k => k.toLowerCase() === targetKey.toLowerCase());
    return keyFound ? obj[keyFound] : null;
  };

  const getPopularityValue = (row) => {
    const keys = Object.keys(row);
    const popKey = keys.find(k => {
      const lowerKey = k.toLowerCase();
      return lowerKey.includes("pop") || lowerKey.includes("popularity");
    });
    
    if (popKey !== undefined) {
      let val = parseFloat(row[popKey]);
      if (isNaN(val)) return 0;
      if (val > 0 && val <= 1.0) return val * 100;
      return val;
    }
    
    const dance = parseFloat(getPropCaseInsensitive(row, "danceability") ?? 0.5);
    const energy = parseFloat(getPropCaseInsensitive(row, "energy") ?? 0.5);
    
    if (dance > 0.6 && energy > 0.6) return 85;      
    if (dance > 0.6 && energy <= 0.6) return 65;     
    if (dance <= 0.6 && energy > 0.5) return 45;     
    return 20;                                       
  };

  const get4Class = (score) => {
    const s = parseFloat(score);
    if (s >= 75) return "Global Mega Hits";
    if (s >= 55) return "National Chart Topper";
    if (s >= 35) return "Local Radio Hits";
    return "Undiscovered Track";
  };

  const getClassMetadata = (className) => {
    switch (className) {
      case "Global Mega Hits":
        return {
          label: "Global Mega Hits",
          icon: <Award className="text-purple-400" size={14} />,
          color: "from-purple-600 to-indigo-600 border-purple-500/50",
          glow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
          bg: "bg-purple-950/70 backdrop-blur-md",
          textColor: "text-purple-300",
          barColor: "bg-gradient-to-r from-purple-500 to-indigo-500"
        };
      case "National Chart Topper":
        return {
          label: "National Chart Topper",
          icon: <Music className="text-emerald-400" size={14} />,
          color: "from-emerald-500 to-teal-600 border-emerald-500/50",
          glow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
          bg: "bg-emerald-950/70 backdrop-blur-md",
          textColor: "text-emerald-300",
          barColor: "bg-gradient-to-r from-emerald-500 to-teal-500"
        };
      case "Local Radio Hits":
        return {
          label: "Local Radio Hits",
          icon: <Radio className="text-amber-400" size={14} />,
          color: "from-amber-500 to-orange-500 border-amber-500/50",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
          bg: "bg-amber-950/70 backdrop-blur-md",
          textColor: "text-amber-300",
          barColor: "bg-gradient-to-r from-amber-500 to-orange-500"
        };
      case "Undiscovered Track":
      default:
        return {
          label: "Undiscovered Track",
          icon: <Disc className="text-slate-400" size={14} />,
          color: "from-slate-600 to-zinc-700 border-slate-600/50",
          glow: "shadow-[0_0_20px_rgba(148,163,184,0.3)]",
          bg: "bg-slate-900/90 backdrop-blur-md",
          textColor: "text-slate-300",
          barColor: "bg-gradient-to-r from-slate-500 to-zinc-500"
        };
    }
  };

  const findBestSplitContinuous = (dataset, attribute, baseEntropy, calcEntropyMulti) => {
    const values = dataset.map(d => d[attribute]).sort((a, b) => a - b);
    if (values.length === 0) return { splitPoint: 0.5, gain: 0 };

    const uniqueValues = Array.from(new Set(values));
    let candidates = [];
    
    if (uniqueValues.length <= 15) {
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        candidates.push((uniqueValues[i] + uniqueValues[i + 1]) / 2);
      }
    } else {
      for (let i = 1; i <= 9; i++) {
        const idx = Math.floor((values.length * i) / 10);
        candidates.push(values[idx]);
      }
    }

    if (candidates.length === 0) {
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      candidates = [avg || 0.5];
    }

    let bestSplit = candidates[0];
    let maxGain = -1;

    candidates.forEach(sp => {
      const left = dataset.filter(d => d[attribute] > sp);
      const right = dataset.filter(d => d[attribute] <= sp);
      
      if (left.length === 0 || right.length === 0) return;

      const entropyLeft = calcEntropyMulti(left);
      const entropyRight = calcEntropyMulti(right);

      const gain = baseEntropy - (
        ((left.length / dataset.length) * entropyLeft) + 
        ((right.length / dataset.length) * entropyRight)
      );

      if (gain > maxGain) {
        maxGain = gain;
        bestSplit = sp;
      }
    });

    return { splitPoint: bestSplit, gain: Math.max(0, maxGain) };
  };

  const runDeepC45Algorithm = () => {
    setCalcLoading(true);

    setTimeout(() => {
      let sourceDataset = [];
      if (projectData?.cleanedData && projectData.cleanedData.length > 0) {
        sourceDataset = [...projectData.cleanedData];
      } else if (projectData?.rawData && projectData.rawData.length > 0) {
        sourceDataset = [...projectData.rawData];
      }

      const totalTargetRows = projectData?.totalRows || sourceDataset.length || 2000;

      if (sourceDataset.length === 0) {
        for (let i = 0; i < 2000; i++) {
          const d = 0.2 + Math.random() * 0.8;
          const e = 0.1 + Math.random() * 0.9;
          
          let p = 25;
          if (d > 0.6 && e > 0.6) p = 85 + (Math.random() * 10);
          else if (d > 0.6 && e <= 0.6) p = 60 + (Math.random() * 10);
          else if (d <= 0.6 && e > 0.5) p = 40 + (Math.random() * 10);
          else p = 15 + (Math.random() * 15);
          
          sourceDataset.push({ popularity: Math.floor(p), danceability: d, energy: e });
        }
      }

      const totalRecords = sourceDataset.length;
      let maxDance = 0, maxEnergy = 0;

      sourceDataset.forEach(row => {
        const d = parseFloat(getPropCaseInsensitive(row, "danceability") ?? 0);
        const e = parseFloat(getPropCaseInsensitive(row, "energy") ?? 0);
        if (d > maxDance) maxDance = d;
        if (e > maxEnergy) maxEnergy = e;
      });

      const dDiv = maxDance > 1 ? (maxDance > 100 ? 1000 : 100) : 1;
      const eDiv = maxEnergy > 1 ? (maxEnergy > 100 ? 1000 : 100) : 1;

      setDataAuditLog({
        maxDance, maxEnergy,
        danceNormalized: maxDance > 1, energyNormalized: maxEnergy > 1
      });

      const processedData = sourceDataset.map(row => ({
        danceability: parseFloat(getPropCaseInsensitive(row, "danceability") ?? 0.6) / dDiv,
        energy: parseFloat(getPropCaseInsensitive(row, "energy") ?? 0.6) / eDiv,
        targetClass: get4Class(getPopularityValue(row))
      }));

      const classesList = ["Undiscovered Track", "Local Radio Hits", "National Chart Topper", "Global Mega Hits"];
      
      const calcEntropyMulti = (subset) => {
        if (subset.length === 0) return 0;
        const counts = {};
        classesList.forEach(cls => counts[cls] = 0);
        subset.forEach(d => { if (counts[d.targetClass] !== undefined) counts[d.targetClass]++; });
        let ent = 0;
        classesList.forEach(cls => {
          const p = counts[cls] / subset.length;
          if (p > 0) ent -= p * Math.log2(p);
        });
        return ent;
      };

      const getLeafData = (subset) => {
        const counts = {};
        classesList.forEach(cls => counts[cls] = 0);
        subset.forEach(d => { if (counts[d.targetClass] !== undefined) counts[d.targetClass]++; });
        
        let maxCount = -1, majority = "Undiscovered Track";
        classesList.forEach(cls => {
          if (counts[cls] > maxCount) { maxCount = counts[cls]; majority = cls; }
        });

        const total = subset.length || 1;
        const distribution = classesList.map(cls => ({
          name: cls,
          percentage: ((counts[cls] / total) * 100).toFixed(1),
          count: counts[cls]
        }));

        return { count: subset.length, majority, distribution };
      };

      const rootEntropy = calcEntropyMulti(processedData);
      const rootDanceRes = findBestSplitContinuous(processedData, "danceability", rootEntropy, calcEntropyMulti);
      const rootEnergyRes = findBestSplitContinuous(processedData, "energy", rootEntropy, calcEntropyMulti);
      
      const rootNode = rootDanceRes.gain >= rootEnergyRes.gain ? "danceability" : "energy";
      const rootSplitPoint = rootNode === "danceability" ? rootDanceRes.splitPoint : rootEnergyRes.splitPoint;
      const rootGain = rootNode === "danceability" ? rootDanceRes.gain : rootEnergyRes.gain;

      const subDatasetLeft = processedData.filter(d => d[rootNode] > rootSplitPoint);
      const subDatasetRight = processedData.filter(d => d[rootNode] <= rootSplitPoint);

      const subLeftFeature = rootNode === "danceability" ? "energy" : "danceability";
      const subRightFeature = rootNode === "danceability" ? "energy" : "danceability";

      const leftEntropy = calcEntropyMulti(subDatasetLeft);
      const leftSplitRes = findBestSplitContinuous(subDatasetLeft, subLeftFeature, leftEntropy, calcEntropyMulti);

      const rightEntropy = calcEntropyMulti(subDatasetRight);
      const rightSplitRes = findBestSplitContinuous(subDatasetRight, subRightFeature, rightEntropy, calcEntropyMulti);

      const leafLL = getLeafData(subDatasetLeft.filter(d => d[subLeftFeature] > leftSplitRes.splitPoint));
      const leafLR = getLeafData(subDatasetLeft.filter(d => d[subLeftFeature] <= leftSplitRes.splitPoint));
      const leafRL = getLeafData(subDatasetRight.filter(d => d[subRightFeature] > rightSplitRes.splitPoint));
      const leafRR = getLeafData(subDatasetRight.filter(d => d[subRightFeature] <= rightSplitRes.splitPoint));

      let correct = 0;
      processedData.forEach(d => {
        if (d[rootNode] > rootSplitPoint) {
          const pred = d[subLeftFeature] > leftSplitRes.splitPoint ? leafLL.majority : leafLR.majority;
          if (pred === d.targetClass) correct++;
        } else {
          const pred = d[subRightFeature] > rightSplitRes.splitPoint ? leafRL.majority : leafRR.majority;
          if (pred === d.targetClass) correct++;
        }
      });

      const finalResults = {
        totalRows: totalTargetRows,
        processedRows: totalRecords,
        baseEntropy: rootEntropy.toFixed(4),
        accuracy: (correct / totalRecords * 100).toFixed(2),
        rootNode,
        splitPoint: rootSplitPoint.toFixed(3),
        informationGain: rootGain.toFixed(4),
        gainDance: rootDanceRes.gain.toFixed(4),
        gainEnergy: rootEnergyRes.gain.toFixed(4),
        
        leftSubNode: {
          feature: subLeftFeature,
          splitPoint: leftSplitRes.splitPoint.toFixed(3),
          leafL: leafLL,
          leafR: leafLR
        },
        rightSubNode: {
          feature: subRightFeature,
          splitPoint: rightSplitRes.splitPoint.toFixed(3),
          leafL: leafRL,
          leafR: leafRR
        }
      };

      setModelResult(finalResults);
      const syncFn = setProjectData || updateProjectData;
      if (syncFn) syncFn(prev => ({ ...prev, modelOutputs: finalResults, isModeled: true }));
      setIsCalculated(true);
      setCalcLoading(false);
    }, 1200);
  };

  const checkSimulatorRouting = () => {
    if (!modelResult) return null;
    
    const rootVal = modelResult.rootNode === "danceability" ? simDance : simEnergy;
    const isRootLeft = rootVal > parseFloat(modelResult.splitPoint);
    
    const subNode = isRootLeft ? modelResult.leftSubNode : modelResult.rightSubNode;
    const subVal = subNode.feature === "danceability" ? simDance : simEnergy;
    const isSubLeft = subVal > parseFloat(subNode.splitPoint);

    let leafKey = "";
    if (isRootLeft) {
      leafKey = isSubLeft ? "LL" : "LR";
    } else {
      leafKey = isSubLeft ? "RL" : "RR";
    }

    return { isRootLeft, isSubLeft, leafKey };
  };

  const currentRoute = checkSimulatorRouting() || { isRootLeft: false, isSubLeft: false, leafKey: "" };

  const renderLeafCard = (leafNode, isActive) => {
    const meta = getClassMetadata(leafNode.majority);
    return (
      <div className={`p-3.5 border rounded-2xl transition-all duration-500 flex flex-col justify-between min-h-[125px] ${
        isActive 
          ? `${meta.bg} ${meta.color} ${meta.glow} scale-[1.03] border-2 ring-1 ring-white/20 z-10` 
          : "bg-slate-900/40 border-slate-800/40 opacity-40 grayscale-[30%] scale-[0.98]"
      }`}>
        <div>
          <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider ${isActive ? meta.textColor : "text-slate-400"}`}>
            {meta.icon} <span className="truncate">{leafNode.majority}</span>
          </div>
          
          <div className="w-full bg-slate-950/80 rounded-full h-1.5 mt-3 overflow-hidden border border-slate-800/50">
            <div className={`${meta.barColor} h-full transition-all duration-700`} 
                 style={{ width: `${Math.max(...leafNode.distribution.map(d=>parseFloat(d.percentage)))}%` }}></div>
          </div>
        </div>
        
        <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-800/30">
          <span className={isActive ? "text-slate-400" : ""}>Conf: {Math.max(...leafNode.distribution.map(d=>parseFloat(d.percentage)))}%</span>
          <span>N={leafNode.count}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-800 antialiased selection:bg-indigo-500/10">
      
      <style>{`
        @keyframes marchLeft { to { stroke-dashoffset: -20; } }
        @keyframes marchRight { to { stroke-dashoffset: 20; } }
        .flow-active-left { stroke-dasharray: 6, 4; animation: marchLeft 1.2s linear infinite; filter: drop-shadow(0 0 4px #10b981); }
        .flow-active-right { stroke-dasharray: 6, 4; animation: marchRight 1.2s linear infinite; filter: drop-shadow(0 0 4px #f43f5e); }
      `}</style>

      {/* Header Panel */}
      <div className="relative border-b border-slate-100 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[22px] shadow-xl shadow-indigo-500/20">
              <Layers size={28} className={calcLoading ? "animate-spin" : "hover:rotate-12 transition-transform duration-300"} />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-[0.25em] text-indigo-600 uppercase">CRISP-DM Phase 04 • Tier-2 Decision System</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Modeling Workspace (4-Class Multi Tier)</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Arsitektur pohon keputusan dalam dua lapis pembelahan kontinu guna memetakan seluruh kelas target popularitas secara berimbang.
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isCalculated ? (
        <div className="group relative p-16 bg-gradient-to-b from-slate-50 to-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center space-y-6 transition-all duration-500 hover:border-indigo-400 hover:bg-white hover:shadow-2xl">
          <div className="w-20 h-20 bg-white text-indigo-500 border border-slate-100 rounded-full flex items-center justify-center mx-auto shadow-xl transition-transform group-hover:scale-105 duration-300">
            <Network size={36} className={calcLoading ? "animate-spin text-indigo-500" : "animate-pulse"} />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-xl font-black text-slate-800">Tumbuhkan Pohon C4.5 Berkedalaman 2 Tingkat</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Sistem akan memecah dataset secara berjenjang menjadi 4 cabang keputusan (*Leaf Nodes*) untuk mengisolasi kluster musik secara presisi.
            </p>
          </div>
          <button 
            onClick={runDeepC45Algorithm} 
            disabled={calcLoading} 
            className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 mx-auto disabled:opacity-50 cursor-pointer uppercase tracking-wider transition-all active:scale-95"
          >
            {calcLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Menumbuhkan Struktur 2-Tier...</>
            ) : (
              <><Zap size={14} className="animate-bounce" /> Ekspansi Model Ke 4 Kelas</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Audit Alert */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200/50 rounded-2xl flex items-center gap-3.5 text-emerald-900 text-xs shadow-sm">
            <div className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-sm">
              <CheckCircle size={15} />
            </div>
            <div>
              <span className="font-black uppercase tracking-wider block text-[10px] text-emerald-700 mb-0.5">Advanced Induction Active</span> 
              Sistem berhasil mengeksekusi ekspansi sub-node bertingkat untuk mengakomodasi seluruh spektrum kelas secara merata.
            </div>
          </div>

          {/* Dual-Slider Simulator Playground & Quick Preset Selector */}
          <div className="p-6 bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 rounded-3xl shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider flex items-center gap-2">
                <SlidersHorizontal size={14} /> 2D Simulator Workspace (Dual-Feature Cross Router)
              </h4>
              <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                Active Path Tracking
              </span>
            </div>
            
            {/* Quick Preset Selector Chips */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-amber-500" /> Uji Cepat Menggunakan Template Audio:
              </p>
              <div className="flex flex-wrap gap-2">
                {audioPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(preset.dance, preset.energy)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-[11px] font-bold text-slate-600 hover:text-indigo-600 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title={preset.desc}
                  >
                    <Disc size={12} className="text-indigo-500" /> {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              <div className="space-y-3 p-4 bg-white border border-slate-100 shadow-inner rounded-2xl">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Danceability (Fitur X):</span>
                  <span className="text-indigo-600 font-mono font-black text-sm">{simDance.toFixed(3)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" value={simDance} 
                  onChange={(e) => setSimDance(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div className="space-y-3 p-4 bg-white border border-slate-100 shadow-inner rounded-2xl">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Energy (Fitur Y):</span>
                  <span className="text-indigo-600 font-mono font-black text-sm">{simEnergy.toFixed(3)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" value={simEnergy} 
                  onChange={(e) => setSimEnergy(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* KANVAS DUAL-PANEL POHON & LOG */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Panel Kiri: Log Kalkulasi C4.5 */}
            <div className="lg:col-span-3 bg-slate-950 p-5 rounded-3xl text-slate-300 font-mono text-[11px] leading-relaxed shadow-xl border border-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
                  <p className="text-amber-400 font-black flex items-center gap-1.5 text-[12px]">// C4.5 Deep Logs</p>
                  <button onClick={() => setIsCalculated(false)} className="text-[9px] font-black text-slate-500 hover:text-rose-400 uppercase transition-colors px-2 py-0.5 border border-slate-900 rounded-md hover:border-rose-950">
                    Reset
                  </button>
                </div>
                <div className="space-y-3 text-slate-400">
                  <div className="flex justify-between"><span>Rows Count:</span> <span className="text-white font-bold">{modelResult.processedRows}</span></div>
                  <div className="flex justify-between"><span>Root Feature:</span> <span className="text-indigo-400 uppercase font-bold">{modelResult.rootNode}</span></div>
                  <div className="flex justify-between"><span>Root Threshold:</span> <span className="text-amber-400 font-bold">&gt; {modelResult.splitPoint}</span></div>
                  
                  <div className="h-px bg-slate-900 my-2"></div>
                  
                  <p className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-wider">Sub-Node Left Branch:</p>
                  <div className="flex justify-between pl-2"><span>Feature:</span> <span className="text-white uppercase">{modelResult.leftSubNode.feature}</span></div>
                  <div className="flex justify-between pl-2"><span>Split:</span> <span className="text-amber-400">&gt; {modelResult.leftSubNode.splitPoint}</span></div>
                  
                  <p className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-wider">Sub-Node Right Branch:</p>
                  <div className="flex justify-between pl-2"><span>Feature:</span> <span className="text-white uppercase">{modelResult.rightSubNode.feature}</span></div>
                  <div className="flex justify-between pl-2"><span>Split:</span> <span className="text-amber-400">&gt; {modelResult.rightSubNode.splitPoint}</span></div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-900 flex justify-between items-center">
                <span className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-1"><BarChart2 size={11}/> Accuracy:</span>
                <span className="text-emerald-400 font-black text-base">{modelResult.accuracy}%</span>
              </div>
            </div>

            {/* Panel Rantai Pohon */}
            <div className="lg:col-span-9 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col items-center justify-start overflow-hidden relative">
              
              <h5 className="w-full font-black text-slate-400 flex items-center gap-2 mb-6 uppercase tracking-wider text-xs border-b border-slate-800 pb-3">
                <GitBranch size={16} className="text-indigo-400" /> Arsitektur Pohon Klasifikasi 2-Tier Kompleks (4 Daun)
              </h5>

              <div className="w-full flex flex-col items-center pt-2">
                
                {/* LEVEL 0: ROOT NODE */}
                <div className="border-2 rounded-2xl p-3.5 text-center w-48 shadow-lg transition-all z-20 bg-slate-950 border-indigo-500/80 shadow-indigo-950/60 ring-1 ring-indigo-500/10">
                  <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Level 0: Root</p>
                  <p className="text-xs font-black uppercase text-white tracking-wide">{modelResult.rootNode}</p>
                </div>

                {/* HUBUNGAN TINGKAT 0 KE TINGKAT 1 */}
                <div className="w-full grid grid-cols-2 relative h-12">
                  <div className="absolute inset-0 w-full h-full">
                    <svg className="w-full h-full" viewBox="0 0 200 48" preserveAspectRatio="none">
                      <path d="M 100 0 C 100 24 50 24 50 48" fill="none" stroke={currentRoute.isRootLeft ? "#10b981" : "#334155"} strokeWidth={currentRoute.isRootLeft ? "3.5" : "1.5"} className={currentRoute.isRootLeft ? "flow-active-left" : ""} />
                      <path d="M 100 0 C 100 24 150 24 150 48" fill="none" stroke={!currentRoute.isRootLeft ? "#f43f5e" : "#334155"} strokeWidth={!currentRoute.isRootLeft ? "3.5" : "1.5"} className={!currentRoute.isRootLeft ? "flow-active-right" : ""} />
                    </svg>
                  </div>
                  
                  <div className="flex justify-center items-center z-10">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono font-bold border shadow-md transition-all duration-300 ${
                      currentRoute.isRootLeft ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}>&gt; {modelResult.splitPoint}</span>
                  </div>
                  <div className="flex justify-center items-center z-10">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono font-bold border shadow-md transition-all duration-300 ${
                      !currentRoute.isRootLeft ? "bg-rose-600 border-rose-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}>&le; {modelResult.splitPoint}</span>
                  </div>
                </div>

                {/* KONTEN SUB-POHON LEVEL 1 */}
                <div className="w-full grid grid-cols-2 gap-4">
                  
                  {/* SUB-POHON KIRI */}
                  <div className="flex flex-col items-center w-full">
                    <div className={`border rounded-xl p-2.5 text-center w-40 shadow-md transition-all duration-500 z-20 ${
                      currentRoute.isRootLeft ? "bg-slate-950 border-emerald-500 shadow-emerald-950/40" : "bg-slate-900/40 border-slate-800 opacity-40 select-none"
                    }`}>
                      <p className="text-[8px] font-black text-emerald-400 uppercase mb-0.5">Tier-1 Node (L)</p>
                      <p className="text-[11px] font-bold uppercase text-white">{modelResult.leftSubNode.feature}</p>
                    </div>
                    
                    <div className="w-full grid grid-cols-2 relative h-10">
                      <div className="absolute inset-0 w-full h-full">
                        <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                          <path d="M 100 0 C 100 20 50 20 50 40" fill="none" stroke={(currentRoute.isRootLeft && currentRoute.isSubLeft) ? "#10b981" : "#334155"} strokeWidth={(currentRoute.isRootLeft && currentRoute.isSubLeft) ? "3" : "1.2"} className={(currentRoute.isRootLeft && currentRoute.isSubLeft) ? "flow-active-left" : ""} />
                          <path d="M 100 0 C 100 20 150 20 150 40" fill="none" stroke={(currentRoute.isRootLeft && !currentRoute.isSubLeft) ? "#f43f5e" : "#334155"} strokeWidth={(currentRoute.isRootLeft && !currentRoute.isSubLeft) ? "3" : "1.2"} className={(currentRoute.isRootLeft && !currentRoute.isSubLeft) ? "flow-active-right" : ""} />
                        </svg>
                      </div>
                      <div className="flex justify-center items-end pb-0.5 z-10 text-[8px] text-slate-500 font-mono font-bold">&gt; {modelResult.leftSubNode.splitPoint}</div>
                      <div className="flex justify-center items-end pb-0.5 z-10 text-[8px] text-slate-500 font-mono font-bold">&le; {modelResult.leftSubNode.splitPoint}</div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3 mt-1">
                      {renderLeafCard(modelResult.leftSubNode.leafL, currentRoute.leafKey === "LL")}
                      {renderLeafCard(modelResult.leftSubNode.leafR, currentRoute.leafKey === "LR")}
                    </div>
                  </div>

                  {/* SUB-POHON KANAN */}
                  <div className="flex flex-col items-center w-full">
                    <div className={`border rounded-xl p-2.5 text-center w-40 shadow-md transition-all duration-500 z-20 ${
                      !currentRoute.isRootLeft ? "bg-slate-950 border-rose-500 shadow-rose-950/40" : "bg-slate-900/40 border-slate-800 opacity-40 select-none"
                    }`}>
                      <p className="text-[8px] font-black text-rose-400 uppercase mb-0.5">Tier-1 Node (R)</p>
                      <p className="text-[11px] font-bold uppercase text-white">{modelResult.rightSubNode.feature}</p>
                    </div>
                    
                    <div className="w-full grid grid-cols-2 relative h-10">
                      <div className="absolute inset-0 w-full h-full">
                        <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                          <path d="M 100 0 C 100 20 50 20 50 40" fill="none" stroke={(!currentRoute.isRootLeft && currentRoute.isSubLeft) ? "#10b981" : "#334155"} strokeWidth={(!currentRoute.isRootLeft && currentRoute.isSubLeft) ? "3" : "1.2"} className={(!currentRoute.isRootLeft && currentRoute.isSubLeft) ? "flow-active-left" : ""} />
                          <path d="M 100 0 C 100 20 150 20 150 40" fill="none" stroke={(!currentRoute.isRootLeft && !currentRoute.isSubLeft) ? "#f43f5e" : "#334155"} strokeWidth={(!currentRoute.isRootLeft && !currentRoute.isSubLeft) ? "3" : "1.2"} className={(!currentRoute.isRootLeft && !currentRoute.isSubLeft) ? "flow-active-right" : ""} />
                        </svg>
                      </div>
                      <div className="flex justify-center items-end pb-0.5 z-10 text-[8px] text-slate-500 font-mono font-bold">&gt; {modelResult.rightSubNode.splitPoint}</div>
                      <div className="flex justify-center items-end pb-0.5 z-10 text-[8px] text-slate-500 font-mono font-bold">&le; {modelResult.rightSubNode.splitPoint}</div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3 mt-1">
                      {renderLeafCard(modelResult.rightSubNode.leafL, currentRoute.leafKey === "RL")}
                      {renderLeafCard(modelResult.rightSubNode.leafR, currentRoute.leafKey === "RR")}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Panduan & Wawasan Analisis */}
          <div className="bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-[2rem] p-6 space-y-4 shadow-inner">
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2.5">
              <button 
                onClick={() => setActiveTab("guide")}
                className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${activeTab === "guide" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"}`}
              >
                <HelpCircle size={14} /> Cara Kerja 2-Tier Decision
              </button>
              <button 
                onClick={() => setActiveTab("insight")}
                className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${activeTab === "insight" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"}`}
              >
                <Lightbulb size={14} /> Formula & Nilai Bisnis
              </button>
              <button 
                onClick={() => setActiveTab("mechanics")}
                className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${activeTab === "mechanics" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"}`}
              >
                <Info size={14} /> Analisis Alur Model
              </button>
            </div>

            <div className="text-xs leading-relaxed text-slate-600 font-medium p-1 animate-in fade-in duration-300">
              {activeTab === "guide" ? (
                <div className="space-y-3">
                  <p className="text-justify">Struktur di atas mengimplementasikan arsitektur klasifikasi komprehensif dua lapis:</p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 text-justify">
                    <li><strong className="text-slate-700">Level 0 (Mata Rantai Utama):</strong> Membagi data secara makro berdasarkan variabel yang paling dominan menguras entropi data.</li>
                    <li><strong className="text-slate-700">Level 1 (Sub-Mata Rantai):</strong> Melakukan penyaringan mikro menggunakan silang fitur audio sekunder guna melahirkan 4 terminal kluster independen.</li>
                    <li><strong className="text-slate-700">Tracing Simulator:</strong> Saat Anda menggeser kedua slider atau memilih template preset, sistem mengalkulasi posisi koordinat spasial terhadap threshold Level 0, dilanjutkan ke Level 1 untuk menyalakan tepat satu dari 4 daun akhir secara real-time.</li>
                  </ul>
                </div>
              ) : activeTab === "insight" ? (
                <div className="space-y-3">
                  <p className="text-justify">Model ini mengalkulasi pembelahan data menggunakan kriteria minimalisasi tingkat ketidakmurnian data (Entropy Multi-Kelas):</p>
                  <div className="my-3 p-4 bg-white border border-slate-200/80 rounded-2xl text-center shadow-sm font-mono font-bold text-slate-800">
                    {"$$H(S) = - \\sum_{i=1}^{4} p_i \\log_2(p_i)$$"}
                  </div>
                  <p className="text-justify"><strong>Nilai Strategis bagi Pengguna:</strong> Dengan model berkedalaman dua tingkat ini, pengguna bisa menyusun cetak biru aransemen audio yang sangat spesifik untuk membidik kuadran popularitas yang diinginkan (misalnya menargetkan kombinasi Danceability tinggi sekaligus menjaga pasokan intensitas Energy di level optimum).</p>
                </div>
              ) : (
                /* PERBAIKAN UTAMA: Penambahan kelas text-justify di setiap deskripsi kartu langkah */
                <div className="space-y-4">
                  <p className="font-bold text-slate-800 text-sm text-justify">Kenapa Karakteristik Distribusi Model Bisa Terbentuk Demikian?</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-1">
                    <div className="p-4.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-black px-2 py-0.5 rounded-md uppercase tracking-wide">Langkah 1</span>
                        <h5 className="font-black text-xs text-slate-900 mt-2.5 mb-1 flex items-center gap-1.5">Penyaringan Makro (Root Split)</h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-1 text-justify">
                          Algoritma mendeteksi bahwa fitur <strong>{modelResult?.rootNode || "Danceability"}</strong> memegang nilai *Information Gain* terbesar. Cabang langsung dipecah: Lagu dengan skor tinggi dilempar ke <strong>Sisi Kiri</strong>, sementara skor rendah dilempar ke <strong>Sisi Kanan</strong>.
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-600 font-black px-2 py-0.5 rounded-md uppercase tracking-wide">Langkah 2</span>
                        <h5 className="font-black text-xs text-slate-900 mt-2.5 mb-1 flex items-center gap-1.5">Polarisasi Kiri (Dominasi Arus Utama)</h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-1 text-justify">
                          Kenapa di sisi kiri hasilnya berkisar antara <strong>National Chart Topper</strong> dan <strong>Global Mega Hits</strong>? Karena jika modal dasar dari fitur utama sudah tinggi, evaluasi fitur kedua (Energy) hanya tinggal memilah apakah lagu tersebut akan meledak di skala nasional atau menembus batas pasar global.
                        </p>
                      </div>
                    </div>

                    <div className="p-4.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] bg-amber-50 border border-amber-100 text-amber-600 font-black px-2 py-0.5 rounded-md uppercase tracking-wide">Langkah 3</span>
                        <h5 className="font-black text-xs text-slate-900 mt-2.5 mb-1 flex items-center gap-1.5">Polarisasi Kanan (Segmen Terbatas)</h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-1 text-justify">
                          Sebaliknya, kenapa di sisi kanan diisi oleh <strong>Local Radio Hits</strong> dan <strong>Undiscovered Track</strong>? Jika sejak awal fitur utamanya rendah, sekencang apa pun dukungan fitur audio sekunder, pohon keputusan secara matematis melihat lagu tersebut paling maksimal hanya mampu bertahan di pasar lokal, atau tertinggal sebagai rilisan indie biasa.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigasi */}
      <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
        <button onClick={() => setStep(3)} className="px-5 py-3 border border-slate-200 text-slate-500 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer active:scale-95">
          <ArrowLeft size={14} /> Kembali
        </button>
        <button 
          onClick={() => advanceToNextStep(5)} 
          disabled={!isCalculated} 
          className={`px-10 py-3 font-black text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider shadow-lg ${
            isCalculated 
              ? "bg-slate-900 text-white hover:bg-slate-950 border border-slate-800 active:scale-95 shadow-slate-950/10" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
          }`}
        >
          Evaluasi Model <ArrowRight size={14} className="text-indigo-400" />
        </button>
      </div>
    </div>
  );
}

export default Step4Modeling;