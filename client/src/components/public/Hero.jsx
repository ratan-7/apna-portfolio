import { useEffect, useState } from "react";
import { Github, Download } from "lucide-react";
import { getProfile } from "../../api/profileApi";
import { getSocialLinks } from "../../api/socialApi";
import { trackResumeDownload } from "../../api/analyticsApi";
import { buildDownloadUrl } from "../../utils/cloudinaryHelpers";

function renderStyledTagline(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--accent-cyan-light)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResumeClick = () => {
    trackResumeDownload().catch(() => { });
  };

  const resumeDownloadUrl = social?.resumeUrl
    ? buildDownloadUrl(social.resumeUrl, `${profile?.name || "Resume"}_Resume.pdf`)
    : null;

  return (
    <header id="top" className="mx-auto max-w-4xl px-6 pb-20 pt-20 sm:pt-28">
      {loading ? (
        <div className="animate-pulse">
          <div className="h-3 w-40 rounded" style={{ backgroundColor: "var(--card-bg-hover)" }} />
          <div className="mt-4 h-12 w-64 rounded" style={{ backgroundColor: "var(--card-bg-hover)" }} />
          <div className="mt-6 h-5 w-80 rounded" style={{ backgroundColor: "var(--card-bg-hover)" }} />
        </div>
      ) : (
        <>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-amber)]">
            {profile?.role} {profile?.location && `· ${profile.location}`}
          </p>
          <h1 className="font-pixel text-4xl leading-[1.25] tracking-wide text-[var(--text-primary)] sm:text-6xl">
            {profile?.name}
            <span
              className="ml-2 inline-block h-[0.75em] w-[0.5em] translate-y-[3px] bg-[var(--accent-cyan)]"
              style={{ opacity: cursorOn ? 1 : 0 }}
            />
          </h1>
          <p className="mt-6 max-w-xl font-mono text-lg text-[var(--text-secondary)]">
            {renderStyledTagline(profile?.tagline)}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={() => scrollTo("work")}
              className="rounded-md px-5 py-2.5 font-mono text-sm font-medium transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--accent-cyan)", color: "var(--accent-cyan-on)" }}
            >
              view work →
            </button>
            {resumeDownloadUrl && (
              <a
                href={resumeDownloadUrl}
                onClick={handleResumeClick}
                className="flex items-center gap-2 rounded-md border px-5 py-2.5 font-mono text-sm text-[var(--text-secondary)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--card-bg-hover)]"
                style={{ borderColor: "var(--card-border-strong)" }}
              >
                <Download size={15} /> resume
              </a>
            )}
            {social?.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md border px-5 py-2.5 font-mono text-sm text-[var(--text-secondary)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--card-bg-hover)]"
                style={{ borderColor: "var(--card-border-strong)" }}
              >
                <Github size={15} /> github
              </a>
            )}
          </div>
        </>
      )}
    </header>
  );
}