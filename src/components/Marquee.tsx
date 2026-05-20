export default function Marquee() {
  const techStack = [
    "Python",
    "LangGraph",
    "RAG",
    "LLM Agents",
    "Docker",
    "FastAPI",
    "AWS (SageMaker)",
    "PyTorch",
    "MongoDB",
    "PostgreSQL",
    "XGBoost",
  ];

  return (
    <section className="bg-brand-neon py-6 overflow-hidden w-full rotate-[-2deg] scale-110 translate-y-12 z-20 relative border-y-4 border-black">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...techStack, ...techStack, ...techStack].map((tech, index) => (
          <span
            key={index}
            className="text-black font-mono font-bold text-3xl md:text-5xl uppercase mx-8 tracking-wider"
          >
            [{tech}] <span className="mx-8 text-black/40">+++</span>
          </span>
        ))}
      </div>
    </section>
  );
}
