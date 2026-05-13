"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const generateStars = (width: number, height: number) => {
  const stars = [];
  for (let i = 0; i < 80; i++) {
    stars.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      duration: Math.random() * 8 + 4,
      endX: Math.random() * width,
      endY: Math.random() * height,
      delay: Math.random() * 5,
    });
  }
  return stars;
};

export default function NotFoundContent() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stars = useMemo(() => {
    if (windowSize.width === 0) return [];
    return generateStars(windowSize.width, windowSize.height);
  }, [windowSize.width, windowSize.height]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (windowSize.width === 0) {
    return null;
  }

  return (
    <div className="not-found-content">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="star"
          initial={{ x: star.x, y: star.y, opacity: 0 }}
          animate={{
            x: star.endX,
            y: star.endY,
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
            delay: star.delay,
          }}
        />
      ))}

      <motion.div
        className="content-wrapper"
        animate={{ x: mousePosition.x, y: mousePosition.y }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="glitch-wrapper">
            <span className="glitch-main">404</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="title">Страница не найдена</h2>
        </motion.div>

        <motion.p
          className="description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.span
            className="animated-text"
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ delay: 0.8, duration: 1.5, ease: "linear" }}
          >
            Кажется, вы забрели в неизведанные дали...
          </motion.span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/" className="home-button">
            <motion.span
              className="button-overlay"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
            <span className="button-content">
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowLeft />
              </motion.span>
              Вернуться на главную
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight />
              </motion.span>
            </span>
          </Link>
        </motion.div>

        <motion.p
          className="footer-text"
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
