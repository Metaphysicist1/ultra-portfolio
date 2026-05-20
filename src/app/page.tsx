"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PhilosophicalEngine from "@/components/PhilosophicalEngine";
import Cursor from "@/components/ui/Cursor";
import Preloader from "@/components/Preloader";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const citadelRef = useRef<HTMLDivElement>(null);
  const swordRef = useRef<HTMLDivElement>(null);
  const academyRef = useRef<HTMLDivElement>(null);
  const logicRef = useRef<HTMLDivElement>(null);
  const arsenalRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);
  const singularityRef = useRef<HTMLDivElement>(null);
  const axisProgressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      ScrollTrigger.refresh();

      // ── Hero: visible immediately on mount ──────────────────────────────
      gsap.set(heroRef.current, {
        y: 70,
        rotateX: -6,
        scale: 0.95,
        autoAlpha: 0,
        transformPerspective: 1200,
      });
      gsap.to(heroRef.current, {
        y: 0,
        rotateX: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 1.8,
        ease: "expo.out",
        delay: 0.5,
      });

      // ── Scroll timeline ─────────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      tl.to(
        axisProgressRef.current,
        { scaleY: 1, ease: "none", duration: 28 },
        0,
      );

      // Hero scrolls OUT on first scroll movement
      tl.to(
        heroRef.current,
        {
          y: -80,
          rotateX: 6,
          scale: 0.97,
          autoAlpha: 0,
          duration: 1.5,
          ease: "power3.in",
        },
        "+=2",
      );

      const phases = [
        { ref: citadelRef, delay: 0 },
        { ref: swordRef, delay: 0.5 },
        { ref: academyRef, delay: 0.5 },
        { ref: logicRef, delay: 0.5 },
        { ref: arsenalRef, delay: 0.5 },
        { ref: proofRef, delay: 0.5 },
        { ref: singularityRef, delay: 0.5 },
      ];

      phases.forEach((phase, index) => {
        const el = phase.ref.current;
        if (!el) return;

        gsap.set(el, {
          y: 90,
          rotateX: -8,
          scale: 0.93,
          autoAlpha: 0,
          transformPerspective: 1200,
        });

        tl.to(
          el,
          {
            y: 0,
            rotateX: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 2,
            ease: "power4.out",
          },
          `+=${phase.delay}`,
        );

        if (index !== phases.length - 1) {
          tl.to(
            el,
            {
              y: -70,
              rotateX: 5,
              scale: 0.97,
              autoAlpha: 0,
              duration: 1.5,
              ease: "power3.in",
            },
            "+=2.5",
          );
        }
      });
    },
    { scope: containerRef },
  );

  return (
    <main
      ref={containerRef}
      className="relative w-full h-[900vh] bg-[#06060C] text-white font-mono overflow-hidden selection:bg-brand-gold selection:text-black"
    >
      <Preloader />
      <Cursor />
      <div className="quantum-noise z-10 pointer-events-none" />

      {/* 3D ENGINE */}
      <PhilosophicalEngine />

      {/* GLOBAL HUD BORDER */}
      <div className="fixed inset-6 md:inset-12 border border-white/10 pointer-events-none z-20 flex justify-between">
        <div className="absolute -left-[1px] top-0 bottom-0 w-[1px] bg-white/10">
          <div
            ref={axisProgressRef}
            className="w-[2px] h-full bg-brand-gold origin-top scale-y-0 shadow-[0_0_15px_#d4af37]"
          />
        </div>
        <div className="absolute -top-4 left-4 text-[9px] text-brand-gold tracking-widest bg-black px-2 py-1 border border-white/10">
          COORD. X: 0.001
        </div>
        <div className="absolute -bottom-4 right-4 text-[9px] text-brand-gold tracking-widest bg-black px-2 py-1 border border-white/10">
          COORD. Y: 894.22
        </div>
      </div>

      {/* EDITORIAL GRID */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {/* ═══════════════ 1. HERO ═══════════════════════════════════════════ */}
        <div ref={heroRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full max-w-5xl px-6 pointer-events-auto">
          {/* Eyebrow */}
          <div className="text-[10px] tracking-[0.5em] text-brand-gold uppercase mb-6 flex items-center gap-4 bg-black/60 px-5 py-2 border border-white/10">
            <span className="w-4 h-[1px] bg-brand-gold" />
            [ SYS.INIT // AI ENGINEER ]
            <span className="w-4 h-[1px] bg-brand-gold" />
          </div>

          {/* Gradient name */}
          <h1
            className="text-7xl md:text-[10rem] font-heading font-black uppercase tracking-tighter leading-none text-center"
            style={{ background: 'linear-gradient(135deg, #FF2D78 0%, #9945FF 45%, #3E48FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 40px rgba(153,69,255,0.35))' }}
          >
            Edgar<br />Abasov
          </h1>

          {/* Role tags */}
          <div className="flex gap-3 flex-wrap justify-center mt-6">
            {[
              { label: "AI Engineer", col: "#FF2D78" },
              { label: "Data Scientist", col: "#9945FF" },
              { label: "ML Architect", col: "#3E48FF" },
            ].map(({ label, col }) => (
              <span key={label} className="text-[10px] tracking-[0.3em] uppercase font-bold px-4 py-1.5 border" style={{ color: col, borderColor: `${col}50`, background: `${col}10` }}>{label}</span>
            ))}
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-px mt-8 w-full max-w-2xl bg-white/5 border border-white/10">
            {[
              { v: "2+", l: "Years in Production AI" },
              { v: "+15%", l: "NLU Accuracy Gained" },
              { v: "27", l: "Public Repositories" },
            ].map(({ v, l }) => (
              <div key={l} className="bg-[#06060C] px-6 py-5 text-center">
                <div className="text-2xl font-heading font-black text-white" style={{ textShadow: '0 0 20px rgba(255,45,120,0.5)' }}>{v}</div>
                <div className="text-[9px] tracking-widest text-gray-500 uppercase mt-1">{l}</div>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="mt-6 bg-black/70 backdrop-blur-xl border border-white/10 p-6 md:p-8 max-w-2xl text-center" style={{ boxShadow: '0 0 60px rgba(0,0,0,0.9), inset 0 0 30px rgba(153,69,255,0.04)' }}>
            <div className="text-[9px] text-[#00FFB2] tracking-[0.4em] mb-3 uppercase border-b border-white/10 pb-2">
              [ SYSTEM OVERVIEW // v3.0 ]
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed tracking-wide font-body">
              I engineer deterministic AI architectures, multi-agent RAG ecosystems, and scalable cloud infrastructure. Operating at the intersection of raw mathematics and deep learning — building systems designed to conquer chaos and impose absolute order on raw data.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[9px] tracking-widest text-[#00FFB2] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
              Available · Werkstudent / HiWi · 20h/week · Germany
            </div>
          </div>

          {/* Scroll CTA */}
          <div className="mt-10 flex flex-col items-center gap-2 opacity-60 animate-pulse">
            <div className="text-[9px] tracking-widest text-brand-gold uppercase bg-black/50 px-2">[ SCROLL TO DECRYPT ]</div>
            <div className="w-[1px] h-12 bg-gradient-to-b from-brand-gold to-transparent" />
          </div>
        </div>

        {/* ═══════════════ 2. SEQ_01 PHILOSOPHY ══════════════════════════════ */}
        <div ref={citadelRef} className="absolute top-20 left-10 md:left-20 max-w-xl pointer-events-auto">
          <div className="bg-[#06060C]/88 backdrop-blur-xl border border-white/10 border-l-2" style={{ borderLeftColor: '#00FFB2', boxShadow: '0 0 80px rgba(0,0,0,0.95), inset 0 0 40px rgba(0,255,178,0.03)' }}>
            <div className="p-10 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FFB2', boxShadow: '0 0 8px #00FFB2' }} />
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: '#00FFB2' }}>SEQ_01 // PHILOSOPHY</span>
              </div>

              <h2 className="font-heading text-5xl md:text-7xl text-white uppercase leading-none mb-6 drop-shadow-[0_2px_20px_rgba(0,0,0,1)]">
                Absolute<br />Order.
              </h2>

              <p className="text-gray-300 text-sm font-body leading-relaxed tracking-wide">
                True engineering is the conquest of chaos. Imposing mathematical will upon raw data, constructing architectures that withstand entropy. Every system I build carries one directive: eliminate noise, amplify signal.
              </p>

              <div className="mt-8 pt-5 border-t border-white/10 grid grid-cols-3 gap-4">
                {[
                  { v: "∞", l: "Entropy Target", col: '#00FFB2' },
                  { v: "1.0", l: "Precision Floor", col: '#FF7000' },
                  { v: "0", l: "Tolerance For Noise", col: '#FF2D78' },
                ].map(({ v, l, col }) => (
                  <div key={l} className="text-center">
                    <div className="text-2xl font-heading font-black" style={{ color: col }}>{v}</div>
                    <div className="text-[8px] tracking-widest text-gray-500 uppercase mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 3. SEQ_02 EXPERIENCE ══════════════════════════════ */}
        <div ref={swordRef} className="absolute bottom-20 right-10 md:right-20 max-w-xl pointer-events-auto">
          <div className="bg-[#06060C]/88 backdrop-blur-xl border border-white/10 border-r-2 text-right" style={{ borderRightColor: '#FF2D78', boxShadow: '0 0 80px rgba(0,0,0,0.95), inset 0 0 40px rgba(255,45,120,0.04)' }}>
            <div className="p-10 md:p-12">
              <div className="flex items-center justify-end gap-3 mb-3">
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: '#FF2D78' }}>SEQ_02 // FIELD RECORD</span>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF2D78', boxShadow: '0 0 8px #FF2D78' }} />
              </div>

              <div className="text-[9px] tracking-[0.3em] font-bold bg-white/5 inline-block px-3 py-1 border mb-4" style={{ color: '#FF2D78', borderColor: 'rgba(255,45,120,0.2)' }}>
                [ AI ENGINEER // 2023 → 2024 ]
              </div>

              <h2 className="font-heading text-4xl md:text-6xl text-white uppercase mt-2 mb-6 leading-none drop-shadow-[0_2px_20px_rgba(0,0,0,1)]">
                Bank of<br />Georgia
              </h2>

              <div className="flex flex-col gap-2 mb-6 text-right">
                {[
                  "Elevated NLU chatbot accuracy by +15% via precision LM engineering",
                  "Dual-language NLP pipelines: Georgian + English (MongoDB + AWS)",
                  "Production ML deployment under strict financial-sector SLAs",
                  "Served 100K+ users via scalable AWS Lambda architecture",
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-end gap-2">
                    <span className="text-xs text-gray-300 font-body leading-relaxed">{item}</span>
                    <span className="text-[#FF2D78] mt-0.5 flex-shrink-0">◈</span>
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-white/10">
                <div className="text-[9px] tracking-widest text-gray-500 uppercase mb-3">[ STACK DEPLOYED ]</div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {["PyTorch", "FastAPI", "AWS Lambda", "MongoDB", "Python"].map(s => (
                    <span key={s} className="text-[10px] tracking-[0.1em] font-bold uppercase text-white bg-white/5 px-2.5 py-1 border border-white/10">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 4. SEQ_03 EDUCATION ═══════════════════════════════ */}
        <div ref={academyRef} className="absolute top-1/2 -translate-y-1/2 left-10 md:left-20 max-w-lg pointer-events-auto">
          <div className="bg-[#06060C]/88 backdrop-blur-xl border border-white/10 border-l-2" style={{ borderLeftColor: '#9945FF', boxShadow: '0 0 80px rgba(0,0,0,0.95), inset 0 0 40px rgba(153,69,255,0.04)' }}>
            <div className="p-10 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#9945FF', boxShadow: '0 0 8px #9945FF' }} />
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: '#9945FF' }}>SEQ_03 // FOUNDATION</span>
              </div>

              <div className="text-[9px] tracking-[0.3em] font-bold bg-white/5 inline-block px-3 py-1 border mb-4" style={{ color: '#9945FF', borderColor: 'rgba(153,69,255,0.2)' }}>
                [ M.Sc. DATA SCIENCE // 2026 ]
              </div>

              <h2 className="font-heading text-5xl md:text-6xl text-white uppercase mt-2 mb-6 leading-none drop-shadow-[0_2px_20px_rgba(0,0,0,1)]">
                HAW Kiel /<br />Greifswald
              </h2>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {["Machine Learning", "Cloud Architecture", "Multivariate Calculus", "Neural Networks", "Deep Learning", "Data Engineering"].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#9945FF' }} />
                    <span className="text-[11px] tracking-[0.15em] text-gray-400 uppercase">{s}</span>
                  </div>
                ))}
              </div>

              <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[9px] tracking-widest text-gray-500 uppercase mb-1">Thesis Direction</div>
                  <div className="text-xs text-white font-body">Advanced Neural Architecture Design</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] tracking-widest text-gray-500 uppercase mb-1">Languages</div>
                  <div className="text-xs text-white font-body">EN C1 · DE B2 · RU Native</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 5. SEQ_04 PROJECTS ════════════════════════════════ */}
        <div ref={logicRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 md:px-10 pointer-events-auto">
          <div className="bg-[#06060C]/88 backdrop-blur-xl border border-white/10" style={{ boxShadow: '0 0 80px rgba(0,0,0,0.95)' }}>
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-[1px] bg-brand-gold" />
                  <span className="text-[10px] tracking-[0.4em] text-brand-gold uppercase">SEQ_04 // DEPLOYED SYSTEMS</span>
                </div>
                <a href="https://github.com/Metaphysicist1" target="_blank" rel="noreferrer" className="text-[9px] tracking-widest text-gray-500 uppercase border border-white/10 px-3 py-1 hover:border-brand-gold hover:text-brand-gold transition-all">
                  VIEW ALL ON GITHUB →
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    id: "01", t: "Unimate", tag: "FLAGSHIP",
                    s: "LangGraph · RAG · LLMs · Docker",
                    d: "AI multi-agent system for German university admissions and TestDaF/Goethe language exam preparation. Real-time knowledge synthesis across institutional data.",
                    metric: "Multi-Agent", metricL: "Architecture",
                    col: "#00FFB2", href: "https://github.com/Metaphysicist1",
                  },
                  {
                    id: "02", t: "Diamond API", tag: "PRODUCTION",
                    s: "XGBoost · FastAPI · Scikit-learn",
                    d: "90% deterministic pricing accuracy on gemological datasets. Sub-50ms inference in production via optimised feature pipelines.",
                    metric: "90%", metricL: "Price Accuracy",
                    col: "#FF7000", href: "https://github.com/Metaphysicist1/Diamond-Price-Prediction",
                  },
                  {
                    id: "03", t: "PneuNet", tag: "RESEARCH",
                    s: "PyTorch · CNN · Medical Imaging",
                    d: "Pneumonia detection API trained on clinical X-ray datasets. High-sensitivity classification deployed across diagnostic workflows.",
                    metric: "CNN", metricL: "Clinical Grade",
                    col: "#9945FF", href: "https://github.com/Metaphysicist1/PneuNet",
                  },
                  {
                    id: "04", t: "Supply AI Agent", tag: "PRODUCTION",
                    s: "Python · LLM · LangChain · FastAPI",
                    d: "Professional supply chain optimisation agent using LLM-driven reasoning for demand forecasting and inventory intelligence.",
                    metric: "LLM", metricL: "Reasoning Core",
                    col: "#FF2D78", href: "https://github.com/Metaphysicist1/Supply-AI-Agent",
                  },
                  {
                    id: "05", t: "CoverBot", tag: "DEPLOYED",
                    s: "RAG · Python · Vector DB",
                    d: "RAG-based document intelligence interface for rapid insight retrieval from large knowledge bases. Semantic search with contextual synthesis.",
                    metric: "RAG", metricL: "Retrieval Engine",
                    col: "#3E48FF", href: "https://github.com/Metaphysicist1/CoverBot",
                  },
                  {
                    id: "06", t: "Credit Score", tag: "WEBAPP",
                    s: "Scikit-learn · Streamlit · XGBoost",
                    d: "Interactive web application for real-time credit scoring. Enter customer parameters and receive instant ML-driven risk assessment.",
                    metric: "Real-time", metricL: "Risk Scoring",
                    col: "#FF7000", href: "https://github.com/Metaphysicist1/Credit_Score_Classifier",
                  },
                ].map(({ id, t, tag, s, d, metric, metricL, col, href }) => (
                  <a key={id} href={href} target="_blank" rel="noreferrer"
                    className="group cursor-crosshair border border-white/10 p-5 transition-all hover:border-white/20 flex flex-col"
                    style={{ background: `${col}06` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-[9px] tracking-widest font-mono font-bold" style={{ color: col }}>[ {tag} ]</div>
                      <div className="text-right">
                        <div className="text-lg font-heading font-black" style={{ color: col }}>{metric}</div>
                        <div className="text-[8px] tracking-widest text-gray-600 uppercase">{metricL}</div>
                      </div>
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl text-white mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] group-hover:opacity-80 transition-opacity">{t}</h3>
                    <div className="text-[9px] tracking-widest font-bold mb-3 uppercase" style={{ color: col }}>{s}</div>
                    <p className="text-xs text-gray-400 leading-relaxed font-body flex-1">{d}</p>
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1">
                      <div className="w-2 h-[1px] flex-shrink-0" style={{ background: col }} />
                      <span className="text-[8px] tracking-widest text-gray-600 uppercase">View on GitHub</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 6. SEQ_05 ARSENAL ════════════════════════════════ */}
        <div ref={arsenalRef} className="absolute top-1/2 -translate-y-1/2 right-10 md:right-20 max-w-md pointer-events-auto">
          <div className="bg-[#06060C]/88 backdrop-blur-xl border border-white/10 border-r-2 text-right" style={{ borderRightColor: '#00FFB2', boxShadow: '0 0 80px rgba(0,0,0,0.95), inset 0 0 40px rgba(0,255,178,0.03)' }}>
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-end gap-3 mb-6">
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: '#00FFB2' }}>SEQ_05 // CORE ARSENAL</span>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FFB2', boxShadow: '0 0 8px #00FFB2' }} />
              </div>

              <div className="flex flex-col gap-5">
                {[
                  { cat: "AI / ML", col: "#00FFB2", items: ["PyTorch", "TensorFlow", "XGBoost", "Scikit-learn", "LangChain", "LangGraph"] },
                  { cat: "ENGINEERING", col: "#FF7000", items: ["Python", "FastAPI", "Flask", "Streamlit", "React", "Next.js"] },
                  { cat: "CLOUD & DATA", col: "#9945FF", items: ["AWS", "Azure", "Docker", "PostgreSQL", "MongoDB"] },
                  { cat: "ANALYSIS", col: "#FF2D78", items: ["Power BI", "Pandas", "NumPy", "Jupyter"] },
                ].map(({ cat, col, items }) => (
                  <div key={cat}>
                    <div className="text-[9px] tracking-widest mb-2 font-bold uppercase" style={{ color: col }}>[ {cat} ]</div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {items.map(item => (
                        <span key={item} className="text-[10px] tracking-[0.1em] font-bold uppercase text-white bg-white/5 px-2.5 py-1 border border-white/10">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 7. SEQ_06 CREDENTIALS ═════════════════════════════ */}
        <div ref={proofRef} className="absolute top-16 right-10 md:right-20 max-w-xl pointer-events-auto">
          <div className="bg-[#06060C]/88 backdrop-blur-xl border border-white/10 relative" style={{ boxShadow: '0 0 80px rgba(0,0,0,0.95)' }}>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: '#FF7000' }} />

            <div className="p-8 md:p-10">
              <div className="flex items-center justify-end gap-3 mb-6 border-b border-white/10 pb-5">
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: '#FF7000' }}>SEQ_06 // VERIFICATION</span>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF7000', boxShadow: '0 0 8px #FF7000' }} />
              </div>

              <div className="flex flex-col gap-4 mb-6">
                {[
                  { title: "ML Specialty", issuer: "Amazon Web Services", date: "Feb 2025", status: "CERTIFIED", col: "#FF7000" },
                  { title: "Mathematics for ML & Data Science", issuer: "DeepLearning.AI", date: "2024", status: "CERTIFIED", col: "#00FFB2" },
                  { title: "Azure Data Scientist Associate", issuer: "Microsoft Azure", date: "2024", status: "CERTIFIED", col: "#3E48FF" },
                ].map(({ title, issuer, date, status, col }) => (
                  <div key={title} className="bg-white/[0.03] p-4 border border-white/10 border-r-2 flex items-center gap-4" style={{ borderRightColor: col }}>
                    <div className="flex-1">
                      <div className="text-[9px] tracking-widest font-bold mb-1 uppercase" style={{ color: col }}>[ {issuer} ]</div>
                      <div className="font-heading text-sm md:text-base text-white font-bold leading-tight">{title}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[9px] tracking-[0.2em] uppercase font-bold bg-black/60 px-2 py-1 border mb-1" style={{ color: col, borderColor: `${col}40` }}>◉ {status}</div>
                      <div className="text-[8px] tracking-widest text-gray-600">{date}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-[9px] tracking-widest text-gray-500 uppercase mb-3">[ GITHUB ACHIEVEMENTS ]</div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {["Pull Shark ×2", "Quickdraw", "YOLO"].map(badge => (
                    <span key={badge} className="text-[9px] tracking-[0.15em] font-bold uppercase px-3 py-1 border" style={{ color: '#FF7000', borderColor: 'rgba(255,112,0,0.3)', background: 'rgba(255,112,0,0.06)' }}>{badge}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ 8. SEQ_07 CONTACT ═════════════════════════════════ */}
        <div ref={singularityRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full max-w-4xl pointer-events-auto">
          <div className="bg-[#06060C]/90 backdrop-blur-xl border border-white/20 w-full" style={{ boxShadow: '0 0 120px rgba(0,0,0,0.98), inset 0 0 60px rgba(153,69,255,0.03)' }}>
            <div className="p-10 md:p-14">
              <div className="text-[10px] tracking-[0.5em] text-brand-gold uppercase mb-6 flex items-center justify-center gap-4">
                <span className="w-12 h-[1px] bg-brand-gold" />
                TRANSMISSION SECURE
                <span className="w-12 h-[1px] bg-brand-gold" />
              </div>

              <h1
                className="text-5xl md:text-8xl font-heading font-black text-white uppercase tracking-tighter text-center drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-10"
                style={{ background: 'linear-gradient(135deg, #FF2D78 0%, #9945FF 50%, #3E48FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                Initiate<br />Contact
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8 border-t border-b border-white/10 py-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-gray-500 tracking-widest uppercase">[ Location ]</span>
                  <span className="text-sm font-bold tracking-[0.2em] text-white uppercase">Germany</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-gray-500 tracking-widest uppercase">[ Availability ]</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
                    <span className="text-sm font-bold tracking-[0.15em] text-[#00FFB2] uppercase">Open · 20h/week</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-gray-500 tracking-widest uppercase">[ Secure Comm ]</span>
                  <a href="mailto:edgarabasov1@gmail.com" className="text-sm font-bold tracking-[0.1em] text-brand-gold hover:text-white transition-colors uppercase">edgarabasov1@gmail.com</a>
                </div>
              </div>

              <div className="flex gap-10 justify-center">
                {[
                  { label: "GitHub", href: "https://github.com/Metaphysicist1" },
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/edgar-abasov/" },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="group flex items-center gap-3 cursor-crosshair">
                    <div className="w-4 h-[1px] bg-white group-hover:bg-brand-gold transition-all" />
                    <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-white group-hover:text-brand-gold transition-all">{label}</span>
                    <div className="w-4 h-[1px] bg-white group-hover:bg-brand-gold transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
