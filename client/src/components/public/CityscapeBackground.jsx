import { useEffect, useRef } from "react";

/* Retro pixel-art city skyline silhouette — halka/subtle rakha hai
   taaki content clearly readable rahe. Glowing window dots flicker
   karte hain, lekin low opacity me. */
export default function CityscapeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width,
      height,
      dpr,
      buildings,
      windows,
      raf,
      t = 0;

    function getColor(name) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    }

    function hexToRgba(hex, alpha) {
      const h = hex.replace("#", "");
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function makeBuildings() {
      buildings = [];
      let x = -40;
      while (x < width + 60) {
        const w = 50 + Math.random() * 70;
        const h = 80 + Math.random() * (height * 0.3);
        buildings.push({ x, w, h });
        x += w + (4 + Math.random() * 10);
      }
      windows = [];
      buildings.forEach((b) => {
        const cols = Math.max(2, Math.floor(b.w / 14));
        const rows = Math.max(3, Math.floor(b.h / 16));
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            if (Math.random() < 0.3) {
              windows.push({
                x: b.x + 6 + c * 14,
                y: height - b.h + 10 + r * 16,
                phase: Math.random() * Math.PI * 2,
                speed: 0.4 + Math.random() * 0.8,
              });
            }
          }
        }
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeBuildings();
    }

    function draw() {
      t += 0.02;
      const window_ = getColor("--accent-amber") || "#facc15";

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "rgba(249, 115, 22, 0.05)";
      buildings.forEach((b) => {
        ctx.fillRect(b.x, height - b.h, b.w, b.h);
      });

      windows.forEach((w) => {
        const flicker = 0.15 + 0.3 * Math.abs(Math.sin(t * w.speed + w.phase));
        ctx.fillStyle = window_.startsWith("#")
          ? hexToRgba(window_, flicker)
          : window_;
        ctx.fillRect(w.x, w.y, 2.5, 2.5);
      });

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.6 }}
    />
  );
}
