import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import Reveal from "./Reveal";
import { getEducation } from "../../api/educationApi";
import { formatPeriod } from "../../utils/formatDate";

export default function Education() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEducation()
            .then((res) => {
                const data = res.data?.education || res.data || [];
                setItems(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("Education load failed:", err))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && items.length === 0) return null;

    return (
        <section id="education" className="mx-auto max-w-4xl px-6 pb-20">
            <Reveal>
                <h2 className="mb-6 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[var(--text-muted)]">
                    <span className="text-[var(--accent-cyan)]">$</span> cat education.log
                </h2>
            </Reveal>

            <Reveal delay={80}>
                <div className="grid gap-4 sm:grid-cols-2">
                    {loading ? (
                        <p className="font-mono text-sm text-[var(--text-muted)]">Loading...</p>
                    ) : (
                        items.map((edu) => (
                            <div
                                key={edu._id}
                                className="rounded-lg border p-5 backdrop-blur-sm"
                                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className="mt-0.5 rounded-md p-2 text-[var(--accent-cyan-light)]"
                                        style={{ backgroundColor: "var(--card-bg-hover)" }}
                                    >
                                        <GraduationCap size={16} />
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="font-pixel text-base text-[var(--text-primary)]">
                                            {edu.degree} {edu.field && `— ${edu.field}`}
                                        </h3>
                                        <p className="mt-0.5 text-sm text-[var(--text-tertiary)]">{edu.school}</p>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-[var(--text-muted)]">
                                            <span>{formatPeriod(edu.startDate, edu.endDate, edu.currentlyWorking)}</span>
                                            {edu.grade && (
                                                <>
                                                    <span>·</span>
                                                    <span className="text-[var(--accent-emerald)]">{edu.grade}</span>
                                                </>
                                            )}
                                        </div>
                                        {edu.description && (
                                            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]"
                                                style={{ textAlign: "justify", textJustify: "inter-word", hyphens: "auto" }}
                                            >
                                                {edu.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Reveal>
        </section>
    );
}
