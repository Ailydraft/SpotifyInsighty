import { Link, useLocation } from "react-router-dom";

import {
  Home,
  BarChart3,
  Brain,
  ClipboardCheck,
  BookOpen,
  Database,
  Info,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      path: "/",
      icon: Home,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Prediction",
      path: "/prediction",
      icon: Brain,
    },
    {
      name: "Evaluation",
      path: "/evaluation",
      icon: ClipboardCheck,
    },
    {
      name: "Methodology",
      path: "/methodology",
      icon: BookOpen,
    },
    {
      name: "Dataset",
      path: "/dataset",
      icon: Database,
    },
    {
      name: "About",
      path: "/about",
      icon: Info,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md p-6">

      <h1 className="text-2xl font-bold text-[#1DB954] mb-10">
        Spotify Insights
      </h1>

      <nav className="space-y-2">

        {menus.map((menu) => {
          const Icon = menu.icon;

          const active =
            location.pathname === menu.path;

          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${
                active
                  ? "bg-[#1DB954] text-white"
                  : "text-gray-700 hover:bg-green-50 hover:text-[#1DB954]"
              }`}
            >
              <Icon size={20} />

              <span>{menu.name}</span>
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}

export default Sidebar;