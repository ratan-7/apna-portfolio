import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getProfile } from "../../api/profileApi";

function normalizeParagraphs(text) {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
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
    <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
      <Reveal>
        <h2 className="mx-auto mb-10 max-w-2xl font-pixel text-xl uppercase leading-relaxed text-[var(--accent-cyan)] sm:text-2xl">
          LET'S START WITH MY NAME — {profile?.name}
        </h2>
      </Reveal>

      <Reveal delay={80}>
        <div
          className="border text-left"
          style={{ borderColor: "var(--card-border-strong)" }}
        >
          <div
            className="flex items-center gap-2 border-b px-4 py-2.5"
            style={{
              borderColor: "var(--card-border-strong)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <span
              className="h-2 w-2"
              style={{ backgroundColor: "var(--accent-cyan)" }}
            />
            <span className="font-pixel text-[9px] uppercase text-[var(--accent-cyan)]">
              sys.profile // [dev_{profile?.name?.split(" ")[0]?.toLowerCase()}]
            </span>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:p-6">
            {paragraphs.map((para, i) => (
              <div
                key={i}
                className="border p-4"
                style={{ borderColor: "var(--card-border)" }}
              >
                <p className="mb-2 font-pixel text-[9px] text-[var(--accent-cyan)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-mono text-sm leading-relaxed text-[var(--text-secondary)]">
                  {para}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
