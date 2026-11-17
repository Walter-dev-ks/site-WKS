import React, { useEffect, useRef, useState } from 'react';

export default function ZoomableScreen({ screen }) {
  const frame = useRef(null);
  const image = useRef(null);
  const api = useRef(null);
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const surface = frame.current;
    const img = image.current;
    const pointers = new Map();
    let view = { scale: 1, x: 0, y: 0 };
    const paint = () => {
      const fit = Math.min(surface.clientWidth / screen.width, surface.clientHeight / screen.height);
      const limitX = Math.max(0, (screen.width * fit * view.scale - surface.clientWidth) / 2);
      const limitY = Math.max(0, (screen.height * fit * view.scale - surface.clientHeight) / 2);
      view.x = Math.max(-limitX, Math.min(limitX, view.x));
      view.y = Math.max(-limitY, Math.min(limitY, view.y));
      img.style.transform = `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`;
      surface.dataset.zoomed = String(view.scale > 1);
      setZoom(view.scale);
    };
    // Keep the point under the cursor/pinch midpoint stationary while scaling.
    const scaleAt = (scale, clientX, clientY, fromX = clientX, fromY = clientY) => {
      const rect = surface.getBoundingClientRect();
      const next = Math.max(1, Math.min(5, scale));
      const ratio = next / view.scale;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      view.x = clientX - cx - (fromX - cx - view.x) * ratio;
      view.y = clientY - cy - (fromY - cy - view.y) * ratio;
      view.scale = next;
      paint();
    };
    const centerZoom = factor => {
      const rect = surface.getBoundingClientRect();
      scaleAt(view.scale * factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
    };
    const reset = () => { view = { scale: 1, x: 0, y: 0 }; paint(); };
    api.current = { centerZoom, reset };
    const wheel = event => {
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? surface.clientHeight : 1);
      scaleAt(view.scale * Math.exp(-Math.max(-160, Math.min(160, delta)) * .003), event.clientX, event.clientY);
    };
    const down = event => {
      if (event.button !== 0) return;
      surface.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      surface.dataset.dragging = 'true';
    };
    const move = event => {
      if (!pointers.has(event.pointerId)) return;
      const before = [...pointers.values()];
      const previous = pointers.get(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const after = [...pointers.values()];
        const distance = points => Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
        const midpoint = points => ({ x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 });
        const a = midpoint(before), b = midpoint(after);
        scaleAt(view.scale * distance(after) / Math.max(1, distance(before)), b.x, b.y, a.x, a.y);
      } else if (pointers.size === 1) {
        view.x += event.clientX - previous.x;
        view.y += event.clientY - previous.y;
        paint();
      }
    };
    const up = event => {
      pointers.delete(event.pointerId);
      surface.dataset.dragging = String(pointers.size > 0);
    };
    const key = event => {
      if (['+', '=', '-', '0'].includes(event.key)) {
        event.preventDefault();
        if (event.key === '0') reset(); else centerZoom(event.key === '-' ? 1 / 1.25 : 1.25);
      }
    };
    // Only the image surface consumes wheel/touch; modal navigation remains normal.
    surface.addEventListener('wheel', wheel, { passive: false });
    surface.addEventListener('pointerdown', down);
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerup', up);
    surface.addEventListener('pointercancel', up);
    surface.addEventListener('lostpointercapture', up);
    surface.addEventListener('keydown', key);
    const observer = new ResizeObserver(paint);
    observer.observe(surface);
    paint();
    return () => {
      observer.disconnect();
      surface.removeEventListener('wheel', wheel);
      surface.removeEventListener('pointerdown', down);
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerup', up);
      surface.removeEventListener('pointercancel', up);
      surface.removeEventListener('lostpointercapture', up);
      surface.removeEventListener('keydown', key);
      api.current = null;
    };
  }, [screen]);
  return <div className="zoom-viewer">
    <div className="zoom-toolbar" role="group" aria-label="Zoom da captura">
      <button type="button" aria-label="Diminuir zoom" disabled={zoom <= 1.001} onClick={() => api.current?.centerZoom(1 / 1.25)}>−</button>
      <output aria-label="Nível de zoom">{Math.round(zoom * 100)}%</output>
      <button type="button" aria-label="Aumentar zoom" disabled={zoom >= 4.999} onClick={() => api.current?.centerZoom(1.25)}>+</button>
      <button type="button" onClick={() => api.current?.reset()}>Ajustar</button>
      <span>Role para ampliar · Arraste para mover · No celular, use a pinça</span>
    </div>
    <div className="gallery-image-frame zoom-surface" ref={frame} tabIndex={0} role="region" aria-label={`Imagem ampliável: ${screen.label}. Use mais e menos para zoom e zero para ajustar.`}>
      <img ref={image} src={`/media/product/${screen.id}.png`} alt={screen.alt} width={screen.width} height={screen.height} decoding="async" draggable={false} />
    </div>
  </div>;
}
