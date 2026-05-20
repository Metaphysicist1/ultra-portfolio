"use client";
import { useEffect, useRef } from "react";

export default function CosmicSpace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const nodes: any[] = [];
    const numNodes = 150; // Fewer dots, but more complex shapes

    // Multi-chromatic cosmic colors (Cyan, Purple, Gold, Magenta)
    const colors = ["#00F0FF", "#8A2BE2", "#FF00FF", "#E4FF1A"];

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * 2000,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 3 + 1,
      });
    }

    let animationFrameId: number;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    const render = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      scrollVelocity += delta * 0.08;
      scrollVelocity *= 0.85; // Cosmic friction
      lastScrollY = currentScrollY;

      // Deep space void with slight trail effect
      ctx.fillStyle = "rgba(5, 2, 10, 0.3)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw Nebulas (Shapeless Cosmic Dust)
      const nebulaGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, width);
      nebulaGradient.addColorStop(0, "rgba(138, 43, 226, 0.05)"); // Purple core
      nebulaGradient.addColorStop(0.5, "rgba(0, 240, 255, 0.02)"); // Cyan mid
      nebulaGradient.addColorStop(1, "transparent");
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, width, height);

      nodes.forEach((node, i) => {
        // Z-axis movement (Warp drive)
        node.z -= 3 + Math.abs(scrollVelocity);

        if (node.z <= 0) {
          node.x = Math.random() * width - width / 2;
          node.y = Math.random() * height - height / 2;
          node.z = 2000;
        }

        const k = 256.0 / node.z;
        const px = node.x * k + cx;
        const py = node.y * k + cy;
        const size = (1 - node.z / 2000) * node.radius * k * 0.1;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          // Draw Glowing Orbs
          ctx.beginPath();
          ctx.arc(px, py, size > 0 ? size : 0, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.shadowBlur = size * 5;
          ctx.shadowColor = node.color;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Form Constellations (Shapefull networks)
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j];
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dz = node.z - other.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 150) {
              const pk = 256.0 / other.z;
              const ox = other.x * pk + cx;
              const oy = other.y * pk + cy;

              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(ox, oy);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1500})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none mix-blend-screen"
    />
  );
}
