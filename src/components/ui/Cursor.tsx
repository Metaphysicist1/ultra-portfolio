"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !cursorRef.current) return;
    const xMoveCursor = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.1,
      ease: "power4.out",
    });
    const yMoveCursor = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.1,
      ease: "power4.out",
    });

    const moveCursor = (e: MouseEvent) => {
      xMoveCursor(e.clientX);
      yMoveCursor(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2"
    >
      {/* Precision Crosshair */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className="absolute w-[2px] h-full bg-white opacity-50" />
        <div className="absolute w-full h-[2px] bg-white opacity-50" />
        <div className="absolute w-1 h-1 bg-brand-gold rounded-full" />
      </div>
    </div>
  );
}
