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
        // Coordinates are recalculated on refresh; the full icon stays within the viewport.
        const x = fraction => () => (window.innerWidth - scissors.getBoundingClientRect().width) * fraction;
        const y = fraction => () => window.innerHeight * fraction;
        gsap.set(scissors, { x: x(.05), y: y(.16), rotation: -20 });
        gsap.set(clipper, { x: x(.85), y: y(.55), rotation: 18 });
        gsap.set('#scissors-top-blade, #scissors-bottom-blade', { svgOrigin: '100 100' });
        const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
          trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true
        } });
        [.85, .1, .8].forEach((fraction, index) => {
          timeline.to(scissors, { x: x(fraction), y: y([.38, .24, .62][index]), rotation: [25, -25, 20][index], duration: 1 }, index);
          timeline.to(clipper, { x: x(1 - fraction), y: y([.65, .5, .3][index]), rotation: [-18, 20, -15][index], duration: 1 }, index);
        });
        // Every cut and blade vibration belongs to the same scrubbed timeline: no idle loop.
        const cuts = mobile ? 12 : 24;
        for (let i = 0; i < cuts; i++) {
          const start = i * 3 / cuts;
          const duration = 3 / cuts / 2;
          timeline.to('#scissors-top-blade', { rotation: -18, duration, repeat: 1, yoyo: true }, start);
          timeline.to('#scissors-bottom-blade', { rotation: 18, duration, repeat: 1, yoyo: true }, start);
          timeline.to('#clipper-blade', { x: 2, duration: duration / 3, repeat: 5, yoyo: true }, start);
          timeline.to('.clipper-cut-lines', { x: 4, y: -3, duration, repeat: 1, yoyo: true }, start);
        }
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
    <svg className="barber-scissors" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      <g id="scissors-top-blade"><ellipse cx="46" cy="137" rx="18" ry="23" transform="rotate(35 46 137)" /><path d="M59 120 100 100 174 49Q157 83 105 105L65 140" /></g>
      <g id="scissors-bottom-blade"><ellipse cx="46" cy="63" rx="18" ry="23" transform="rotate(-35 46 63)" /><path d="M59 80 100 100 174 151Q157 117 105 95L65 60M28 49 18 39" /></g>
      <circle cx="100" cy="100" r="6" /><path d="m97 103 6-6" />
    </svg>
    <svg className="barber-clipper" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      <path d="M67 58H133L142 88 128 166Q125 178 100 178T72 166L58 88Z" /><path d="M78 73H122L127 93 117 151H83L73 93ZM91 160H109M100 178V190M134 83 149 77 153 90" />
      <g id="clipper-blade"><path d="M61 57V34H139V57ZM64 43H136M69 34V24M78 34V24M87 34V24M96 34V24M105 34V24M114 34V24M123 34V24M132 34V24" /></g>
      <g className="clipper-cut-lines"><path d="m46 32-8-5m11 20-12 1m118-16 8-5m-11 20 12 1" /></g>
    </svg>
  </div>;
}
