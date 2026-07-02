import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import PopularityChart from "../components/PopularityChart";
import { loadSpotifyData } from "../services/spotifyService";

import {
  Music,
  Users,
  Radio,
  TrendingUp,
} from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalArtists: 0,
    totalGenres: 0,
    avgPopularity: 0,
  });

  const [topArtist, setTopArtist] = useState("-");
  const [topGenre, setTopGenre] = useState("-");
  const [loading, setLoading] = useState(true); // Pengaman status loading

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await loadSpotifyData();

        // VALIDASI: Jika data kosong atau gagal di-load, hentikan proses agar tidak error
        if (!data || data.length === 0) {
          setLoading(false);
          return;
        }

        const artists = new Set(data.map(song => song.artists));
        const genres = new Set(data.map(song => song.track_genre));

        // Hitung Top Artist dengan validasi key
        const artistCount = {};
        data.forEach((song) => {
          const artist = song.artists || "Unknown Artist";
          artistCount[artist] = (artistCount[artist] || 0) + 1;
        });

        const sortedArtists = Object.entries(artistCount).sort((a, b) => b[1] - a[1]);
        const mostArtist = sortedArtists.length > 0 ? sortedArtists[0][0] : "-";

        // Hitung Top Genre dengan validasi key
        const genreCount = {};
        data.forEach((song) => {
          const genre = song.track_genre || "Unknown Genre";
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });

        const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
        const mostGenre = sortedGenres.length > 0 ? sortedGenres[0][0] : "-";

        // Hitung rata-rata popularitas
        const avgPopularity = data.reduce(
          (sum, song) => sum + Number(song.popularity || 0),
          0
        ) / data.length;

        setStats({
          totalSongs: data.length,
          totalArtists: artists.size,
          totalGenres: genres.size,
          avgPopularity: avgPopularity.toFixed(1),
        });

        setTopArtist(mostArtist);
        setTopGenre(mostGenre);
      } catch (error) {
        console.error("Gagal memproses data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Tampilan Loading sederhana saat data sedang di-fetch di latar belakang
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading Spotify Dataset...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HERO */}
      <div
        className="
        bg-gradient-to-r
        from-[#1DB954]
        via-[#1ED760]
        to-[#169C46]
        rounded-3xl
        p-10
        text-white
        shadow-2xl
        relative
        overflow-hidden"
      >
        <div className="absolute right-0 top-0 text-[220px] opacity-10">
          🎵
        </div>

        <h1 className="text-6xl font-extrabold">
          Spotify Insights
        </h1>

        <p className="mt-4 text-xl max-w-2xl">
          Discover patterns behind song popularity
          using Data Mining and Machine Learning.
        </p>

        <div className="flex flex-wrap gap-4 mt-8">
          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl">
            🎧 Spotify Dataset
          </div>
          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl">
            🤖 C4.5 Algorithm
          </div>
          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl">
            📊 CRISP-DM
          </div>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Songs"
          value={stats.totalSongs}
          icon={<Music className="text-[#1DB954]" />}
          color="bg-[#1DB954]"
        />
        <StatCard
          title="Artists"
          value={stats.totalArtists}
          icon={<Users className="text-blue-500" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Genres"
          value={stats.totalGenres}
          icon={<Radio className="text-purple-500" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Avg Popularity"
          value={stats.avgPopularity}
          icon={<TrendingUp className="text-orange-500" />}
          color="bg-orange-500"
        />
      </div>

      {/* DATASET STATUS & METRICS INTEGRATION (UPGRADED) */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100/80 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-50 rounded-full blur-2xl opacity-70 group-hover:bg-green-100 transition-colors duration-500"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-green-50 text-green-600 shadow-inner">
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-lg tracking-tight">
                  Database Connection Status
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">
                Spotify dataset synced seamlessly via CSV File Stream Engine
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
            <div className="text-left sm:text-right">
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Last Synced</p>
              <p className="text-xs font-semibold text-gray-600 mt-0.5">Just Now (Real-time)</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 hover:text-[#1DB954] hover:bg-green-50 active:scale-95 font-semibold text-xs rounded-xl border border-gray-200/60 transition-all duration-200 shadow-sm cursor-pointer"
            >
              🔄 Re-Fetch Engine
            </button>
          </div>
        </div>
      </div>

      {/* QUICK SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl shadow-lg p-6 hover:scale-105 transition">
          <p className="text-gray-500">Top Artist</p>
          <h2 className="text-3xl font-bold text-[#1DB954] mt-3">
            {topArtist}
          </h2>
          <p className="mt-2 text-gray-500">Most frequent artist in dataset</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 hover:scale-105 transition">
          <p className="text-gray-500">Top Genre</p>
          <h2 className="text-3xl font-bold text-[#1DB954] mt-3">
            {topGenre}
          </h2>
          <p className="mt-2 text-gray-500">Most dominant genre</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 hover:scale-105 transition">
          <p className="text-gray-500">Methodology</p>
          <h2 className="text-3xl font-bold text-[#1DB954] mt-3">
            CRISP-DM
          </h2>
          <p className="mt-2 text-gray-500">Industry Standard Framework</p>
        </div>
      </div>

      {/* CHART */}
      <PopularityChart />

      {/* DATASET OVERVIEW (UPGRADED GRID) */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100/50">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-[#1DB954] rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Dataset Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1DB954]/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-xl text-xl group-hover:scale-110 transition-transform duration-300">
                🎵
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">114,000+ Tracks</h3>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  More than 114,000 Spotify tracks available for comprehensive data mining exploration.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1DB954]/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-xl group-hover:scale-110 transition-transform duration-300">
                🎤
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Multi-Genre Artists</h3>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Thousands of unique artists distributed across multiple diverse genres and musical styles.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1DB954]/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-xl text-xl group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Audio Features</h3>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Includes key features like danceability, energy, loudness, valence, and tempo parameters.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1DB954]/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 rounded-xl text-xl group-hover:scale-110 transition-transform duration-300">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">C4.5 Prediction Model</h3>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Utilized directly to build a highly structured decision tree algorithm for popularity prediction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;