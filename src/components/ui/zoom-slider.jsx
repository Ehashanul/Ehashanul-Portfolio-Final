// Adapted from the owner-supplied Zoom Slider for the portfolio's project data.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

export default function ZoomSlider({ items }) {
  const root = useRef(null);
  const cards = useRef([]);
  const motion = useRef({ current: 0, target: 0, velocity: 0, dragging: false, moved: false, lastX: 0, startX: 0 });
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const advance = direction => {
    motion.current.target = Math.round(motion.current.target) + direction;
    motion.current.velocity = 0;
  };

  useEffect(() => {
    const element = root.current;
    const state = motion.current;
    let frame;
    let width = element.clientWidth;
    let height = element.clientHeight;
    let visible = true;
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    });
    resize.observe(element);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(element);
    const tick = () => {
      if (visible && items.length) {
        if (!state.dragging && !reduced && Math.abs(state.velocity) > 0.0005) {
          state.target += state.velocity;
          state.velocity *= 0.92;
        }
        state.current += (state.target - state.current) * (reduced ? 1 : state.dragging ? 0.22 : 0.08);
        const count = items.length;
        const offset = ((state.current % count) + count) % count;
        const start = Math.floor(offset);
        const fraction = offset - start;
        const step = width < 640 ? width * 0.86 : Math.min(680, width * 0.58);
        const easeDistance = width * 1.15;
        const map = value => value <= 0 ? 0 : value >= easeDistance ? value - easeDistance / 2 : value * value / (2 * easeDistance);
        for (let index = 0; index < count; index++) {
          const card = cards.current[(start + index) % count];
          if (!card) continue;
          const position = (index - fraction) * step;
          const x = count === 1 ? 0 : map(position);
          const cardWidth = count === 1 ? width : Math.max(0, map(position + step) - x);
          const cardHeight = count === 1 ? height : 85 + Math.min(1, cardWidth / step) * (height - 85);
          card.style.transform = `translate3d(${x}px,${height - cardHeight}px,0)`;
          card.style.width = `${Math.max(0, cardWidth - 12)}px`;
          card.style.height = `${cardHeight}px`;
          const hidden = cardWidth < 70 || x >= width;
          card.style.visibility = hidden ? 'hidden' : 'visible';
          card.tabIndex = hidden ? -1 : 0;
        }
        setActive(previous => previous === start ? previous : start);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); };
  }, [items.length, reduced]);

  return <div className="zoom-projects">
    <div ref={root} className="zoom-projects-stage" role="region" aria-roledescription="carousel" aria-label="Selected projects"
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault(); advance(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
      onPointerDown={event => {
        if (event.button !== 0) return;
        const state = motion.current;
        state.dragging = true; state.moved = false; state.lastX = event.clientX; state.startX = event.clientX; state.velocity = 0;
      }}
      onPointerMove={event => {
        const state = motion.current;
        if (!state.dragging) return;
        const delta = (state.lastX - event.clientX) / Math.max(260, root.current.clientWidth * 0.5);
        if (Math.abs(event.clientX - state.startX) > 6) state.moved = true;
        if (state.moved) event.currentTarget.setPointerCapture(event.pointerId);
        state.target += delta; state.velocity = delta * 0.5; state.lastX = event.clientX;
      }}
      onPointerUp={() => { motion.current.dragging = false; }}
      onPointerLeave={event => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) motion.current.dragging = false; }}
      onPointerCancel={() => { motion.current.dragging = false; motion.current.velocity = 0; }}
      onLostPointerCapture={() => { motion.current.dragging = false; }}
      onClickCapture={event => { if (motion.current.moved) { event.preventDefault(); event.stopPropagation(); } }}>
      {items.map((item, index) => <Link key={item.id} to={item.href} ref={element => { cards.current[index] = element; }} className="zoom-project-card" draggable={false} aria-label={`View ${item.title}`}>
        {item.image ? <img src={item.image} alt={item.title} draggable={false} loading="lazy" /> : <div className="zoom-project-placeholder">{item.title}</div>}
        <div className="zoom-project-caption"><span className="font-mono text-[10px] tracking-[0.16em] text-white/65">{String(index + 1).padStart(2, '0')} / SELECTED WORK</span><div className="flex items-end justify-between gap-4"><h3>{item.title}</h3><ArrowUpRight size={22} className="shrink-0" aria-hidden="true" /></div></div>
      </Link>)}
    </div>
    <div className="zoom-project-controls"><p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40">Drag to explore <span className="mx-3 text-white/20">/</span><span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} — {String(items.length).padStart(2, '0')}</span></p><div className="flex gap-2"><button type="button" onClick={() => advance(-1)} aria-label="Previous project"><ArrowLeft size={18} /></button><button type="button" onClick={() => advance(1)} aria-label="Next project"><ArrowRight size={18} /></button></div></div>
  </div>;
}
