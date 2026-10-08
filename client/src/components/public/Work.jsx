import { useEffect, useState } from "react";
import { ArrowUpRight, Github, X } from "lucide-react";
import Reveal from "./Reveal";
import { getProjects } from "../../api/projectApi";

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    getProjects()
      .then((res) => {
        const data = res.data?.projects || res.data || [];
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Projects load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActiveProject(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!loading && projects.length === 0) return null;

  return (
    <section id="work" className="mx-auto max-w-5xl px-6 pb-24 text-center">
      <Reveal>
        <h2 className="mb-3 font-pixel text-2xl text-[var(--accent-cyan)] sm:text-3xl">
          WHERE DID MY TIME GO?
        </h2>
        <p className="mx-auto mb-12 max-w-xl font-mono text-sm text-[var(--text-muted)]">
          Full-stack builds, backend systems, and things shipped from scratch.
        </p>
      </Reveal>

      {loading ? (
        <p className="font-mono text-sm text-[var(--text-muted)]">Loading...</p>
      ) : (
        <div className="grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, idx) => (
            <Reveal key={p._id} delay={idx * 70}>
              <button
                onClick={() => setActiveProject(p)}
                className="flex h-full w-full flex-col border p-5 text-left transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border-strong)",
                }}
              >
                {p.skills?.[0] && (
                  <span
                    className="mb-3 inline-block w-fit border px-2 py-1 font-pixel text-[8px] uppercase tracking-wide"
                    style={{
                      borderColor: "var(--card-border-strong)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {p.skills[0]}
                  </span>
                )}

                <h3 className="mb-3 font-pixel text-base uppercase text-[var(--accent-cyan)]">
                  {p.title}
                </h3>

                {p.skills?.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {p.skills.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="border px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]"
                        style={{ borderColor: "var(--card-border)" }}
                      >
                        {s}
                      </span>
                    ))}
                    {p.skills.length > 4 && (
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        +{p.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <p className="mb-4 flex-1 font-mono text-xs leading-relaxed text-[var(--text-secondary)]">
                  {p.description?.length > 110
                    ? p.description.slice(0, 110) + "…"
                    : p.description}
                </p>

                <span
                  className="mt-auto flex items-center gap-1.5 font-pixel text-[8px] uppercase"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  view details <ArrowUpRight size={11} />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {/* Full-details modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveProject(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto border p-6 text-left"
            style={{
              backgroundColor: "var(--bg)",
              borderColor: "var(--accent-cyan)",
            }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="font-pixel text-lg uppercase text-[var(--accent-cyan)]">
                {activeProject.title}
              </h3>
              <button
                onClick={() => setActiveProject(null)}
                className="shrink-0 border p-1.5"
                style={{
                  borderColor: "var(--card-border-strong)",
                  color: "var(--text-secondary)",
                }}
              >
                <X size={14} />
              </button>
            </div>

            {activeProject.image && (
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="mb-4 w-full rounded border object-cover"
                style={{ borderColor: "var(--card-border)" }}
              />
            )}

            <p className="mb-5 font-mono text-sm leading-relaxed text-[var(--text-secondary)]">
              {activeProject.description}
            </p>

            {activeProject.skills?.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {activeProject.skills.map((s) => (
                  <span
                    key={s}
                    className="border px-2 py-1 font-pixel text-[8px] uppercase"
                    style={{
                      borderColor: "var(--card-border-strong)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              {activeProject.url && (
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 border px-4 py-2.5 font-pixel text-[9px] uppercase"
                  style={{
                    borderColor: "var(--accent-cyan)",
                    color: "var(--accent-cyan)",
                  }}
                >
                  live site <ArrowUpRight size={12} />
                </a>
              )}
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 border px-4 py-2.5 font-pixel text-[9px] uppercase"
                  style={{
                    borderColor: "var(--card-border-strong)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Github size={12} /> github
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
