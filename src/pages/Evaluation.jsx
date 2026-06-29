import StatCard from "../components/StatCard";

function Evaluation() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Model Evaluation
        </h1>

        <p className="text-gray-500 mt-2">
          Performance Evaluation of C4.5 Decision Tree
        </p>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Accuracy"
          value="92.4"
        />

        <StatCard
          title="Precision"
          value="90.8"
        />

        <StatCard
          title="Recall"
          value="91.5"
        />

        <StatCard
          title="F1 Score"
          value="91.1"
        />

      </div>

      {/* PERFORMANCE BARS */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <h2 className="text-2xl font-bold mb-6">
          Performance Metrics
        </h2>

        <div className="space-y-6">

          <div>
            <div className="flex justify-between">
              <span>Accuracy</span>
              <span>92.4%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: "92.4%" }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Precision</span>
              <span>90.8%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: "90.8%" }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Recall</span>
              <span>91.5%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-purple-500 h-4 rounded-full"
                style={{ width: "91.5%" }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <span>F1 Score</span>
              <span>91.1%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-orange-500 h-4 rounded-full"
                style={{ width: "91.1%" }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* CONFUSION MATRIX */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <h2 className="text-2xl font-bold mb-6">
          Confusion Matrix
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-center border">

            <thead>

              <tr className="bg-gray-100">

                <th className="border p-4">
                  Actual / Predicted
                </th>

                <th className="border p-4">
                  High
                </th>

                <th className="border p-4">
                  Low
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td className="border p-4 font-semibold">
                  High
                </td>

                <td className="border p-4 bg-green-100">
                  450
                </td>

                <td className="border p-4 bg-red-100">
                  50
                </td>

              </tr>

              <tr>

                <td className="border p-4 font-semibold">
                  Low
                </td>

                <td className="border p-4 bg-red-100">
                  60
                </td>

                <td className="border p-4 bg-green-100">
                  440
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* INTERPRETATION */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <h2 className="text-2xl font-bold mb-4">
          Model Interpretation
        </h2>

        <p className="text-gray-600 leading-relaxed">

          The C4.5 Decision Tree model demonstrates
          strong classification performance in predicting
          Spotify track popularity.

          With an accuracy above 90%, the model is able
          to correctly classify most tracks into their
          respective popularity categories.

          The balanced Precision, Recall, and F1 Score
          indicate that the model performs consistently
          without significant bias toward any class.

        </p>

      </div>

    </div>
  );
}

export default Evaluation;