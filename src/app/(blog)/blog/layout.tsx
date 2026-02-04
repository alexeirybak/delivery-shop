"use client"

import { ReactNode, useState, useEffect } from "react";
import BlogSearch from "./[category]/_components/BlogSearch";
import { ChevronUp } from "lucide-react";

export default function BlogLayout({ children }: { children: ReactNode }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="mb-8">
        <BlogSearch />
      </div>

      {children}

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
    </div>
  );
}