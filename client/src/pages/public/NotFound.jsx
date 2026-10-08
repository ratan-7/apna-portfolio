import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import CityscapeBackground from "../../components/public/CityscapeBackground";

export default function NotFound() {
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((c) => !c), 550);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 text-[var(--text-primary)]"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Same cityscape background as the main site */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <CityscapeBackground />
      </div>

      <div className="relative z-10 w-full max-w-xl text-center">
        <p className="mb-4 font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-amber)]">
          error // route not found
        </p>

        <h1 className="font-pixel text-6xl leading-none text-[var(--accent-cyan)] sm:text-8xl">
          404
        </h1>

        <h2 className="mt-6 font-pixel text-sm uppercase text-[var(--text-primary)] sm:text-lg">
          GAME OVER
          <span
            className="ml-2 inline-block h-[0.8em] w-[0.4em] translate-y-[2px] bg-[var(--accent-cyan)]"
            style={{ opacity: cursorOn ? 1 : 0 }}
          />
        </h2>

        <div
          className="mx-auto mt-8 max-w-md border px-5 py-4 text-left"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border-strong)",
          }}
        >
          <p className="mb-2 font-pixel text-[8px] uppercase text-[var(--accent-cyan)]">
            sys.log // 404
          </p>
          <p className="font-mono text-xs leading-relaxed text-[var(--text-secondary)]">
            The page you're looking for got lost somewhere in the city. It may
            have been moved, deleted, or never existed.
          </p>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 border px-6 py-3 font-pixel text-[9px] uppercase transition-transform hover:-translate-y-0.5"
          style={{
            backgroundColor: "var(--accent-cyan)",
            borderColor: "var(--accent-cyan)",
            color: "var(--accent-cyan-on)",
          }}
        >
          <Home size={13} /> continue? back to home
        </Link>
      </div>
    </div>
  );
}
