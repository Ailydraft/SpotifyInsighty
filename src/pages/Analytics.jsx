import { useEffect, useState } from "react";
import { loadSpotifyData } from "../services/spotifyService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Tooltip Kustom Premium untuk Bar Chart
const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-700 text-sm backdrop-blur-md bg-opacity-90">
        <p className="font-bold text-green-400 text-base mb-1">{data.trackName}</p>
        <p className="text-gray-300 font-medium">Artis: <span className="text-white">{data.artist}</span></p>
        <p className="text-gray-400 mt-1">
          Popularitas: <span className="text-green-300 font-bold text-base">{data.popularity}</span> / 100
        </p>
      </div>
    );
  }
  return null;
};

// Tooltip Kustom Premium untuk Donut Chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-gray-300 mt-1">
          Jumlah: <span className="text-green-400 font-bold">{payload[0].value} Lagu</span>
        </p>
      </div>
    );
  }
  return null;
};

function Analytics() {
  const [topSongsData, setTopSongsData] = useState([]);
  const [musicalModeData, setMusicalModeData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await loadSpotifyData();

      // 1. FILTER DATA: Ambil Khusus Genre 'pop' yang Populer
      const popSongs = data.filter((song) => song.track_genre === "pop");

      // 2. PROSES BAR CHART: 10 Lagu Pop Teratas Berdasarkan Nilai Popularitas Riil
      const topPopTracks = [...popSongs]
        .sort((a, b) => Number(b.popularity) - Number(a.popularity))
        .slice(0, 10)
        .map((song) => ({
          artist: song.artists.split(";")[0], // Ambil artis utama saja agar teks sumbu X tidak kepanjangan
          trackName: song.track_name,
          popularity: Number(song.popularity),
        }));

      setTopSongsData(topPopTracks);

      // 3. PROSES DONUT CHART: Hitung Karakteristik Nada (Major vs Minor Key)
      let majorCount = 0;
      let minorCount = 0;

      popSongs.forEach((song) => {
        if (Number(song.mode) === 1) {
          majorCount++;
        } else {
          minorCount++;
        }
      });

      setMusicalModeData([
        { name: "Major Key (Bright & Happy Mood)", value: majorCount },
        { name: "Minor Key (Emotional & Sad Mood)", value: minorCount },
      ]);
    };

    getData();
  }, []);

  // Warna Kontras Estetik: Hijau Spotify untuk Nuansa Ceria, Biru Elektrik untuk Nuansa Emosional
  const COLORS = ["#1DB954", "#3A86FF"];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Mainstream Market Analysis: Pop Genre Focus
        </p>
      </div>

      {/* GRAPH 1: BAR CHART */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Top 10 Lagu Pop Terpopuler
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Peringkat berdasarkan volume putar global orisinal
        </p>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topSongsData}>
            <XAxis
              dataKey="artist"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={80}
              tick={{ fill: "#4B5563", fontSize: 12 }}
            />
            <YAxis domain={[0, 100]} tickCount={6} />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar
              dataKey="popularity"
              fill="#1DB954"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* GRAPH 2: DONUT CHART */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Analisis Karakteristik Nada (Musical Mode Distribution)
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Aspek emosional lagu Pop di dalam dataset berdasarkan struktur tangga nada internal
        </p>

        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={musicalModeData}
              dataKey="value"
              nameKey="name"
              innerRadius={90} // Membuat efek lubang Donut di tengah agar elegan
              outerRadius={140}
              paddingAngle={5} // Jarak pemisah antar potongan data
            >
              {musicalModeData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            {/* Legend untuk memperjelas arti warna, menghapus ambiguitas */}
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;