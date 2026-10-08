import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getSkills } from "../../api/skillApi";

export default function Stack() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePath, setActivePath] = useState(null);
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    getSkills()
      .then((res) => {
        const data = res.data?.skills || res.data || [];
        const list = Array.isArray(data) ? data : [];
        setSkills(list);
        const firstPath = list[0]?.catagory || "Other";
        setActivePath(firstPath);
      })
      .catch((err) => console.error("Skills load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && skills.length === 0) return null;

  // Catagory = "path". Har path ke andar Order value se stages banते
  // hain — same Order wale skills ek stage me saath dikhte hain.
  const paths = {};
  skills.forEach((s) => {
    const cat = s.catagory || "Other";
    if (!paths[cat]) paths[cat] = [];
    paths[cat].push(s);
  });
  const pathNames = Object.keys(paths);

  const currentSkills = paths[activePath] || [];
  const stageMap = {};
  currentSkills.forEach((s) => {
    const order = s.Order ?? 0;
    if (!stageMap[order]) stageMap[order] = [];
    stageMap[order].push(s);
  });
  const stageKeys = Object.keys(stageMap).sort((a, b) => a - b);

  const stageLabels = [
    "LANGUAGE",
    "FRAMEWORKS",
    "DATA & STATE",
    "INFRA",
    "ADVANCED",
    "MASTERY",
  ];

  return (
    <section id="stack" className="mx-auto max-w-3xl px-6 pb-24 text-center">
      <Reveal>
        <h2 className="mb-6 font-pixel text-xl text-[var(--accent-cyan)] sm:text-2xl">
          SKILL TREE
        </h2>
      </Reveal>

      {loading ? (
        <p className="font-mono text-sm text-[var(--text-muted)]">Loading...</p>
      ) : (
        <>
          {/* Path tabs */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {pathNames.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setActivePath(name);
                  setActiveNode(null);
                }}
                className="border px-3 py-1.5 font-pixel text-[8px] uppercase"
                style={{
                  backgroundColor:
                    activePath === name ? "var(--accent-cyan)" : "transparent",
                  borderColor:
                    activePath === name
                      ? "var(--accent-cyan)"
                      : "var(--card-border-strong)",
                  color:
                    activePath === name
                      ? "var(--accent-cyan-on)"
                      : "var(--text-secondary)",
                }}
              >
                {name}
              </button>
            ))}
          </div>

          <p className="mb-10 font-mono text-[11px] text-[var(--text-muted)]">
            // PATH: {activePath?.toUpperCase()}
          </p>

          {/* Vertical stage sequence */}
          <div className="flex flex-col items-center">
            {stageKeys.map((key, stageIdx) => {
              const stageSkills = stageMap[key];
              const isApex =
                stageIdx === stageKeys.length - 1 && stageKeys.length > 1;

              return (
                <div key={key} className="flex flex-col items-center">
                  {stageIdx > 0 && (
                    <div
                      className="h-7 w-0 border-l-2 border-dashed"
                      style={{ borderColor: "var(--card-border-strong)" }}
                    />
                  )}

                  <Reveal delay={stageIdx * 80}>
                    <div className="flex flex-col items-center">
                      <span
                        className="mb-3 border px-2.5 py-1 font-mono text-[9px] uppercase"
                        style={{
                          borderColor: "var(--card-border-strong)",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        {String(stageIdx + 1).padStart(2, "0")} //{" "}
                        {stageLabels[stageIdx] || "SKILLS"}
                      </span>

                      <div className="flex flex-wrap justify-center gap-6">
                        {stageSkills.map((skill) => {
                          const isImageIcon =
                            skill.icon && /^https?:\/\//.test(skill.icon);
                          const isActive = activeNode?._id === skill._id;
                          return (
                            <button
                              key={skill._id}
                              onClick={() => setActiveNode(skill)}
                              className="flex flex-col items-center gap-2"
                            >
                              <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                                {/* Hexagon outline */}
                                <svg
                                  className="absolute inset-0 h-full w-full"
                                  viewBox="0 0 100 100"
                                  fill="none"
                                >
                                  <polygon
                                    points={
                                      isApex
                                        ? "50,2 98,26 98,74 50,98 2,74 2,26"
                                        : "25,5 75,5 98,50 75,95 25,95 2,50"
                                    }
                                    fill="var(--card-bg)"
                                    stroke={
                                      isActive
                                        ? "#ffffff"
                                        : "var(--accent-cyan)"
                                    }
                                    strokeWidth="2"
                                  />
                                </svg>

                                {/* Icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  {isImageIcon ? (
                                    <img
                                      src={skill.icon}
                                      alt=""
                                      className="h-6 w-6 object-contain sm:h-8 sm:w-8"
                                    />
                                  ) : (
                                    <span
                                      className="font-pixel text-xs sm:text-sm"
                                      style={{
                                        color: "var(--accent-cyan-light)",
                                      }}
                                    >
                                      {skill.name?.[0]?.toUpperCase() || "?"}
                                    </span>
                                  )}
                                </div>

                                {/* Apex label */}
                                {isApex && (
                                  <span
                                    className="absolute -top-2 left-1/2 -translate-x-1/2 font-pixel text-[6px] uppercase"
                                    style={{
                                      color: "var(--accent-amber)",
                                    }}
                                  >
                                    apex
                                  </span>
                                )}
                              </div>
                              <p className="max-w-[80px] text-center font-pixel text-[8px] uppercase leading-tight text-[var(--text-secondary)] sm:max-w-[96px] sm:text-[9px]">
                                {skill.name}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>

          <div
            className="mx-auto mt-10 max-w-sm border p-4 text-left"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border-strong)",
            }}
          >
            {activeNode ? (
              <>
                <p className="mb-1 font-pixel text-xs uppercase text-[var(--accent-cyan)]">
                  {activeNode.name}
                </p>
                <p className="font-mono text-xs text-[var(--text-secondary)]">
                  {activeNode.catagory}
                  {typeof activeNode.level === "number" &&
                    ` · ${activeNode.level}% proficiency`}
                </p>
              </>
            ) : (
              <p className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                [ tap any node in track to inspect ]
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
