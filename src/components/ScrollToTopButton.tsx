"use client";

import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function ScrollToTopButton({ appearPos = 0, finishPos = 0 }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > appearPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [appearPos]);

  const scrollToTop = () => {
    window.scrollTo({
      top: finishPos,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-12 h-12 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-xl hover:from-green-600 hover:to-emerald-700 hover:shadow-2xl cursor-pointer duration-300 flex items-center justify-center group ${
        showScrollTop
          ? "opacity-100 scale-100"
          : "opacity-0 scale-75 pointer-events-none"
      }`}
      aria-label="Прокрутить вверх"
    >
      <ChevronUp className="w-6 h-6 group-hover:-translate-y-0.5 duration-200" />
      <span className="sr-only">Наверх</span>
    </button>
  );
}
