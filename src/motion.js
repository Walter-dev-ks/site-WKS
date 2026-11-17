import { useEffect, useState } from 'react';

export function useMotion() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('motion-paused', paused);
    return () => document.documentElement.classList.remove('motion-paused');
  }, [paused]);
  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 801px)');
    const elements = [...document.querySelectorAll('.feature-stage, .steps article, .hero-dashboard')];
    if (paused || reduced) return;
    const cleanups = elements.map(element => {
      let frame;
      const reset = () => {
        cancelAnimationFrame(frame);
        ['--spot-x', '--spot-y', '--tilt-x', '--tilt-y'].forEach(name => element.style.removeProperty(name));
      };
      const move = event => {
        if (!pointer.matches || event.pointerType !== 'mouse') return;
        const rect = element.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          element.style.setProperty('--spot-x', `${x * 100}%`);
          element.style.setProperty('--spot-y', `${y * 100}%`);
          element.style.setProperty('--tilt-x', `${(0.5 - y) * 4}deg`);
          element.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
        });
      };
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerleave', reset);
      pointer.addEventListener('change', reset);
      return () => {
        reset();
        element.removeEventListener('pointermove', move);
        element.removeEventListener('pointerleave', reset);
        pointer.removeEventListener('change', reset);
      };
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, [paused, reduced]);
  return { paused, setPaused, reduced };
}
