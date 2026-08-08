import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { getProfile } from "../../api/profileApi";

export default function Footer() {
  const [name, setName] = useState("");

  useEffect(() => {
    getProfile()
      .then((res) => setName(res.data?.name || "Ratan Mahata"))
      .catch(() => { });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t px-6 py-8" style={{ borderColor: "var(--card-border)" }}>
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-xs text-[var(--text-muted)]">
          <span className="relative top-[3px]">©</span>{" "}
          {new Date().getFullYear()} {name}. Built with React + Tailwind.
        </p>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--accent-cyan-light)]"
        >
          back to top <ArrowUp size={12} />
        </button>
      </div>
    </footer >
  );
}
