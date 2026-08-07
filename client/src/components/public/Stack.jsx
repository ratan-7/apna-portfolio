import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import Reveal from "./Reveal";
import { getSkills } from "../../api/skillApi";

// Circular progress ring — level% ko visually dikhata hai
function SkillRing({ level = 0, size = 44 }) {
    const stroke = 3;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (level / 100) * circumference;

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--card-border)"
                    strokeWidth={stroke}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--accent-cyan)"
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            <span
                className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-semibold"
                style={{ color: "var(--text-primary)" }}
            >
                {level}
            </span>
        </div>
    );
}

function SkillBadge({ skill }) {
    const isImageIcon = skill.icon && /^https?:\/\//.test(skill.icon);

    return (
        <div
            className="group flex items-center gap-3 rounded-lg border p-3 transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
            {isImageIcon ? (
                <img
                    src={skill.icon}
                    alt={skill.name}
                    className="h-8 w-8 shrink-0 rounded-md object-contain"
                />
            ) : (
                <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold"
                    style={{ backgroundColor: "var(--card-bg-hover)", color: "var(--accent-cyan-light)" }}
                >
                    {skill.name?.[0]?.toUpperCase() || "?"}
                </div>
            )}

            <span className="flex-1 truncate text-sm font-medium text-[var(--text-primary)]">
                {skill.name}
            </span>

            {typeof skill.level === "number" && <SkillRing level={skill.level} size={38} />}
        </div>
    );
}

export default function Stack() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSkills()
            .then((res) => {
                const data = res.data?.skills || res.data || [];
                setSkills(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("Skills load failed:", err))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && skills.length === 0) return null;

    const grouped = skills.reduce((acc, skill) => {
        const key = skill.catagory || "Other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(skill);
        return acc;
    }, {});

    Object.values(grouped).forEach((arr) =>
        arr.sort((a, b) => (a.Order || 0) - (b.Order || 0))
    );

    return (
        <section id="stack" className="mx-auto max-w-4xl px-6 pb-20">
            <Reveal>
                <h2 className="mb-6 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[var(--text-muted)]">
                    <Code2 size={14} className="text-[var(--accent-cyan)]" /> tech stack
                </h2>
            </Reveal>

            {loading ? (
                <p className="font-mono text-sm text-[var(--text-muted)]">Loading...</p>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                    {Object.entries(grouped).map(([category, items], idx) => (
                        <Reveal key={category} delay={idx * 80}>
                            <div
                                className="rounded-xl border p-5"
                                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
                            >
                                <div className="mb-4 flex items-center gap-2">
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ backgroundColor: "var(--accent-cyan)" }}
                                    />
                                    <h3 className="font-pixel text-sm tracking-wide text-[var(--text-primary)]">
                                        {category}
                                    </h3>
                                    <span className="ml-auto font-mono text-[10px] text-[var(--text-muted)]">
                                        {items.length} {items.length === 1 ? "skill" : "skills"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-2.5">
                                    {items.map((skill) => (
                                        <SkillBadge key={skill._id} skill={skill} />
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            )}
        </section>
    );
}
