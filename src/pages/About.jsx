function About() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800">
        About Research
      </h1>

      <p className="text-gray-500 mt-2">
        Information about this research project
      </p>

      {/* Team */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-gray-800">
            Erik Andika Bagaskara
          </h3>

          <p className="text-gray-500 mt-2">
            NIM: 240444180001
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-gray-800">
            Muammar Nazma Zamzami
          </h3>

          <p className="text-gray-500 mt-2">
            NIM: 240444180002
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-gray-800">
            Muhammad Naufal Al-Maraghi
          </h3>

          <p className="text-gray-500 mt-2">
            NIM:  240444180009
          </p>
        </div>

      </div>

      {/* Research Info */}
      <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Research Information
        </h2>

        <div className="space-y-5">

          <div>
            <h3 className="font-semibold text-gray-800">
              Course
            </h3>
            <p className="text-gray-600">
              Data Mining
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Group
            </h3>
            <p className="text-gray-600">
              Group 4
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Research Title
            </h3>
            <p className="text-gray-600">
              Prediksi Popularitas Lagu Spotify Menggunakan Algoritma C4.5
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Methodology
            </h3>
            <p className="text-gray-600">
              CRISP-DM
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Algorithm
            </h3>
            <p className="text-gray-600">
              C4.5 Decision Tree
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Dataset
            </h3>
            <p className="text-gray-600">
              Spotify Tracks Dataset (Kaggle)
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Purpose
            </h3>
            <p className="text-gray-600">
              To analyze and predict Spotify track popularity
              based on audio features using the C4.5 algorithm.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default About;