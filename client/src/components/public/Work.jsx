import { useEffect, useState } from "react";
import { ArrowUpRight, GitBranch, GitCommit, Github } from "lucide-react";
import Reveal from "./Reveal";
import { getProjects } from "../../api/projectApi";

function parseGithubUrl(url) {
    if (!url) return null;
    try {
        const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return null;
        return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    } catch {
        return null;
    }
}

function useLatestCommit(githubUrl) {
    const [commit, setCommit] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const parsed = parseGithubUrl(githubUrl);
        if (!parsed) {
            setChecked(true); // eslint-disable-line react-hooks/set-state-in-effect
            return;
        }

        fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=1`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setCommit({
                        hash: data[0].sha.slice(0, 7),
                        message: data[0].commit.message.split("\n")[0],
                        url: data[0].html_url,
                    });
                }
            })
            .catch((err) => console.error("GitHub commit fetch failed:", err))
            .finally(() => setChecked(true));
    }, [githubUrl]);

    return { commit, checked };
}

function ProjectCard({ project, delay }) {
    const { commit, checked } = useLatestCommit(project.githubUrl);

    return (
        <Reveal delay={delay}>
            <div className="relative  mb-14 pl-8 last:mb-4">
                <div
                    className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full border-2"
                    style={{ borderColor: "var(--accent-cyan)", backgroundColor: "var(--bg)" }}
                />
                <div
                    className="group rounded-lg border p-5  transition-all hover:-translate-y-0.5"
                    style={{
                        backgroundColor: "var(--bg)",
                        borderColor: "var(--card-border-strong)",
                    }}
                >
                    <div className="mb-1 flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
                        {commit ? (
                            <a
                                href={commit.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-[var(--accent-amber)] hover:underline"
                                title={commit.message}
                            >
                                <GitCommit size={11} /> {commit.hash}
                            </a>
                        ) : checked ? (
                            project.githubUrl ? (
                                <span className="text-[var(--text-muted)]">commit info unavailable</span>
                            ) : (
                                <span className="text-[var(--text-muted)]">no github repo linked</span>
                            )
                        ) : (
                            <span className="text-[var(--text-muted)]">checking github...</span>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--accent-cyan-light)]"
                            >
                                <Github size={12} /> repo
                            </a>
                        )}
                    </div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <h3 className="font-pixel text-base tracking-wide text-[var(--text-primary)]">{project.title}</h3>
                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex shrink-0 items-center gap-1 text-sm text-[var(--accent-cyan-light)] opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                view <ArrowUpRight size={14} />
                            </a>
                        )}
                    </div>
                    {project.image && (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="mb-3 h-40 w-full rounded-md border object-cover"
                            style={{ borderColor: "var(--card-border)" }}
                        />
                    )}
                    <p className="mb-2 text-sm text-[var(--text-tertiary)]">{project.description}</p>
                    {commit && (
                        <p className="mb-3 truncate font-mono text-xs text-[var(--text-muted)]">
                            last commit: "{commit.message}"
                        </p>
                    )}
                    {project.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {project.skills.map((t) => (
                                <span
                                    key={t}
                                    className="rounded-full border px-2.5 py-0.5 font-mono text-xs text-[var(--text-tertiary)]"
                                    style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg-hover)" }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Reveal>
    );
}

export default function Work() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProjects()
            .then((res) => {
                const data = res.data?.projects || res.data || [];
                setProjects(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("Projects load failed:", err))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && projects.length === 0) return null;

    return (
        <section id="work" className="mx-auto max-w-4xl px-6 pb-24">
            <Reveal>
                <h2 className="mb-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[var(--text-muted)]">
                    <GitBranch size={14} className="text-[var(--accent-cyan)]" /> git log --projects
                </h2>
            </Reveal>

            {loading ? (
                <p className="font-mono text-sm text-[var(--text-muted)]">Loading...</p>
            ) : (
                <div className="relative">
                    <div
                        className="absolute bottom-0 left-[7px] top-2 w-px"
                        style={{ backgroundColor: "var(--card-border)" }}
                    />
                    {projects.map((p, idx) => (
                        <ProjectCard key={p._id} project={p} delay={idx * 90} />
                    ))}
                </div>
            )}
        </section>
    );
}