import { useEffect, useState } from "react";
import { Terminal, Home, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { getProfile } from "../../api/profileApi";

const SECTIONS = [
  { id: "top", label: "home" },
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "education", label: "education" },
  { id: "systems", label: "systems" },
  { id: "work", label: "work" },
  { id: "stack", label: "stack" },
  { id: "contact", label: "contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [name, setName] = useState("portfolio");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    getProfile()
      .then((res) => {
        if (res.data?.name) {
          setName(res.data.name.toLowerCase().replace(/\s+/g, "-"));
        }
      })
      .catch(() => { });
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
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
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

    const mutationObserver = new MutationObserver(() => {
      tryObserveAll();
      if (observedIds.size === SECTIONS.length) {
        mutationObserver.disconnect();
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="sticky top-0 z-20 border-b backdrop-blur-md"
      style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--card-border)" }}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <button
          onClick={() => scrollTo("top")}
          className="flex items-center gap-2 font-pixel text-sm tracking-wide text-[var(--accent-cyan-light)]"
        >
          <Terminal size={14} />
          ~/{name}
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollTo("top")}
            className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent-cyan-light)]"
          >
            <Home size={13} />
            home
          </button>

          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-emerald)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-emerald)]" />
            </span>
            {active}
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border p-1.5 text-[var(--text-primary)] transition-colors hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]"
            style={{ borderColor: "var(--card-border)" }}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
