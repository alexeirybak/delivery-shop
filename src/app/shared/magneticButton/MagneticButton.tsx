"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { MagneticButtonProps } from "../../types/home.types";
import "./magneticButton.css";

export const MagneticButton = ({
  children,
  href = "#launch",
  variant = "primary",
  onClick, // добавили onClick
}: MagneticButtonProps & { onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMove = (event: MouseEvent | globalThis.PointerEvent) => {
      const bounds = button.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;

      button.style.setProperty("--magnetic-x", `${x * 0.16}px`);
      button.style.setProperty("--magnetic-y", `${y * 0.16}px`);
    };

    const handleLeave = () => {
      button.style.setProperty("--magnetic-x", "0px");
      button.style.setProperty("--magnetic-y", "0px");
    };

    const pointerMoveHandler = (event: globalThis.PointerEvent) =>
      handleMove(event);

    button.addEventListener("pointermove", pointerMoveHandler);
    button.addEventListener("pointerleave", handleLeave);

    return () => {
      button.removeEventListener("pointermove", pointerMoveHandler);
      button.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <a
      ref={buttonRef}
      className={`button magnetic-button ${variant === "secondary" ? "button-secondary" : "button-primary"}`}
      href={href}
      onClick={onClick}
    >
      <span className="button-shine" />
      <span className="button-label flex items-center gap-2">
        {children}
        <span className="button-arrow">
          <ArrowRight className="w-3 h-3" />
        </span>
      </span>
    </a>
  );
};