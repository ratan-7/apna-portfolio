import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getExperience } from "../../api/experienceApi";
import { formatPeriod } from "../../utils/formatDate";

export default function Experience() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getExperience()
            .then((res) => {
                const data = res.data?.experience || res.data || [];
                setItems(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("Experience load failed:", err))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && items.length === 0) return null;

    return (
        <section id="experience" className="mx-auto max-w-4xl px-6 pb-20">
            <Reveal>
                <h2 className="mb-6 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[var(--text-muted)]">
                    <span className="text-[var(--accent-cyan)]">$</span> git log --author=me --stat
                </h2>
            </Reveal>

            <Reveal delay={80}>
                <div className="border-l pl-6" style={{ borderColor: "var(--card-border)" }}>
                    {loading ? (
                        <p className="font-mono text-sm text-[var(--text-muted)]">Loading...</p>
                    ) : (
                        items.map((job) => (
                            <div key={job._id} className="relative pb-9 last:pb-0">
                                <span
                                    className="absolute -left-[29px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: job.currentlyWorking
                                            ? "var(--accent-cyan)"
                                            : "var(--card-border-strong)",
                                    }}
                                >
                                    {job.currentlyWorking && (
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-cyan)] opacity-60" />
                                    )}
                                </span>

                                <div
                                    className="rounded-lg border p-5 backdrop-blur-sm"
                                    style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
                                >
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                        <h3 className="font-pixel text-lg text-[var(--text-primary)]">
                                            {job.title}{" "}
                                            <span className="font-sans text-sm text-[var(--text-muted)]">
                                                @ {job.company}
                                            </span>
                                        </h3>
                                        <span className="font-mono text-xs text-[var(--accent-cyan-light)]">
                                            {formatPeriod(job.startDate, job.endDate, job.currentlyWorking)}
                                        </span>
                                    </div>
                                    <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                                        {job.location}
                                        {job.currentlyWorking && (
                                            <span
                                                className="ml-2 rounded-full px-2 py-0.5 text-[var(--accent-cyan-light)]"
                                                style={{ backgroundColor: "var(--card-bg-hover)" }}
                                            >
                                                HEAD
                                            </span>
                                        )}
                                    </p>
                                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]"
                                        style={{ textAlign: "justify", textJustify: "inter-word", hyphens: "auto" }}
                                    >
                                        {job.description}
                                    </p>
                                    {job.skills?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {job.skills.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded border px-2 py-0.5 font-mono text-[10px] text-[var(--text-tertiary)]"
                                                    style={{ borderColor: "var(--card-border)" }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Reveal>
        </section>
    );
}
