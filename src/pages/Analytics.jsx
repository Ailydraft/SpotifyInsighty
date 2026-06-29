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
} from "recharts";

function Analytics() {
  const [genreData, setGenreData] = useState([]);
  const [popularityData, setPopularityData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await loadSpotifyData();

            const genrePopularity = {};

      data.forEach((song) => {
        const genre = song.track_genre;

        if (!genrePopularity[genre]) {
          genrePopularity[genre] = {
            total: 0,
            count: 0,
          };
        }

        genrePopularity[genre].total += Number(
          song.popularity
        );

        genrePopularity[genre].count += 1;
      });

      const topGenres = Object.entries(
        genrePopularity
      )
        .map(([genre, stats]) => ({
          genre,
          popularity:
            stats.total / stats.count,
        }))
        .sort(
          (a, b) =>
            b.popularity - a.popularity
        )
        .slice(0, 10);

      setGenreData(topGenres);

           const distribution = [
        { name: "0-20", value: 0 },
        { name: "21-40", value: 0 },
        { name: "41-60", value: 0 },
        { name: "61-80", value: 0 },
        { name: "81-100", value: 0 },
      ];

      data.forEach((song) => {
        const pop = Number(song.popularity);

        if (pop <= 20) distribution[0].value++;
        else if (pop <= 40)
          distribution[1].value++;
        else if (pop <= 60)
          distribution[2].value++;
        else if (pop <= 80)
          distribution[3].value++;
        else distribution[4].value++;
      });

      setPopularityData(distribution);
    };

    getData();
  }, []);

  const COLORS = [
    "#1DB954",
    "#36D66B",
    "#66E08A",
    "#99EAAE",
    "#C7F5D2",
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Analytics Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Spotify Dataset Analysis
        </p>
      </div>

      {/* BAR CHART */}
      <div className="bg-white rounded-3xl shadow-md p-6">

        <h2 className="text-2xl font-bold mb-6">
          Top 10 Genres by Average Popularity
        </h2>

        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <BarChart data={genreData}>

            <XAxis
              dataKey="genre"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={80}
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="popularity"
              fill="#1DB954"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* PIE CHART */}
      <div className="bg-white rounded-3xl shadow-md p-6">

        <h2 className="text-2xl font-bold mb-6">
          Popularity Distribution
        </h2>

        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <PieChart>

            <Pie
              data={popularityData}
              dataKey="value"
              nameKey="name"
              outerRadius={140}
              label
            >
              {popularityData.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default Analytics;