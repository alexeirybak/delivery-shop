import { useEffect, useState } from 'react';

export const useScrollEffects = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    let frame: number | null = null;
    let scrollFrame: number | null = null;

    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        root.style.setProperty('--pointer-x', `${x.toFixed(4)}`);
        root.style.setProperty('--pointer-y', `${y.toFixed(4)}`);
      });
    };

    const handleScroll = () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);

      scrollFrame = requestAnimationFrame(() => {
        const progress = Math.min(
          window.scrollY / Math.max(window.innerHeight, 1),
          1.2,
        );
        root.style.setProperty('--scroll-progress', progress.toFixed(4));
        setIsScrolled(window.scrollY > 32);
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return { isScrolled };
};