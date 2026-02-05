"use client"

import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function ScrollToTopButton({appearPos = 0, finishPos = 0}) {
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
      behavior: "smooth"
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-6 bottom-6 z-50 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 cursor-pointer duration-300 flex items-center justify-center ${
        showScrollTop 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Прокрутить вверх"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
}