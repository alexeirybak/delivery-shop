export const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  top: `${(i * 17) % 100}%`,
  left: `${(i * 23) % 100}%`,
  duration: `${3 + (i % 4)}s`,
  delay: `${(i * 0.3) % 2}s`,
}));
