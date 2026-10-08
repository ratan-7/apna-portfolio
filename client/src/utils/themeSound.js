let audioCtx = null;

export function playThemeSound(toLight) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;

    audioCtx = audioCtx || new Ctx();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;
    const notes = toLight
      ? [392.0, 523.25, 659.25, 783.99]
      : [783.99, 659.25, 523.25, 392.0];

    notes.forEach((freq, i) => {
      const start = now + i * 0.075;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.05, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.1);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.12);
    });

    const dur = 0.7;
    const buffer = audioCtx.createBuffer(
      1,
      Math.floor(audioCtx.sampleRate * dur),
      audioCtx.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(toLight ? 300 : 2200, now);
    filter.frequency.exponentialRampToValueAtTime(
      toLight ? 2200 : 300,
      now + dur,
    );

    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.045, now + 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    noise.connect(filter).connect(g).connect(audioCtx.destination);
    noise.start(now);
  } catch {
    // Audio fail ho jaye to theme switch phir bhi normal chalega
  }
}
