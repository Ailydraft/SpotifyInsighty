import CountUp from "react-countup";

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 hover:-translate-y-1">

      <h3 className="text-gray-500 font-medium">
        {title}
      </h3>

      <p className="text-4xl font-bold text-[#1DB954] mt-3">
        {value}
      </p>

    </div>
  );
}

export default StatCard;