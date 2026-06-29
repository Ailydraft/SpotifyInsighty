import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const data = [
  { year: "2018", popularity: 40 },
  { year: "2019", popularity: 45 },
  { year: "2020", popularity: 50 },
  { year: "2021", popularity: 55 },
  { year: "2022", popularity: 60 },
  { year: "2023", popularity: 65 },
  { year: "2024", popularity: 70 },
];

function PopularityChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

      <h2 className="text-xl font-bold mb-4">
        Popularity Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="year" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="popularity"
            stroke="#1DB954"
            strokeWidth={4}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default PopularityChart;