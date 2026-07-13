import { Link, useLocation } from "react-router-dom";
import {
  Home, BarChart3, Brain, ClipboardCheck, BookOpen, Crown, Info, X
} from "lucide-react";

function Sidebar({ isOpen, setIsOpen, appMode, simStep, setSimStep }) {
  const location = useLocation();

  if (appMode === "simulator" || location.pathname.includes("simulator")) {
    return null; 
  }

  const expertMenus = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Prediction", path: "/prediction", icon: Brain },
    { name: "Evaluation", path: "/evaluation", icon: ClipboardCheck },
    { name: "Methodology", path: "/methodology", icon: BookOpen },
    { name: "Global Titans", path: "/global-titans", icon: Crown },
    { name: "About", path: "/about", icon: Info },
  ];

  const simulatorMenus = [];

  return (
    <>
      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ULTRA CLEAN FLOATING ISLAND SIDEBAR */}
      <aside 
        className={`fixed z-50 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shrink-0
          /* Layout Mobile */
          top-0 left-0 h-full w-[280px] p-6 bg-white rounded-r-[2rem] shadow-[20px_0_50px_rgba(0,0,0,0.05)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          
          /* Layout Desktop (Floating Island Mod) */
          md:translate-x-0 md:top-[110px] md:left-5 md:w-[240px] md:h-[calc(100vh-140px)] md:rounded-[24px] 
          md:bg-white/75 md:backdrop-blur-xl md:border md:border-white/60 md:shadow-[0_10px_30px_rgba(0,0,0,0.04)]
        `}
      >
        {/* Konten Utama Sidebar dengan Trik Sembunyi Scrollbar */}
        <div className="relative z-10 flex flex-col h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
          {/* TOMBOL CLOSE MOBILE */}
          <div className="flex items-center justify-end md:hidden mb-5">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 border border-gray-100"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* HEADLINE NAVIGATION */}
          <div className="px-3 mb-5 flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954]"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
              {appMode === "expert" ? "Navigation" : "Stages"}
            </span>
          </div>

          {/* MENU ITEMS */}
          <nav className="space-y-1.5 flex-1">
            {appMode === "expert" ? (
              expertMenus.map((menu) => {
                const Icon = menu.icon;
                const active = location.pathname === menu.path;
                return (
                  <Link
                    key={menu.path}
                    to={menu.path}
                    onClick={() => setIsOpen(false)}
                    className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 ease-out ${
                      active 
                        ? "bg-[#1DB954] text-white shadow-[0_8px_20px_rgba(29,185,84,0.3)] font-bold scale-[1.02]" 
                        : "text-gray-600 hover:bg-white/90 hover:text-[#1DB954] hover:shadow-sm hover:translate-x-1"
                    }`}
                  >
                    {/* Indikator Garis Samping Kiri Saat Aktif */}
                    {active && (
                      <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />
                    )}
                    
                    {/* Icon Animasi Lembut */}
                    <div className={`transition-transform duration-300 ${active ? "" : "group-hover:scale-110 group-hover:rotate-3"}`}>
                      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                    </div>
                    
                    <span className="text-sm tracking-wide">{menu.name}</span>
                  </Link>
                );
              })
            ) : (
              // SIMULATOR MENUS (Jika ada)
              simulatorMenus.map((menu) => {
                const Icon = menu.icon;
                const active = simStep === menu.step;
                return (
                  <button
                    key={menu.step}
                    onClick={() => {
                      setSimStep(menu.step);
                      setIsOpen(false);
                    }}
                    className={`w-full group relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all duration-300 ease-out ${
                      active 
                        ? "bg-gradient-to-r from-[#1DB954] to-emerald-500 text-white shadow-[0_8px_20px_rgba(29,185,84,0.3)] font-bold scale-[1.02]" 
                        : "text-gray-600 hover:bg-white/90 hover:text-[#1DB954] hover:translate-x-1"
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />
                    )}
                    <div className={`transition-transform duration-300 ${active ? "" : "group-hover:scale-110"}`}>
                      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                    </div>
                    <span className="text-sm tracking-wide">{menu.name}</span>
                  </button>
                );
              })
            )}
          </nav>

          {/* FOOTER STATUS KAPSUL */}
          <div className="pt-4 mt-auto">
            <div className="p-3.5 bg-white/60 border border-white/80 rounded-xl shadow-inner relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]"></span>
                </span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">System Status</span>
              </div>
              <p className="text-[11px] text-gray-700 font-semibold truncate">
                {appMode === "expert" ? "Production Core v1" : `Step ${simStep} / 6`}
              </p>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;