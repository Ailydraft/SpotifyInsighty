import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Brain,
  ClipboardCheck,
  BookOpen,
  Crown,
  Info,
  Sparkles, // Tambahan ikon untuk logo
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const menus = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Prediction", path: "/prediction", icon: Brain },
    { name: "Evaluation", path: "/evaluation", icon: ClipboardCheck },
    { name: "Methodology", path: "/methodology", icon: BookOpen },
    { name: "Global Titans", path: "/global-titans", icon: Crown },
    { name: "About", path: "/about", icon: Info },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white/95 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100 p-6 flex flex-col justify-between overflow-y-auto z-40 custom-scrollbar transition-all duration-300">
      
      {/* BAGIAN ATAS: Logo & Navigasi */}
      <div>
        {/* Header Logo Aesthetic */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-gradient-to-br from-[#1DB954] to-emerald-300 p-2.5 rounded-xl shadow-lg shadow-green-500/30">
            <Sparkles className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
            Insights<span className="text-[#1DB954]">.</span>
          </h1>
        </div>

        <nav className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const active = location.pathname === menu.path;

            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                ${
                  active
                    ? "bg-[#1DB954] text-white shadow-md shadow-green-500/30 scale-100"
                    : "text-gray-500 hover:bg-green-50 hover:text-[#1DB954] hover:translate-x-1.5"
                }`}
              >
                <Icon 
                  size={20} 
                  className={`transition-transform duration-300 ${
                    active ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6"
                  }`} 
                />
                <span className={`font-medium tracking-wide text-sm ${active ? "font-semibold" : ""}`}>
                  {menu.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BAGIAN BAWAH: Status Kapsul (Opsional, bikin UI makin pro) */}
      <div className="mt-10 p-4 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-green-200 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity"></div>
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <div className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse"></div>
          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">System Status</span>
        </div>
        <p className="text-xs text-gray-500 font-medium relative z-10 leading-relaxed">
          C4.5 Engine is <span className="text-[#1DB954] font-semibold">Online</span> and ready.
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;