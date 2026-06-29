import { useEffect, useState } from "react";
import { loadSpotifyData } from "../services/spotifyService";

function Dataset() {

  const [songs, setSongs] = useState([]);

  useEffect(() => {

    const getData = async () => {

      const data = await loadSpotifyData();

      setSongs(data.slice(0, 10));

    };

    getData();

  }, []);

  return (
    <div>

      <h1 className="text-4xl font-bold text-gray-800">
        Dataset Preview
      </h1>

      <p className="text-gray-500 mt-2">
        First 10 rows from Spotify Tracks Dataset
      </p>

      <div className="bg-white rounded-3xl shadow-md p-6 mt-8 overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-3">
                Artist
              </th>

              <th className="text-left p-3">
                Genre
              </th>

              <th className="text-left p-3">
                Popularity
              </th>

            </tr>

          </thead>

          <tbody>

            {songs.map((song, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-3">
                  {song.artists}
                </td>

                <td className="p-3">
                  {song.track_genre}
                </td>

                <td className="p-3">
                  {song.popularity}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dataset;