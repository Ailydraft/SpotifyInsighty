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

  useEffect(() => {

    const getData = async () => {

      const data = await loadSpotifyData();

      const artists = new Set(
        data.map(song => song.artists)
      );

      const genres = new Set(
        data.map(song => song.track_genre)
      );

      const artistCount = {};

data.forEach((song) => {
  const artist = song.artists;

  artistCount[artist] =
    (artistCount[artist] || 0) + 1;
});

const mostArtist =
  Object.entries(artistCount)
    .sort((a, b) => b[1] - a[1])[0];

    const genreCount = {};

data.forEach((song) => {
  const genre = song.track_genre;

  genreCount[genre] =
    (genreCount[genre] || 0) + 1;
});

const mostGenre =
  Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])[0];

      const avgPopularity =
        data.reduce(
          (sum, song) =>
            sum + Number(song.popularity),
          0
        ) / data.length;

      setStats({
        totalSongs: data.length,
        totalArtists: artists.size,
        totalGenres: genres.size,
        avgPopularity: avgPopularity.toFixed(1),
      });

      setTopArtist(mostArtist[0]);
      setTopGenre(mostGenre[0]);

    };

    getData();

  }, []);

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

      {/* DATASET STATUS */}
      <div className="bg-white rounded-2xl shadow-md p-5">

        <div className="flex items-center gap-3">

          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

          <span className="font-semibold text-green-600">
            Dataset Loaded Successfully
          </span>

        </div>

      </div>

      {/* QUICK SUMMARY */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  <div className="bg-white rounded-3xl shadow-lg p-6 hover:scale-105 transition">

    <p className="text-gray-500">
      Top Artist
    </p>

    <h2 className="text-3xl font-bold text-[#1DB954] mt-3">
      {topArtist}
    </h2>

    <p className="mt-2 text-gray-500">
      Most frequent artist in dataset
    </p>

  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6 hover:scale-105 transition">

    <p className="text-gray-500">
      Top Genre
    </p>

    <h2 className="text-3xl font-bold text-[#1DB954] mt-3">
      {topGenre}
    </h2>

    <p className="mt-2 text-gray-500">
      Most dominant genre
    </p>

  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6 hover:scale-105 transition">

    <p className="text-gray-500">
      Methodology
    </p>

    <h2 className="text-3xl font-bold text-[#1DB954] mt-3">
      CRISP-DM
    </h2>

    <p className="mt-2 text-gray-500">
      Industry Standard Framework
    </p>

  </div>

</div>

      {/* CHART */}
      <PopularityChart />

      {/* DATASET OVERVIEW */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Dataset Overview
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div className="bg-gray-50 rounded-xl p-4">
            🎵 More than 114,000 Spotify tracks available
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            🎤 Thousands of artists across multiple genres
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            📊 Audio features include danceability, energy,
            loudness, valence, and tempo
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            🤖 Used to predict track popularity using
            C4.5 Decision Tree
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;