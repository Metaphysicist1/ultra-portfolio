"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, X } from "lucide-react"; // We installed lucide-react in step 1

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!overlayRef.current || !linksRef.current) return;

    if (isOpen) {
      // Open Animation
      gsap.to(overlayRef.current, {
        clipPath: "circle(150% at top right)",
        duration: 1,
        ease: "power4.inOut",
      });
      gsap.fromTo(
        linksRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          delay: 0.4,
          ease: "power3.out",
        },
      );
    } else {
      // Close Animation
      gsap.to(overlayRef.current, {
        clipPath: "circle(0% at top right)",
        duration: 0.8,
        ease: "power4.inOut",
      });
    }
  }, [isOpen]);

  const navLinks = ["Home", "Pathway", "Works", "Contact"];

  return (
    <>
      {/* The Fixed Header Bar */}
      <header className="fixed top-0 left-0 w-full z-[999] px-8 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="font-heading font-black text-2xl tracking-tighter uppercase cursor-pointer">
          PORTFOLIO<span className="text-brand-neon">.</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-[1000] p-2 hover:text-brand-neon transition-colors"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </header>

      {/* The Full Screen Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[998] bg-brand-dark/95 backdrop-blur-md flex items-center justify-center"
        style={{ clipPath: "circle(0% at top right)" }} // Start completely hidden
      >
        <nav
          ref={linksRef}
          className="flex flex-col items-center gap-8 text-center"
        >
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="font-heading text-5xl md:text-7xl uppercase text-white hover:text-brand-neon transition-colors duration-300"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
