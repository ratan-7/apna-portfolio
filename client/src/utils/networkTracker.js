const RULES = [
  [/analytics\/visit/i, "VISITOR LOG"],
  [/analytics\/resume/i, "RESUME LOG"],
  [/analytics/i, "SITE STATS"],
  [/profile/i, "PROFILE"],
  [/social/i, "SOCIAL LINKS"],
  [/skill/i, "SKILLS"],
  [/project/i, "PROJECTS"],
  [/experience/i, "EXPERIENCE"],
  [/education/i, "EDUCATION"],
  [/contact/i, "CONTACT"],
  [/gallery/i, "GALLERY"],
  [/upload/i, "UPLOAD"],
];

export function labelFor(url = "") {
  const path = String(url).split("?")[0];
  for (const [re, label] of RULES) {
    if (re.test(path)) return label;
  }
  const first = path.replace(/^\/+/, "").split("/")[0];
  return (first || "request").toUpperCase();
}

const items = new Map();
const listeners = new Set();
let counter = 0;
let pending = 0;
let started = 0;
let ok = 0;
let err = 0;
let snapshot = buildSnapshot();

function buildSnapshot() {
  return {
    pending,
    started,
    ok,
    err,
    counter,
    items: Array.from(items.values()).map((i) => ({ ...i })),
  };
}

function emit() {
  snapshot = buildSnapshot();
  listeners.forEach((l) => l());
}

export const networkTracker = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return snapshot;
  },
  start(label) {
    pending += 1;
    started += 1;
    counter += 1;
    let item = items.get(label);
    if (!item) {
      item = { label, lastSeq: counter, pending: 0, ok: 0, err: 0 };
      items.set(label, item);
    }
    item.lastSeq = counter;
    item.pending += 1;
    emit();
  },
  finish(label, success) {
    pending = Math.max(0, pending - 1);
    if (success) ok += 1;
    else err += 1;
    const item = items.get(label);
    if (item) {
      item.pending = Math.max(0, item.pending - 1);
      if (success) item.ok += 1;
      else item.err += 1;
    }
    emit();
  },
};
