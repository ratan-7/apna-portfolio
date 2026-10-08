import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { getProfile } from "../../api/profileApi";

const SECTIONS = [
  { id: "top", label: "intro" },
  { id: "experience", label: "experience" },
  { id: "education", label: "education" },
  { id: "systems", label: "systems" },
  { id: "stack", label: "skills" },
  { id: "work", label: "work" },
  { id: "contact", label: "contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("intro");
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    getProfile()
      .then((res) => res.data?.name && setName(res.data.name))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = SECTIONS.find((s) => s.id === entry.target.id);
            if (match) setActive(match.label);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    const observedIds = new Set();
    function tryObserveAll() {
      SECTIONS.forEach((s) => {
        if (observedIds.has(s.id)) return;
        const el = document.getElementById(s.id);
        if (el) {
          observer.observe(el);
          observedIds.add(s.id);
        }
      });
    }
    tryObserveAll();
    const mo = new MutationObserver(() => {
      tryObserveAll();
      if (observedIds.size === SECTIONS.length) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-20 border-b-2 border-dashed backdrop-blur-md"
      style={{
        backgroundColor: "var(--nav-bg)",
        borderColor: "var(--card-border-strong)",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        {/* Desktop — full tab row */}
        <div className="hidden shrink-0 items-center gap-1.5 overflow-x-auto sm:flex">
          {SECTIONS.map((s) => {
            const isActive = active === s.label;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="whitespace-nowrap border px-2.5 py-1.5 font-pixel text-[10px] uppercase tracking-wide transition-colors"
                style={{
                  borderColor: isActive ? "var(--accent-cyan)" : "transparent",
                  backgroundColor: isActive
                    ? "var(--card-bg-hover)"
                    : "transparent",
                  color: isActive ? "var(--accent-cyan)" : "var(--text-muted)",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:hidden">
          <span
            className="border px-3 py-1.5 font-pixel text-[9px] uppercase"
            style={{
              borderColor: "var(--accent-cyan)",
              backgroundColor: "var(--card-bg-hover)",
              color: "var(--accent-cyan)",
            }}
          >
            {active}
          </span>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-7 w-7 items-center justify-center border"
            style={{
              borderColor: "var(--card-border-strong)",
              color: "var(--text-primary)",
            }}
          >
            {menuOpen ? <X size={13} /> : <Menu size={13} />}
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {name && (
            <span className="hidden font-pixel text-[9px] text-[var(--text-tertiary)] sm:inline">
              {name}
            </span>
          )}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="border p-1.5 text-[var(--text-primary)]"
            style={{ borderColor: "var(--card-border-strong)" }}
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="flex flex-wrap gap-2 border-t px-4 py-3 sm:hidden"
          style={{
            borderColor: "var(--card-border-strong)",
            backgroundColor: "var(--bg)",
          }}
        >
          {SECTIONS.map((s) => {
            const isActive = active === s.label;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="border px-2.5 py-1.5 font-pixel text-[9px] uppercase"
                style={{
                  borderColor: isActive
                    ? "var(--accent-cyan)"
                    : "var(--card-border-strong)",
                  backgroundColor: isActive
                    ? "var(--card-bg-hover)"
                    : "transparent",
                  color: isActive
                    ? "var(--accent-cyan)"
                    : "var(--text-secondary)",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
