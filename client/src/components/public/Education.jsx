import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import Reveal from "./Reveal";
import { getEducation } from "../../api/educationApi";
import { formatPeriod } from "../../utils/formatDate";

export default function Education() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEducation()
      .then((res) => {
        const data = res.data?.education || res.data || [];
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Education load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section id="education" className="mx-auto max-w-4xl px-6 pb-24">
      <Reveal>
        <h2 className="mb-2 font-pixel text-xl text-[var(--accent-cyan)] sm:text-2xl">
          SCHOOL OF HARD CODES
        </h2>
        <p className="mb-10 font-mono text-xs text-[var(--text-muted)]">
          // xp gained along the way
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid gap-5 sm:grid-cols-2">
          {loading ? (
            <p className="font-mono text-sm text-[var(--text-muted)]">
              Loading...
            </p>
          ) : (
            items.map((edu, idx) => (
              <div
                key={edu._id}
                className="border p-5"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border-strong)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border"
                    style={{
                      borderColor: "var(--card-border-strong)",
                      color: "var(--accent-cyan-light)",
                    }}
                  >
                    <GraduationCap size={16} />
                  </span>
                  <div className="flex-1">
                    <span
                      className="mb-2 inline-block border px-2 py-0.5 font-pixel text-[8px] uppercase"
                      style={{
                        borderColor: "var(--accent-cyan)",
                        color: "var(--accent-cyan)",
                      }}
                    >
                      LVL {items.length - idx}
                    </span>
                    <h3 className="font-pixel text-xs uppercase leading-relaxed text-[var(--text-primary)] sm:text-sm">
                      {edu.degree} {edu.field && `— ${edu.field}`}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-[var(--text-tertiary)]">
                      {edu.school}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-[var(--text-muted)]">
                      <span>
                        {formatPeriod(
                          edu.startDate,
                          edu.endDate,
                          edu.currentlyWorking,
                        )}
                      </span>
                      {edu.grade && (
                        <>
                          <span>·</span>
                          <span style={{ color: "var(--accent-emerald)" }}>
                            {edu.grade}
                          </span>
                        </>
                      )}
                    </div>
                    {edu.description && (
                      <p
                        className="mt-3 font-mono text-xs leading-relaxed text-[var(--text-secondary)]"
                        style={{
                          textAlign: "justify",
                          textJustify: "inter-word",
                          hyphens: "auto",
                        }}
                      >
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Reveal>
    </section>
  );
}
