import { useEffect, useState } from "react";
import {
    Github,
    Linkedin,
    Mail,
    Youtube,
    Instagram,
    Phone,
    Code2,
    ArrowRight,
    Loader2,
    Twitter,
} from "lucide-react";
import Reveal from "./Reveal";
import { getSocialLinks } from "../../api/socialApi";
import { submitContact } from "../../api/contactApi";

export default function Contact() {
    const [social, setSocial] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState("idle");

    useEffect(() => {
        getSocialLinks()
            .then((res) => setSocial(res.data))
            .catch((err) => console.error("Social links load failed:", err));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");
        try {
            await submitContact(form);
            setStatus("sent");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            console.error("Contact submit failed:", err);
            setStatus("error");
        }
    };

    const links = social
        ? [
            { key: "github", icon: Github, href: social.github },
            { key: "linkedin", icon: Linkedin, href: social.linkedin },
            { key: "leetcode", icon: Code2, href: social.leetcode },
            { key: "youtube", icon: Youtube, href: social.youtube },
            { key: "instagram", icon: Instagram, href: social.instagram },
            { key: "twitter", icon: Twitter, href: social.twitter },
        ].filter((l) => l.href)
        : [];

    return (
        <footer id="contact" className="border-t px-6 py-16" style={{ borderColor: "var(--card-border)" }}>
            <div className="mx-auto max-w-4xl">
                <Reveal>
                    <p className="mb-2 text-center font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                        let's build something
                    </p>
                    <h2 className="mb-10 text-center font-pixel text-2xl leading-relaxed text-[var(--text-primary)] sm:text-3xl">
                        Kaam karte hain saath mein.
                    </h2>
                </Reveal>

                <Reveal delay={80}>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div
                            className="rounded-lg border p-6 backdrop-blur-sm"
                            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
                        >
                            <h3 className="font-pixel text-base text-[var(--text-primary)]">Get in Touch</h3>

                            <div className="mt-5">
                                {social?.email && (
                                    <a href={`mailto:${social.email}`} className="flex items-center gap-3 py-3">
                                        <Mail size={15} className="text-[var(--accent-cyan-light)]" />
                                        <span className="font-mono text-xs text-[var(--text-secondary)]">{social.email}</span>
                                    </a>
                                )}
                                {social?.phone && (
                                    <a href={`tel:${social.phone}`} className="flex items-center gap-3 py-3">
                                        <Phone size={15} className="text-[var(--accent-cyan-light)]" />
                                        <span className="font-mono text-xs text-[var(--text-secondary)]">{social.phone}</span>
                                    </a>
                                )}
                            </div>

                            {links.length > 0 && (
                                <div
                                    className="mt-6 flex flex-wrap items-center gap-3 border-t pt-5"
                                    style={{ borderColor: "var(--card-border)" }}
                                >
                                    {links.map(({ key, icon: Icon, href }) => (
                                        <a
                                            key={key}
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-md border p-2.5 text-[var(--text-secondary)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--card-bg-hover)]"
                                            style={{ borderColor: "var(--card-border-strong)" }}
                                        >
                                            <Icon size={16} />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-3 rounded-lg border p-6 backdrop-blur-sm"
                            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
                        >
                            <h3 className="font-pixel text-base text-[var(--text-primary)]">Send a Message</h3>
                            <p className="-mt-2 text-xs text-[var(--text-muted)]">
                                I'll get back to you within 24 hours.
                            </p>
                            <input
                                type="text" name="name" required placeholder="Full Name"
                                value={form.name} onChange={handleChange}
                                className="rounded-md border bg-transparent px-3 py-2 font-mono text-sm text-[var(--text-secondary)] outline-none"
                                style={{ borderColor: "var(--card-border)" }}
                            />
                            <input
                                type="email" name="email" required placeholder="Email Address"
                                value={form.email} onChange={handleChange}
                                className="rounded-md border bg-transparent px-3 py-2 font-mono text-sm text-[var(--text-secondary)] outline-none"
                                style={{ borderColor: "var(--card-border)" }}
                            />
                            <input
                                type="text" name="subject" placeholder="Subject (optional)"
                                value={form.subject} onChange={handleChange}
                                className="rounded-md border bg-transparent px-3 py-2 font-mono text-sm text-[var(--text-secondary)] outline-none"
                                style={{ borderColor: "var(--card-border)" }}
                            />
                            <textarea
                                name="message" required rows={4} placeholder="Your Message"
                                value={form.message} onChange={handleChange}
                                className="resize-none rounded-md border bg-transparent px-3 py-2 font-mono text-sm text-[var(--text-secondary)] outline-none"
                                style={{ borderColor: "var(--card-border)" }}
                            />
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="mt-1 flex items-center justify-center gap-2 rounded-md py-2.5 font-mono text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                                style={{ backgroundColor: "var(--accent-cyan)", color: "var(--accent-cyan-on)" }}
                            >
                                {status === "sending" && <Loader2 size={14} className="animate-spin" />}
                                {status === "sent" ? "Sent ✓" : status === "error" ? "Failed — retry" : status === "sending" ? "Sending..." : "Send Message"}
                                {status === "idle" && <ArrowRight size={14} />}
                            </button>
                        </form>
                    </div>
                </Reveal>
            </div>
        </footer>
    );
}
