import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getSkills } from "../../api/skillApi";
import { getProjects } from "../../api/projectApi";
import { getExperience } from "../../api/experienceApi";
import { getPublicStats } from "../../api/analyticsApi";

export default function Systems() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([getSkills(), getProjects(), getExperience(), getPublicStats()])
      .then(([skillsRes, projectsRes, experienceRes, statsRes]) => {
        const skills = skillsRes.data?.skills || skillsRes.data || [];
        const projects = projectsRes.data?.projects || projectsRes.data || [];
        const experience =
          experienceRes.data?.experience || experienceRes.data || [];

        setStats([
          {
            name: "SKILLS TRACKED",
            detail: "technologies logged",
            value: Array.isArray(skills) ? skills.length : 0,
          },
          {
            name: "PROJECTS SHIPPED",
            detail: "in production",
            value: Array.isArray(projects) ? projects.length : 0,
          },
          {
            name: "ROLES LOGGED",
            detail: "work experience",
            value: Array.isArray(experience) ? experience.length : 0,
          },
          {
            name: "SITE VISITORS",
            detail: "total page views",
            value: statsRes.data?.totalVisitors ?? 0,
          },
          {
            name: "RESUME PULLS",
            detail: "downloads",
            value: statsRes.data?.resumeDownloads ?? 0,
          },
        ]);
      })
      .catch((err) => console.error("Systems stats load failed:", err));
  }, []);

  if (!stats) return null;

  return (
    <section id="systems" className="mx-auto max-w-4xl px-6 pb-24">
      <Reveal>
        <h2 className="mb-2 font-pixel text-xl text-[var(--accent-cyan)] sm:text-2xl">
          SYSTEM STATUS
        </h2>
        <p className="mb-10 font-mono text-xs text-[var(--text-muted)]">
          // live stats, straight from the database
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div
          className="overflow-hidden border"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border-strong)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.name}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 sm:px-6"
              style={{
                borderBottom:
                  i !== stats.length - 1
                    ? "1px dashed var(--card-border-strong)"
                    : "none",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ backgroundColor: "var(--accent-emerald)" }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--accent-emerald)" }}
                  />
                </span>
                <div>
                  <p className="font-pixel text-[9px] uppercase text-[var(--text-secondary)] sm:text-[10px]">
                    {s.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                    {s.detail}
                  </p>
                </div>
              </div>
              <span
                className="font-pixel text-sm sm:text-base"
                style={{ color: "var(--accent-emerald)" }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
