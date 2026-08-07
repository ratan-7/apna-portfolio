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
        const experience = experienceRes.data?.experience || experienceRes.data || [];

        setStats([
          { name: "skills-tracked", detail: "technologies logged", value: Array.isArray(skills) ? skills.length : 0 },
          { name: "projects-shipped", detail: "in production", value: Array.isArray(projects) ? projects.length : 0 },
          { name: "roles-logged", detail: "work experience", value: Array.isArray(experience) ? experience.length : 0 },
          { name: "site-visitors", detail: "total page views", value: statsRes.data?.totalVisitors ?? 0 },
          { name: "resume-pulls", detail: "downloads", value: statsRes.data?.resumeDownloads ?? 0 },
        ]);
      })
      .catch((err) => console.error("Systems stats load failed:", err));
  }, []);

  if (!stats) return null;

  return (
    <section id="systems" className="mx-auto max-w-4xl px-6 pb-20">
      <Reveal>
        <h2 className="mb-6 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[var(--text-muted)]">
          <span className="text-[var(--accent-cyan)]">$</span> systemctl status --live
        </h2>
      </Reveal>
      <Reveal delay={80}>
        <div
          className="overflow-hidden rounded-lg border backdrop-blur-sm"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          {stats.map((s, i) => (
            <div
              key={s.name}
              className="flex items-center justify-between px-5 py-3.5 font-mono text-sm"
              style={{
                borderBottom: i !== stats.length - 1 ? "1px solid var(--card-border)" : "none",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-emerald)] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-emerald)]" />
                </span>
                <span className="text-[var(--text-secondary)]">{s.name}</span>
                <span className="hidden text-[var(--text-muted)] sm:inline">— {s.detail}</span>
              </div>
              <span className="text-[var(--accent-emerald)]">{s.value}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
