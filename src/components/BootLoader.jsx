import { useEffect, useState } from "react";
import { Music2 } from "lucide-react";

function BootLoader({ onFinish }) {
  const [progress, setProgress] = useState(0);

  const messages = [
    "Loading Dataset...",
    "Preparing Charts...",
    "Building Components...",
    "Training Decision Tree...",
    "Launching Workspace..."
  ];

  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {

    let value = 0;

    const timer = setInterval(() => {

      value += Math.floor(Math.random() * 8) + 3;

      if (value >= 100) {

        value = 100;

        clearInterval(timer);

        setTimeout(() => {

          onFinish();

        }, 700);

      }

      setProgress(value);

      if (value < 20)
        setMessage(messages[0]);

      else if (value < 40)
        setMessage(messages[1]);

      else if (value < 60)
        setMessage(messages[2]);

      else if (value < 80)
        setMessage(messages[3]);

      else
        setMessage(messages[4]);

    }, 180);

    return () => clearInterval(timer);

  }, []);

  return (

    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#121212] via-[#191414] to-[#0e0e0e] flex items-center justify-center">

      <div className="text-center w-[520px]">

        <Music2
          className="mx-auto text-[#1DB954] animate-spin"
          size={70}
          style={{ animationDuration: "8s" }}
        />

        <h1 className="text-5xl font-extrabold text-white mt-8">
          Spotify Insights
        </h1>

        <p className="text-green-400 text-xl mt-2">
          CRISP-DM Simulator
        </p>

        <p className="text-gray-400 mt-8">

          {message}

        </p>

        <div className="w-full bg-gray-700 rounded-full h-4 mt-6 overflow-hidden">

          <div
            className="bg-gradient-to-r from-[#1DB954] to-[#1ED760] h-4 transition-all duration-300"
            style={{
              width: `${progress}%`
            }}
          />

        </div>

        <h2 className="text-3xl font-bold text-white mt-5">

          {progress}%

        </h2>

      </div>

    </div>

  );

}

export default BootLoader;