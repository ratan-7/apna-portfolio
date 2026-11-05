import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import CityscapeBackground from "./CityscapeBackground";
import { networkTracker } from "../../utils/networkTracker";

let hasBooted = false;

const IDLE_MS = 450;
const NO_REQUEST_MS = 2500;
const SLOW_HINT_MS = 6000;
const MAX_WAIT_MS = 60000;
const READY_HOLD_MS = 900;
const FADE_MS = 500;
const BLOCKS = 20;

function decide(s, base) {
  const startedN = s.started - base.started;
  const okN = s.ok - base.ok;
  return startedN > 0 && okN === 0 ? "error" : "ready";
}

export default function LoadingScreen() {
  const snap = useSyncExternalStore(
    networkTracker.subscribe,
    networkTracker.getSnapshot,
  );
  const [base] = useState(() => networkTracker.getSnapshot());
  const [phase, setPhase] = useState(() => (hasBooted ? "gone" : "loading"));
  const [slow, setSlow] = useState(false);
  const [tick, setTick] = useState(0);
  const [creep, setCreep] = useState(6);
  const latest = useRef(snap);

  useEffect(() => {
    latest.current = snap;
  });

  const startedN = snap.started - base.started;
  const okN = snap.ok - base.ok;
  const errN = snap.err - base.err;
  const rows = snap.items.filter((i) => i.lastSeq > base.counter);

  useEffect(() => {
    if (phase !== "loading") return;
    if (startedN === 0 || snap.pending > 0) return;
    const id = setTimeout(
      () => setPhase(decide(latest.current, base)),
      IDLE_MS,
    );
    return () => clearTimeout(id);
  }, [phase, startedN, snap.pending, base]);

  useEffect(() => {
    if (phase !== "loading") return;
    const t1 = setTimeout(() => {
      if (latest.current.started - base.started === 0) setPhase("ready");
    }, NO_REQUEST_MS);
    const t2 = setTimeout(() => setSlow(true), SLOW_HINT_MS);
    const t3 = setTimeout(
      () => setPhase(decide(latest.current, base)),
      MAX_WAIT_MS,
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase, base]);

  useEffect(() => {
    if (phase !== "loading") return;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setCreep((c) => c + (90 - c) * 0.06);
    }, 280);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "ready") {
      const id = setTimeout(() => setPhase("leaving"), READY_HOLD_MS);
      return () => clearTimeout(id);
    }
    if (phase === "leaving") {
      const id = setTimeout(() => {
        hasBooted = true;
        setPhase("gone");
      }, FADE_MS);
      return () => clearTimeout(id);
    }
  }, [phase]);

  const done = phase === "gone";
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  if (done) return null;

  const isLoading = phase === "loading";
  const isReady = phase === "ready" || phase === "leaving";
  const isError = phase === "error";

  const total = okN + errN + snap.pending;
  const real = total === 0 ? 0 : ((okN + errN) / total) * 100;
  const progress = isReady
    ? 100
    : isError
      ? Math.min(95, real)
      : Math.min(95, Math.max(creep, real));
  const filled = Math.round((progress / 100) * BLOCKS);
  const dots = ".".repeat(tick % 4);
  const barColor = isReady ? "var(--accent-emerald)" : "var(--accent-cyan)";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      style={{
        backgroundColor: "var(--bg)",
        opacity: phase === "leaving" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: phase === "leaving" ? "none" : "auto",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <CityscapeBackground />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <p className="mb-3 font-pixel text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
          {isError ? "// connection failed" : " booting portfolio.exe"}
        </p>

        <h1
          className="font-pixel text-2xl sm:text-3xl"
          style={{
            color: isReady
              ? "var(--accent-emerald)"
              : isError
                ? "#f87171"
                : "var(--accent-cyan)",
          }}
        >
          {isLoading && (
            <>
              LOADING
              <span className="inline-block w-[3ch] text-left">{dots}</span>
            </>
          )}
          {isReady && "READY"}
          {isError && "NO SIGNAL"}
        </h1>

        <div
          className="mx-auto mt-8 flex max-w-xs justify-center gap-[3px]"
          aria-hidden="true"
        >
          {Array.from({ length: BLOCKS }, (_, i) => (
            <span
              key={i}
              className="h-4 w-2 sm:w-2.5"
              style={{
                backgroundColor: i < filled ? barColor : "var(--card-border)",
              }}
            />
          ))}
        </div>
        <p className="mt-3 font-pixel text-[9px] text-[var(--text-tertiary)]">
          {Math.round(progress)}%
        </p>

        {rows.length > 0 && (
          <div
            className="mt-8 border text-left"
            style={{
              borderColor: "var(--card-border-strong)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <div
              className="border-b px-3 py-2 font-pixel text-[8px] uppercase text-[var(--accent-cyan)]"
              style={{ borderColor: "var(--card-border-strong)" }}
            >
              boot.log
            </div>
            <ul className="px-3 py-2">
              {rows.map((r) => {
                const status =
                  r.pending > 0
                    ? "pending"
                    : r.err > 0 && r.ok === 0
                      ? "err"
                      : "ok";
                return (
                  <li
                    key={r.label}
                    className="flex items-center justify-between py-1 font-mono text-[11px]"
                  >
                    <span className="text-[var(--text-secondary)]">
                      &gt; {r.label}
                    </span>
                    <span
                      className={`font-pixel text-[8px] ${status === "pending" ? "animate-pulse" : ""}`}
                      style={{
                        color:
                          status === "ok"
                            ? "var(--accent-emerald)"
                            : status === "err"
                              ? "#f87171"
                              : "var(--accent-amber)",
                      }}
                    >
                      {status === "ok"
                        ? "[ OK ]"
                        : status === "err"
                          ? "[ ERR ]"
                          : "[ .. ]"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {isLoading && slow && (
          <p className="mx-auto mt-5 max-w-xs font-mono text-[11px] leading-relaxed text-[var(--text-muted)]">
            Server is waking up (free hosting). First load can take 30-50
            seconds, hang tight.
          </p>
        )}

        {isError && (
          <>
            <p className="mx-auto mt-5 max-w-xs font-mono text-[11px] leading-relaxed text-[var(--text-muted)]">
              Couldn't reach the server. Check your connection and try again.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="border px-4 py-2.5 font-pixel text-[9px] uppercase"
                style={{
                  backgroundColor: "var(--accent-cyan)",
                  borderColor: "var(--accent-cyan)",
                  color: "var(--accent-cyan-on)",
                }}
              >
                retry
              </button>
              <button
                onClick={() => setPhase("leaving")}
                className="border px-4 py-2.5 font-pixel text-[9px] uppercase text-[var(--text-secondary)]"
                style={{ borderColor: "var(--card-border-strong)" }}
              >
                continue anyway
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
