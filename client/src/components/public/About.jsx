import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getProfile } from "../../api/profileApi";

function normalizeParagraphs(text) {
  if (!text) return [];
  return text
    .split(/\n\s*\n/) // paragraph breaks
    .map((para) => para.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

export default function About() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("About load failed:", err));
  }, []);

  const rawText = profile?.readme || profile?.bio;
  const paragraphs = normalizeParagraphs(rawText);
  if (paragraphs.length === 0) return null;

  return (
    <section id="about" className="mx-auto max-w-4xl px-6 pb-20">
      <Reveal>
        <div
          className="rounded-lg border p-6 backdrop-blur-sm sm:p-8"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
            README.md
          </p>
          <div className="flex flex-col gap-4">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="leading-relaxed text-[var(--text-secondary)]"
                style={{ textAlign: "justify", textJustify: "inter-word", hyphens: "auto" }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
