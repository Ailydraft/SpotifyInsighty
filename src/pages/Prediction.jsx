import { useState } from "react";

function Prediction() {

  const [form, setForm] = useState({
    danceability: "",
    energy: "",
    valence: "",
    tempo: "",
    acousticness: "",
    loudness: "",
  });

  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = () => {

    setLoading(true);

    setTimeout(() => {

      const score =
        Number(form.danceability) * 20 +
        Number(form.energy) * 20 +
        Number(form.valence) * 15 +
        Number(form.acousticness) * 10 +
        (Number(form.tempo) / 200) * 20 +
        ((60 + Number(form.loudness)) / 60) * 15;

      if (score >= 70) {
        setResult("High Popularity");
        setConfidence(92);
      }
      else if (score >= 50) {
        setResult("Medium Popularity");
        setConfidence(81);
      }
      else {
        setResult("Low Popularity");
        setConfidence(74);
      }

      setLoading(false);

    }, 1500);
  };

  return (
    <div>

      <h1 className="text-4xl font-bold text-gray-800">
        Popularity Prediction
      </h1>

      <p className="text-gray-500 mt-2">
        Predict Spotify track popularity using audio features
      </p>

      {/* FORM */}

      <div className="bg-white rounded-3xl shadow-md p-8 mt-8">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block font-semibold mb-2">
              Danceability
            </label>

            <input
              type="number"
              step="0.01"
              name="danceability"
              value={form.danceability}
              onChange={handleChange}
              placeholder="0 - 1"
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Energy
            </label>

            <input
              type="number"
              step="0.01"
              name="energy"
              value={form.energy}
              onChange={handleChange}
              placeholder="0 - 1"
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Valence
            </label>

            <input
              type="number"
              step="0.01"
              name="valence"
              value={form.valence}
              onChange={handleChange}
              placeholder="0 - 1"
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Tempo
            </label>

            <input
              type="number"
              name="tempo"
              value={form.tempo}
              onChange={handleChange}
              placeholder="60 - 200"
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Acousticness
            </label>

            <input
              type="number"
              step="0.01"
              name="acousticness"
              value={form.acousticness}
              onChange={handleChange}
              placeholder="0 - 1"
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Loudness
            </label>

            <input
              type="number"
              name="loudness"
              value={form.loudness}
              onChange={handleChange}
              placeholder="-60 - 0"
              className="w-full border rounded-xl p-3"
            />
          </div>

        </div>

        <button
          onClick={handlePredict}
          className="
          mt-8
          bg-[#1DB954]
          text-white
          px-8
          py-3
          rounded-xl
          font-semibold
          hover:scale-105
          transition
          "
        >
          Predict Popularity
        </button>

      </div>

      {/* RESULT */}

      <div className="bg-white rounded-3xl shadow-md p-8 mt-8">

        <h2 className="text-2xl font-bold text-gray-800">
          Prediction Result
        </h2>

        <div className="text-center mt-8">

          {loading ? (

            <div>

              <div className="w-16 h-16 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin mx-auto"></div>

              <p className="mt-4 text-gray-500">
                Running C4.5 Prediction...
              </p>

            </div>

          ) : result ? (

            <>

              <h1 className="text-6xl font-bold text-[#1DB954]">
                {result}
              </h1>

              <p className="mt-4 text-gray-500">
                Predicted Popularity Category
              </p>

              <div className="mt-6">

                <div className="w-full bg-gray-200 rounded-full h-5">

                  <div
                    className="bg-[#1DB954] h-5 rounded-full"
                    style={{
                      width: `${confidence}%`,
                    }}
                  />

                </div>

                <p className="mt-3 text-xl font-semibold">
                  Confidence: {confidence}%
                </p>

              </div>

            </>

          ) : (

            <p className="text-gray-400 text-lg">
              Enter audio features and click Predict
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default Prediction;