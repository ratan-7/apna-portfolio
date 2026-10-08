import { useEffect, useState } from "react";
import { Github, Download } from "lucide-react";
import { getProfile } from "../../api/profileApi";
import { getSocialLinks } from "../../api/socialApi";
import { trackResumeDownload } from "../../api/analyticsApi";
import { buildDownloadUrl } from "../../utils/cloudinaryHelpers";

function renderStyledTagline(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-[var(--accent-cyan-light)]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function Hero() {
  const [cursorOn, setCursorOn] = useState(true);
  const [profile, setProfile] = useState(null);
  const [social, setSocial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((c) => !c), 550);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Promise.all([getProfile(), getSocialLinks()])
      .then(([profileRes, socialRes]) => {
        setProfile(profileRes.data);
        setSocial(socialRes.data);
      })
      .catch((err) => console.error("Hero data load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const handleResumeClick = () => trackResumeDownload().catch(() => {});

  const resumeDownloadUrl = social?.resumeUrl
    ? buildDownloadUrl(social.resumeUrl, `${profile?.name || "Resume"}_Resume.pdf`)
    : null;

  return (
    <header id="top" className="mx-auto max-w-3xl px-6 pb-20 pt-20 text-center sm:pt-28">
      {loading ? (
        <div className="animate-pulse">
          <div className="mx-auto h-12 w-64 rounded" style={{ backgroundColor: "var(--card-bg-hover)" }} />
          <div className="mx-auto mt-6 h-5 w-80 rounded" style={{ backgroundColor: "var(--card-bg-hover)" }} />
        </div>
      ) : (
        <>
          <h1 className="font-pixel text-2xl leading-[1.5] text-[var(--text-primary)] sm:text-4xl">
            Hi, I'm {profile?.name?.split(" ")[0]}!
            <span
              className="ml-2 inline-block h-[0.75em] w-[0.4em] translate-y-[3px] bg-[var(--accent-cyan)]"
              style={{ opacity: cursorOn ? 1 : 0 }}
            />
          </h1>

          <p className="mx-auto mt-6 max-w-md font-mono text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {renderStyledTagline(profile?.tagline)}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {resumeDownloadUrl && (
              <a
                href={resumeDownloadUrl}
                onClick={handleResumeClick}
                className="flex items-center gap-2 border px-5 py-2.5 font-pixel text-[9px] uppercase text-[var(--text-secondary)]"
                style={{ borderColor: "var(--card-border-strong)" }}
              >
                <Download size={13} /> view resume
              </a>
            )}
            <button
              onClick={() => scrollTo("contact")}
              className="border px-5 py-2.5 font-pixel text-[9px] uppercase"
              style={{ backgroundColor: "var(--accent-cyan)", borderColor: "var(--accent-cyan)", color: "var(--accent-cyan-on)" }}
            >
              hire me
            </button>
          </div>

          {profile?.bio && (
            <div className="relative mx-auto mt-10 max-w-md">
              <div
                className="border px-5 py-4"
                style={{ backgroundColor: "var(--bg)", borderColor: "var(--card-border-strong)" }}
              >
                <p className="font-pixel text-[10px] uppercase leading-relaxed text-[var(--text-secondary)]">
                  Hey! I'm {profile?.name?.split(" ")[0]}. {profile.bio}
                </p>
              </div>
              <div
                className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r"
                style={{ backgroundColor: "var(--bg)", borderColor: "var(--card-border-strong)" }}
              />
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-3">
            {social?.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border px-4 py-2 font-pixel text-[8px] uppercase text-[var(--text-secondary)]"
                style={{ borderColor: "var(--card-border)" }}
              >
                <Github size={12} /> github
              </a>
            )}
          </div>
        </>
      )}
    </header>
  );
}
