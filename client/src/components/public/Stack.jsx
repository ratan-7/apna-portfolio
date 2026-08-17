import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getSkills } from "../../api/skillApi";
import { Code2 } from "lucide-react";

export default function Stack() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then((res) => {
        const data = res.data?.skills || res.data || [];
        setSkills(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Skills load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && skills.length === 0) return null;

  const grouped = skills.reduce((acc, skill) => {
    const key = skill.catagory || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  Object.values(grouped).forEach((arr) =>
    arr.sort((a, b) => (a.Order || 0) - (b.Order || 0))
  );

  const categories = Object.entries(grouped);

  return (
    <section id="stack" className="mx-auto max-w-4xl px-6 pb-20">
      <Reveal>
        <h2 className="mb-6 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[var(--text-muted)]">
                    <Code2 size={14} className="text-[var(--accent-cyan)]" /> tech stack
                </h2>
      </Reveal>

      {loading ? (
        <p className="font-mono text-sm text-[var(--text-muted)]">Loading...</p>
      ) : (
        <div className="flex flex-col">
          {categories.map(([category, items], idx) => (
            <Reveal key={category} delay={idx * 70}>
              <div
                className="py-6 first:pt-0"
                style={{
                  borderTop: idx === 0 ? "none" : "1px solid var(--card-border)",
                }}
              >
                <p className="mb-4 flex items-center gap-3 font-mono text-sm text-[var(--text-muted)]">
                  <span className="text-[var(--accent-cyan)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {category}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {items.map((skill) => {
                    const isImageIcon = skill.icon && /^https?:\/\//.test(skill.icon);
                    return (
                      <span
                        key={skill._id}
                        className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm text-[var(--text-secondary)]"
                        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
                      >
                        {isImageIcon ? (
                          <img src={skill.icon} alt="" className="h-4 w-4 shrink-0 object-contain" />
                        ) : (
                          <span
                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                            style={{ backgroundColor: "var(--card-bg-hover)", color: "var(--accent-cyan-light)" }}
                          >
                            {skill.name?.[0]?.toUpperCase() || "?"}
                          </span>
                        )}
                        {skill.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}