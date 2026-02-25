"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function NotFoundContent() {
  const [glitchText, setGlitchText] = useState("404");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchText("4̷0̴4̵");
        setTimeout(() => setGlitchText("404"), 150);
      }
    }, 2000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(glitchInterval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (windowSize.width === 1000) {
    return null;
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-linear-to-br from-purple-900 via-black to-blue-900">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
          }}
          animate={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            filter: "blur(1px)",
          }}
        />
      ))}

      <motion.div
        className="relative z-10 px-4 text-center"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      >
        <motion.h1
          className="relative mb-4 font-bold text-white text-9xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <span className="relative inline-block">
            {glitchText}
            <motion.span
              className="absolute top-0 left-0 text-red-500 opacity-70"
              animate={{
                x: [0, -3, 2, -2, 0],
                y: [0, 2, -3, 1, 0],
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{ clipPath: "inset(0 0 0 0)" }}
            >
              {glitchText}
            </motion.span>
            <motion.span
              className="absolute top-0 left-0 text-blue-500 opacity-70"
              animate={{
                x: [0, 3, -2, 2, 0],
                y: [0, -2, 3, -1, 0],
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{ clipPath: "inset(0 0 0 0)" }}
            >
              {glitchText}
            </motion.span>
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="mb-6 text-4xl font-bold text-transparent md:text-5xl bg-clip-text bg-linear-to-r from-pink-500 to-yellow-500">
            Страница не найдена
          </h2>
        </motion.div>

        <motion.p
          className="max-w-2xl mx-auto mb-8 text-xl text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 1.5, ease: "linear" }}
            className="inline-block overflow-hidden border-r-2 border-white whitespace-nowrap"
          >
            Кажется, вы забрели в неизведанные дали...
          </motion.span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden text-lg font-bold text-white  transition-custom rounded-full shadow-2xl group bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/50"
          >
            <motion.span
              className="absolute inset-0 bg-white"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
              style={{ opacity: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ←
              </motion.span>
              Вернуться на главную
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </Link>
        </motion.div>

        <motion.p
          className="mt-8 text-base text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          *возможно, эту страницу похитили инопланетяне*
        </motion.p>
      </motion.div>
    </div>
  );
}
