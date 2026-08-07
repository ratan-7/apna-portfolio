import { useEffect, useRef } from "react";

/* Signature background — live traffic heatmap grid. Ab dono themes
   (dark/light) ke hisaab se apne colors adjust karta hai — theme
   change hone pe canvas turant naye colors se dobara draw hota hai. */
export default function GridCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width, height, dpr;
    let cellSize = 44;
    let cols, rows;
    let intensities;
    let scanY = 0;
    let raf;

    function isLight() {
      return document.documentElement.getAttribute("data-theme") === "light";
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / cellSize) + 1;
      rows = Math.ceil(height / cellSize) + 1;
      intensities = new Float32Array(cols * rows);
    }

    function spike() {
      const cx = Math.floor(Math.random() * cols);
      const cy = Math.floor(Math.random() * rows);
      const power = 0.55 + Math.random() * 0.45;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const x = cx + dx;
          const y = cy + dy;
          if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
          const falloff = dx === 0 && dy === 0 ? 1 : 0.35;
          const idx = y * cols + x;
          intensities[idx] = Math.min(1, intensities[idx] + power * falloff);
        }
      }
    }

    function draw() {
      const light = isLight();
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = light ? "rgba(23, 21, 18, 0.05)" : "rgba(148, 197, 255, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize + 0.5, 0);
        ctx.lineTo(x * cellSize + 0.5, height);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize + 0.5);
        ctx.lineTo(width, y * cellSize + 0.5);
        ctx.stroke();
      }

      const cellAlpha = light ? 0.12 : 0.22;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const v = intensities[idx];
          if (v < 0.02) continue;

          const px = x * cellSize;
          const py = y * cellSize;
          const hot = v > 0.6;
          const r = hot ? (light ? 180 : 251) : light ? 20 : 56;
          const g = hot ? (light ? 90 : 191) : light ? 110 : 189;
          const b = hot ? (light ? 45 : 36) : light ? 100 : 248;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${v * cellAlpha})`;
          ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);

          if (v > 0.7) {
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(v - 0.7) * (light ? 0.6 : 0.9)})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 1.5, py + 1.5, cellSize - 3, cellSize - 3);
          }

          intensities[idx] *= 0.945;
        }
      }

      if (!reduceMotion) {
        const scanColor = light ? "14, 116, 144" : "56, 189, 248";
        const grad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
        grad.addColorStop(0, `rgba(${scanColor}, 0)`);
        grad.addColorStop(0.5, `rgba(${scanColor}, ${light ? 0.04 : 0.05})`);
        grad.addColorStop(1, `rgba(${scanColor}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 60, width, 120);

        ctx.strokeStyle = `rgba(${scanColor}, ${light ? 0.18 : 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();

        scanY += 0.6;
        if (scanY > height + 60) scanY = -60;
      }
    }

    function step() {
      if (!reduceMotion && Math.random() < 0.5) spike();
      draw();
      raf = requestAnimationFrame(step);
    }

    resize();
    if (reduceMotion) {
      for (let i = 0; i < 12; i++) spike();
      draw();
    } else {
      step();
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
