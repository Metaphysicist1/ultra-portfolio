"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [counter, setCounter] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.45; // Clockwork precise increments
      });
    }, 40);

    if (counter >= 100) {
      const tl = gsap.timeline();
      tl.to(textRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      })
        .to(
          topRef.current,
          { scaleY: 0, duration: 1.2, ease: "expo.inOut" },
          "+=0.2",
        )
        .to(
          bottomRef.current,
          { scaleY: 0, duration: 1.2, ease: "expo.inOut" },
          "<",
        );
    }
    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none flex flex-col font-mono text-white">
      <div
        ref={topRef}
        className="vault-door-top h-1/2 w-full bg-black border-b border-white/10"
      />
      <div
        ref={bottomRef}
        className="vault-door-bottom h-1/2 w-full bg-black border-t border-white/10"
      />

      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center mix-blend-difference"
      >
        <div className="text-[10vw] font-heading leading-none tracking-tighter">
          {Math.min(counter, 100).toFixed(2)}
        </div>
        <div className="text-xs tracking-[0.5em] uppercase text-brand-gold mt-4">
          Calibrating Architecture
        </div>
      </div>
    </div>
  );
}
