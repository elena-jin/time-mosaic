
export const playHoverSound = (type: 'glitch' | 'pop' | 'static' = 'pop') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  if (type === 'pop') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200 + Math.random() * 300, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'glitch') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100 + Math.random() * 800, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  }
};
