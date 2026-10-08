import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getExperience } from "../../api/experienceApi";
import { formatPeriod } from "../../utils/formatDate";

export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    getExperience()
      .then((res) => {
        const data = res.data?.experience || res.data || [];
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Experience load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  const levels = [...items].reverse();
  const CHAR_LIMIT = 160;

  return (
    <section id="experience" className="mx-auto max-w-3xl px-6 pb-24">
      <Reveal>
        <h2 className="mb-10 font-pixel text-xl text-[var(--accent-cyan)] sm:text-2xl">
          THE GRIND SO FAR
        </h2>
      </Reveal>

      {loading ? (
        <p className="font-mono text-sm text-[var(--text-muted)]">Loading...</p>
      ) : (
        <div className="relative pl-6 sm:pl-8">
          <div
            className="absolute bottom-6 left-0 top-6 w-0 border-l-2 border-dashed"
            style={{ borderColor: "var(--card-border-strong)" }}
          />

          {levels.map((job, i) => {
            const levelNum = levels.length - i;
            const isLong = (job.description?.length || 0) > CHAR_LIMIT;
            const isOpen = expanded[job._id];
            const shownText =
              isLong && !isOpen ? job.description.slice(0, CHAR_LIMIT) + "…" : job.description;

            return (
              <Reveal key={job._id} delay={i * 90}>
                <div className="relative mb-8 last:mb-0">
                  <span
                    className="absolute -left-[29px] top-6 h-2.5 w-2.5 rounded-full sm:-left-[37px]"
                    style={{ backgroundColor: "var(--accent-cyan)" }}
                  />

                  <div
                    className="relative border p-4 pr-16 sm:p-6 sm:pr-20"
                    style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border-strong)" }}
                  >
                    <span
                      className="absolute right-3 top-3 border px-2 py-1 font-pixel text-[8px] uppercase sm:right-4 sm:top-4"
                      style={{
                        backgroundColor: "var(--bg)",
                        borderColor: "var(--accent-cyan)",
                        color: "var(--accent-cyan)",
                      }}
                    >
                      LVL {levelNum}
                    </span>

                    <h3 className="mb-1 font-pixel text-xs uppercase text-[var(--accent-cyan)] sm:text-sm">
                      {job.title}
                    </h3>
                    <p className="mb-1 font-mono text-[10px] text-[var(--text-muted)] sm:text-[11px]">
                      {formatPeriod(job.startDate, job.endDate, job.currentlyWorking).toUpperCase()}
                    </p>
                    <p className="mb-4 font-mono text-[11px] text-[var(--text-tertiary)] sm:text-xs">
                      @ {job.company}
                    </p>

                    <p className="mb-2 font-mono text-[11px] leading-relaxed text-[var(--text-secondary)] sm:text-xs">
                      {shownText}
                    </p>
                    {isLong && (
                      <button
                        onClick={() => setExpanded((prev) => ({ ...prev, [job._id]: !isOpen }))}
                        className="mb-4 flex items-center gap-1 font-pixel text-[8px] uppercase"
                        style={{ color: "var(--accent-cyan)" }}
                      >
                        {isOpen ? "less ▲" : "more ▼"}
                      </button>
                    )}

                    {job.skills?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {job.skills.map((s) => (
                          <span
                            key={s}
                            className="border px-1.5 py-0.5 font-pixel text-[7px] uppercase sm:px-2 sm:py-1 sm:text-[8px]"
                            style={{ borderColor: "var(--card-border-strong)", color: "var(--text-secondary)" }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}
