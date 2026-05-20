import BentoTilt from "./ui/BentoTilt";

export default function Projects() {
  return (
    <section className="bg-black py-32 px-8 min-h-screen text-white border-t border-brand-glass relative font-mono">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="font-mono text-xl md:text-3xl mb-16 text-brand-neon border-b border-brand-neon/20 pb-4 inline-block">
          &gt; ls -la /projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          {/* Unimate */}
          <BentoTilt className="md:col-span-2 relative rounded-xl overflow-hidden border border-brand-neon/30 bg-black group hover:border-brand-neon transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-6 right-6 text-brand-neon font-mono text-sm border border-brand-neon px-2 py-1">
              ONGOING
            </div>
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="font-heading text-4xl uppercase text-white mb-2">
                unimate
              </h3>
              <p className="text-brand-matrix mb-4">
                LangGraph + RAG + Docker + FastAPI
              </p>
              <p className="font-mono text-gray-400 mt-2 max-w-lg text-sm leading-relaxed">
                Multi-agent system for German Exam Prep. Built using official
                Goethe/TestDaF materials with Groq LLMs.
              </p>
            </div>
          </BentoTilt>

          {/* CoverBot */}
          <BentoTilt className="relative rounded-xl overflow-hidden border border-brand-glass bg-zinc-950 group hover:border-brand-matrix transition-colors">
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="font-heading text-2xl uppercase">CoverBot</h3>
              <p className="text-brand-neon text-xs mt-1 mb-3">
                Gemini API / Streamlit
              </p>
              <p className="font-mono text-gray-400 mt-2 text-sm">
                Production RAG chatbot for interactive document querying.
              </p>
            </div>
          </BentoTilt>

          {/* PneuNet */}
          <BentoTilt className="relative rounded-xl overflow-hidden border border-brand-glass bg-zinc-950 group hover:border-brand-matrix transition-colors">
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="font-heading text-2xl uppercase">PneuNet</h3>
              <p className="text-brand-neon text-xs mt-1 mb-3">
                PyTorch / CNN / Docker
              </p>
              <p className="font-mono text-gray-400 mt-2 text-sm">
                Medical Image Classification API served via FastAPI.
              </p>
            </div>
          </BentoTilt>

          {/* Diamond Price */}
          <BentoTilt className="md:col-span-2 relative rounded-xl overflow-hidden border border-brand-glass bg-black group hover:border-brand-neon transition-colors">
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="font-heading text-3xl uppercase text-white">
                Diamond Price API
              </h3>
              <p className="text-brand-matrix text-sm mt-1 mb-4">
                XGBoost / Flask / Docker
              </p>
              <p className="font-mono text-gray-400 mt-2 text-sm max-w-md">
                Scalable ML architecture achieving 90% accuracy in diamond price
                prediction. Fully containerized and deployed.
              </p>
            </div>
          </BentoTilt>
        </div>
      </div>
    </section>
  );
}
