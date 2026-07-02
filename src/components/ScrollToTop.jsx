import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Muncul jika scroll sudah melewati 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-8 right-8 p-4 rounded-2xl bg-slate-950/80 text-[#1DB954] border border-white/10 backdrop-blur-xl transition-all duration-500 ease-out z-50 flex items-center justify-center group active:scale-95 shadow-[0_12px_40px_rgba(0,0,0,0.3)]
      hover:bg-[#1DB954] hover:text-white hover:shadow-[0_0_30px_rgba(29,185,84,0.4)] hover:-translate-y-2 hover:scale-110
      ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-12 pointer-events-none"
      }`}
    >
      {/* Efek Ring Glow Tipis di Belakang Tombol saat Hover */}
      <span className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 group-hover:scale-105 transition-all duration-300 pointer-events-none"></span>
      
      <ArrowUp 
        size={22} 
        strokeWidth={3} 
        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:animate-bounce" 
      />
    </button>
  );
}