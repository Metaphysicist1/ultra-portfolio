"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Pathway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate the central line growing down
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 50%",
            end: "bottom 80%",
            scrub: true,
          },
        },
      );

      // Fade in and float up the experience nodes
      gsap.utils.toArray(".timeline-node").forEach((node: any) => {
        gsap.from(node, {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: containerRef },
  );

  const experiences = [
    {
      year: "2026",
      title: "Master Data Science",
      company: "HAW Kiel, Germany",
      desc: "Machine Learning, Cloud Computing, Data Architecture.",
    },
    {
      year: "2023 - 2024",
      title: "AI Engineer",
      company: "Bank of Georgia",
      desc: "Improved NLU chatbot accuracy by 15%. Engineered dual-language NLP pipelines using MongoDB, Docker, and AWS.",
    },
    {
      year: "2021 - 2022",
      title: "Data Scientist",
      company: "BSU, Batumi",
      desc: "Developed highly accurate speech-to-text models utilizing Spectrograms and Fast Fourier Transforms (FFT).",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-background py-40 px-8 flex justify-center text-white font-mono"
    >
      <div className="max-w-4xl w-full relative">
        {/* Title */}
        <h2 className="text-5xl md:text-7xl font-heading uppercase text-center mb-32 mix-blend-difference">
          Neural <span className="text-brand-neon italic">Pathway</span>
        </h2>

        {/* The Core Scroll Line */}
        <div className="absolute top-[200px] bottom-0 left-4 md:left-1/2 w-[1px] bg-white/20">
          <div
            ref={lineRef}
            className="w-full h-full bg-brand-neon shadow-[0_0_15px_#00F0FF]"
          />
        </div>

        {/* The Nodes */}
        <div className="flex flex-col gap-24 relative z-10">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`timeline-node flex flex-col md:flex-row ${i % 2 === 0 ? "md:flex-row-reverse" : ""} items-start md:items-center w-full`}
            >
              {/* Content Box */}
              <div className="w-full md:w-1/2 p-8 pl-12 md:pl-8 relative group">
                {/* Glowing Dot */}
                <div className="absolute top-10 md:top-1/2 -left-[4px] md:left-auto md:right-[-4px] w-2 h-2 bg-brand-neon rounded-full transform -translate-y-1/2 group-even:md:left-[-4px] group-even:md:right-auto shadow-[0_0_10px_#00F0FF]" />

                <div className="bg-brand-glass border border-white/10 p-8 backdrop-blur-md hover:border-brand-neon/50 transition-colors duration-500 rounded-lg group-hover:-translate-y-2 transform ease-out">
                  <div className="text-brand-neon font-bold mb-2">
                    {exp.year}
                  </div>
                  <h3 className="font-heading text-2xl uppercase mb-1">
                    {exp.title}
                  </h3>
                  <div className="text-white/50 text-sm mb-4">
                    [{exp.company}]
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
