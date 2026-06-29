import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Prediction from "./pages/Prediction";
import Evaluation from "./pages/Evaluation";
import Methodology from "./pages/Methodology";
import Dataset from "./pages/Dataset";
import About from "./pages/About";

import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* Header */}
      <header className="bg-[#1DB954] text-white px-8 py-4 shadow-lg">
        <h1 className="text-3xl font-bold">
          Spotify Insights
        </h1>
      </header>

      <div className="flex">

        {/* Sidebar Component */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 p-8">

          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/prediction"
              element={<Prediction />}
            />

            <Route
              path="/evaluation"
              element={<Evaluation />}
            />

            <Route
              path="/methodology"
              element={<Methodology />}
            />

            <Route
              path="/dataset"
              element={<Dataset />}
            />

            <Route
              path="/about"
              element={<About />}
            />
          </Routes>

        </main>

      </div>

    </div>
  );
}

<footer className="text-center py-6 text-gray-500 text-sm">
  Spotify Popularity Prediction Using C4.5 |
  Group 4 Data Mining |
  LP3I Depok 2026
</footer>

export default App;