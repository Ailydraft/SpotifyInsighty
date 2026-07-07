import { Link, useLocation } from "react-router-dom";
import {
  Home, BarChart3, Brain, ClipboardCheck, BookOpen, Crown, Info, X,
  Target, Search, Database, Cpu, CheckCircle2, SlidersHorizontal
} from "lucide-react";

function Sidebar({ isOpen, setIsOpen, appMode, simStep, setSimStep }) {
  const location = useLocation();

  // Menu untuk Mode Utama (Expert)
  const expertMenus = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Prediction", path: "/prediction", icon: Brain },
    { name: "Evaluation", path: "/evaluation", icon: ClipboardCheck },
    { name: "Methodology", path: "/methodology", icon: BookOpen },
    { name: "Global Titans", path: "/global-titans", icon: Crown },
    { name: "About", path: "/about", icon: Info },
  ];

  // Menu Langkah Kerja untuk Mode CRISP-DM Simulator
  const simulatorMenus = [
    { step: 1, name: "01. Business Target", icon: Target },
    { step: 2, name: "02. Data Understanding", icon: Search },
    { step: 3, name: "03. Data Preparation", icon: Database },
    { step: 4, name: "04. C4.5 Modeling", icon: Cpu },
    { step: 5, name: "05. Model Evaluation", icon: CheckCircle2 },
    { step: 6, name: "06. Song Finder (Awam)", icon: SlidersHorizontal },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FIXED SIDEBAR DESKTOP & MOBILE */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 h-full bg-white/95 backdrop-blur-xl p-6 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:fixed md:top-[88px] md:left-0 md:w-64 md:h-[calc(100vh-88px)] md:translate-x-0 md:z-30 md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:border-r md:border-gray-100 overflow-y-auto custom-scrollbar bg-white`}
      >
        <div>
          <div className="flex items-center justify-end md:hidden mb-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* JUDUL MENU DISESUAIKAN BERDASARKAN MODE OPERASI */}
          <div className="px-3 mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              {appMode === "expert" ? "System Navigation" : "Simulation Stages"}
            </span>
          </div>

          <nav className="space-y-2">
            {appMode === "expert" ? (
              // RENDER JALUR ROUTER BIASA
              expertMenus.map((menu) => {
                const Icon = menu.icon;
                const active = location.pathname === menu.path;
                return (
                  <Link
                    key={menu.path}
                    to={menu.path}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      active ? "bg-[#1DB954] text-white shadow-md shadow-green-500/20" : "text-gray-500 hover:bg-green-50 hover:text-[#1DB954]"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{menu.name}</span>
                  </Link>
                );
              })
            ) : (
              // RENDER TOMBOL SIMULATOR STEP (STATE DRIVEN)
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
                    className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      active 
                        ? "bg-gradient-to-r from-[#1DB954] to-emerald-500 text-white shadow-md shadow-green-500/20 font-bold scale-[1.02]" 
                        : "text-gray-500 hover:bg-emerald-50 hover:text-[#1DB954]"
                    }`}
                  >
                    <Icon size={18} className={active ? "animate-pulse" : ""} />
                    <span className="text-xs font-semibold tracking-wide">{menu.name}</span>
                  </button>
                );
              })
            )}
          </nav>
        </div>

        {/* Kapsul Status Bawah */}
        <div className="mt-10 p-4 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-2xl border border-green-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping"></div>
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Active Core</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {appMode === "expert" ? "Production Dashboard v1" : `Simulating Step ${simStep} / 6`}
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;