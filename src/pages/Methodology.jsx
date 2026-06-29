function Methodology() {
  const steps = [
    {
      title: "Business Understanding",
      desc: "Menentukan tujuan penelitian yaitu memprediksi popularitas lagu Spotify menggunakan algoritma C4.5.",
    },
    {
      title: "Data Understanding",
      desc: "Mengumpulkan dan memahami Spotify Tracks Dataset yang berisi audio features dan popularity score.",
    },
    {
      title: "Data Preparation",
      desc: "Membersihkan data, memilih atribut yang relevan, dan mempersiapkan dataset untuk proses modelling.",
    },
    {
      title: "Modeling",
      desc: "Membangun model klasifikasi menggunakan algoritma C4.5 Decision Tree.",
    },
    {
      title: "Evaluation",
      desc: "Mengukur performa model menggunakan Accuracy, Precision, Recall, dan F1 Score.",
    },
    {
      title: "Deployment",
      desc: "Mengimplementasikan model ke dalam aplikasi web Spotify Popularity Insights.",
    },
  ];

  return (
    <div>

      <h1 className="text-4xl font-bold text-gray-800">
        CRISP-DM Methodology
      </h1>

      <p className="text-gray-500 mt-2">
        Data Mining Process Framework
      </p>

      <div className="space-y-6 mt-8">

        {steps.map((step, index) => (
          <div
            key={index}
            className="
            bg-white
            rounded-3xl
            shadow-md
            p-6
            border-l-8
            border-[#1DB954]
            "
          >
            <h2 className="text-xl font-bold">
              {index + 1}. {step.title}
            </h2>

            <p className="text-gray-600 mt-2">
              {step.desc}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Methodology;