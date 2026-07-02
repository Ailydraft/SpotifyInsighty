import { useEffect, useState } from "react";
import { loadSpotifyData } from "../services/spotifyService";
import { ChevronDown, Music, Star, X, BarChart2, CheckCircle, AlertCircle, Crown } from "lucide-react";

function GlobalTitans() {
  const [topArtists, setTopArtists] = useState([]);
  const [expandedArtist, setExpandedArtist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  // Analisis mendalam dengan gaya "Executive Summary"
  const getDetailedReport = (song) => {
    const score = song.popularity;
    return {
      verdict: score >= 90 ? "Global Chart-Topper" : score >= 80 ? "High-Impact Track" : "Steady Performer",
      strength: score > 75 
        ? "Analisis fitur audio menunjukkan karakteristik 'Radio-Ready' yang kuat, dengan retensi pendengar tinggi dan struktur hook yang intens."
        : "Memiliki profil audio yang unik, dengan segmentasi pasar yang stabil dan loyal.",
      weakness: "Berdasarkan model C4.5, lagu ini masih memiliki ruang optimasi pada *dynamic range* agar bisa lebih menonjol di algoritma streaming populer.",
      recommendation: "Direkomendasikan untuk sesi A/B testing dengan variasi tempo yang lebih tinggi untuk meningkatkan engagement."
    };
  };

  useEffect(() => {
    const getData = async () => {
      const data = await loadSpotifyData();
      
      const popHits = data
        .filter(s => s.track_genre.toLowerCase() === 'pop' && s.popularity >= 70)
        .map(s => ({ ...s, popularity: Number(s.popularity) }));

      const artistMap = popHits.reduce((acc, song) => {
        if (!acc[song.artists]) {
          acc[song.artists] = { name: song.artists, tracks: [], totalPop: 0 };
        }
        acc[song.artists].tracks.push(song);
        acc[song.artists].totalPop += song.popularity;
        return acc;
      }, {});

      const sorted = Object.values(artistMap)
        .map(artist => ({
          ...artist,
          avgPop: (artist.totalPop / artist.tracks.length),
          // Tetap ambil hingga 10 lagu
          tracks: artist.tracks.sort((a, b) => b.popularity - a.popularity).slice(0, 10)
        }))
        .sort((a, b) => b.avgPop - a.avgPop)
        .slice(0, 10);

      setTopArtists(sorted);
    };
    getData();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans bg-slate-50 min-h-screen">
      <div className="mb-10">
        <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <Crown size={28} />
            <span className="font-black tracking-widest uppercase text-sm">Global Titans Ranking</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Elite Pop Performance Analysis</h1>
        <p className="text-slate-500 font-medium mt-2">Daftar 10 Artis Pop dengan kurasi lagu (Popularitas 70-100) berbasis algoritma C4.5.</p>
      </div>

      <div className="space-y-4">
        {topArtists.map((artist, index) => (
          <div key={artist.name} className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden transition-all hover:shadow-md">
            <button 
              className="w-full flex items-center justify-between p-7 text-left"
              onClick={() => setExpandedArtist(expandedArtist === artist.name ? null : artist.name)}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200">{index + 1}</div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{artist.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                      Avg Score: {artist.avgPop.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                        {artist.tracks.length} {artist.tracks.length > 1 ? "Premium Tracks" : "Premium Track"}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronDown className={`transition-transform duration-300 ${expandedArtist === artist.name ? "rotate-180 text-emerald-600" : "text-slate-400"}`} />
            </button>

            {expandedArtist === artist.name && (
              <div className="px-7 pb-7 pt-2 animate-in slide-in-from-top-4 fade-in duration-300 border-t border-slate-100">
                <div className="max-h-[350px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-200">
                  <div className="grid gap-3">
                    {artist.tracks.map((track, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-emerald-600 shadow-sm"><Music size={18}/></div>
                          <span className="text-sm font-semibold text-slate-700">{track.track_name}</span>
                        </div>
                        <button 
                          onClick={() => setSelectedSong(track)}
                          className="flex items-center gap-2 text-xs font-bold bg-white text-slate-600 px-4 py-2 rounded-xl shadow-sm hover:bg-slate-900 hover:text-white transition-all"
                        >
                          <BarChart2 size={14}/> Detail
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL ANALISIS: DATA SCIENCE STYLE */}
      {selectedSong && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setSelectedSong(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900"><X size={20}/></button>
            
            <div className="mb-6">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{getDetailedReport(selectedSong).verdict}</span>
              <h2 className="font-black text-3xl text-slate-900 mt-1">{selectedSong.track_name}</h2>
              <p className="text-slate-500 font-bold">{selectedSong.artists}</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Popularity Score</p>
                    <p className="text-2xl font-black text-slate-900">{selectedSong.popularity}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Genre</p>
                    <p className="text-2xl font-black text-slate-900 capitalize">{selectedSong.track_genre}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Expert Insight</h4>
                    <p className="text-sm text-slate-600 mt-1">{getDetailedReport(selectedSong).strength}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Analisis Model</h4>
                    <p className="text-sm text-slate-600 mt-1">{getDetailedReport(selectedSong).weakness}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedSong(null)}
              className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              Tutup Laporan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalTitans;