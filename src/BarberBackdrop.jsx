import React, { useEffect, useRef } from 'react';
import './barber-backdrop.css';

// Versioned CDNs load independently of the app: a network failure leaves the page usable.
let runtime;
function loadRuntime() {
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return runtime ||= load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js')
    .then(() => load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js'));
}

export default function BarberBackdrop({ paused, reduced }) {
  const root = useRef(null);
  useEffect(() => {
    if (paused || reduced) return;
    let disposed = false;
    let mm;
    loadRuntime().then(() => {
      if (disposed) return;
      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);
      mm = gsap.matchMedia();
      mm.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' }, context => {
        const mobile = context.conditions.mobile;
        const scissors = root.current.querySelector('.barber-scissors');
        const clipper = root.current.querySelector('.barber-clipper');
        // One scroll-controlled orbit; opposite phases keep the objects circling each other.
        const progress = { value: 0 };
        const setters = [scissors, clipper].map(element => ({
          x: gsap.quickSetter(element, 'x', 'px'),
          y: gsap.quickSetter(element, 'y', 'px'),
          rotation: gsap.quickSetter(element, 'rotation', 'deg')
        }));
        const render = () => {
          const t = progress.value;
          const width = window.innerWidth;
          const height = window.innerHeight;
          const radius = mobile ? Math.min(38, width * .1) : Math.min(105, width * .1);
          const size = Math.max(scissors.offsetWidth, scissors.offsetHeight, clipper.offsetWidth, clipper.offsetHeight);
          const margin = size * .72 + radius + 8;
          const segment = Math.min(2, Math.floor(t * 3));
          const local = t * 3 - segment;
          const stops = [.2, .8, .2, .8];
          const desired = width * (stops[segment] + (stops[segment + 1] - stops[segment]) * local);
          const centerX = Math.max(Math.min(margin, width / 2), Math.min(width - Math.min(margin, width / 2), desired));
          const centerY = height * (.34 + .2 * t);
          [scissors, clipper].forEach((element, index) => {
            const angle = t * Math.PI * 6 + index * Math.PI;
            setters[index].x(centerX + Math.cos(angle) * radius - element.offsetWidth / 2);
            setters[index].y(centerY + Math.sin(angle) * radius * .7 - element.offsetHeight / 2);
            setters[index].rotation(t * 360 * (index ? -1 : 1) + (index ? 15 : -15));
          });
        };
        gsap.to(progress, { value: 1, duration: 1, ease: 'none', onUpdate: render,
          scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom',
            scrub: 1, invalidateOnRefresh: true, onRefresh: render }
        });
        render();
        // Refresh when real screenshots and fonts finish changing the document height.
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('load', refresh);
        document.fonts?.ready.then(() => { if (!disposed) refresh(); });
        refresh();
        return () => window.removeEventListener('load', refresh);
      }, root);
    }).catch(() => { /* Decorative enhancement only; content never depends on the CDN. */ });
    return () => { disposed = true; mm?.revert(); };
  }, [paused, reduced]);

  return <div ref={root} className="barber-backdrop fixed inset-0 pointer-events-none overflow-x-hidden z-0" aria-hidden="true">
    <img className="barber-scissors" src="/media/barber-scissors.webp" alt="" decoding="async" />
    <img className="barber-clipper" src="/media/barber-clipper.webp" alt="" decoding="async" />
  </div>;
}
