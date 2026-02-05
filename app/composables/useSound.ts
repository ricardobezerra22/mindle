export const useSound = () => {
  const playDone = () => {
    if (typeof window === "undefined") return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.15, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    g.connect(ctx.destination);

    const o1 = ctx.createOscillator();
    o1.type = "sine";
    o1.frequency.setValueAtTime(523.25, now);
    o1.connect(g);
    o1.start(now);
    o1.stop(now + 0.2);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.12, now + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    g2.connect(ctx.destination);

    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.setValueAtTime(659.25, now + 0.12);
    o2.connect(g2);
    o2.start(now + 0.12);
    o2.stop(now + 0.4);

    setTimeout(() => ctx.close(), 800);
  };

  return { playDone };
};
