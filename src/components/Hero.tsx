"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. Text splits apart like massive monolithic doors
      tl.to(leftTextRef.current, { xPercent: -150, ease: "power2.inOut" }, 0)
        .to(rightTextRef.current, { xPercent: 150, ease: "power2.inOut" }, 0)
        // 2. Video expands from a sliver into full screen
        .fromTo(
          videoRef.current,
          { clipPath: "inset(40% 45% 40% 45% round 20px)", scale: 0.5 },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 1,
            ease: "power2.inOut",
          },
          0,
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-background overflow-hidden flex items-center justify-center"
    >
      {/* The Monolithic Split Text */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none font-heading font-black text-[12vw] uppercase tracking-tighter leading-none mix-blend-difference text-white">
        <div ref={leftTextRef}>EDGAR</div>
        <div
          ref={rightTextRef}
          className="text-transparent border-text ml-4"
          style={{ WebkitTextStroke: "2px white" }}
        >
          ABASOV
        </div>
      </div>

      {/* The Video Aperture */}
      <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-brand-neon/10 mix-blend-overlay z-10"></div>
        <video
          ref={videoRef}
          className="object-cover w-full h-full"
          autoPlay
          muted
          loop
          playsInline
          src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-background-loop-27411-large.mp4"
        />
      </div>

      <div className="absolute bottom-10 w-full flex justify-between px-10 z-30 font-mono text-xs md:text-sm text-gray-400 tracking-[0.2em] uppercase">
        <p>System Architecture</p>
        <p className="text-brand-neon animate-pulse">Scroll to Ascend</p>
        <p>AI Engineering</p>
      </div>
    </section>
  );
}
