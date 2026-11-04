// Adapted from the WorksWheel component supplied by the portfolio owner.
"use client";
import * as React from "react";
import { Link } from "react-router-dom";
const cn = (...values) => values.filter(Boolean).join(" ");
const CARD_H = 0.38;
const CARD_MAX_W = 0.34;
const CARD_RATIO = 1.45;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 1.14;
const BOW = 1.82;
const TITLE = 0.124;
const INDEX = 0.04;
const CULL = 1.6;
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rad = (deg) => deg * Math.PI / 180;
const bowAt = (drumDeg, bow) => -bow * (1 - Math.cos(rad(drumDeg)));
function place(ringDeg, drumDeg, ringR, drumR, bow, m) {
  return `translateX(${m * bowAt(drumDeg, bow)}px) rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px) rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`;
}
function WorksWheel({
  items,
  label = "Works '26",
  action = "View",
  className,
  ...props
}) {
  const stageRef = React.useRef(null);
  const wheelRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  const labelRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const wakeRef = React.useRef(() => {});
  const moved = React.useRef(false);
  const dragStart = React.useRef(0);
  const uid = React.useId();
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState({ w: 0, h: 0 });
  const count = items.length;
  const last = Math.max(count - 1, 0);
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * (w < 640 ? 0.72 : CARD_MAX_W));
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count ? clamp(2 * Math.PI * ringR / count * 0.82 / (cardW || 1), 0.16, 1) : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * TITLE,
      index: cardH * INDEX
    };
  }, [stage, count]);
  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;
    const draw = () => {
      frame = 0;
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 5e-4) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);
      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);
      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }
      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m
          );
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          const shown = !(m > 0.5 && Math.abs(d) > CULL);
          card.style.pointerEvents = shown ? 'auto' : 'none';
          card.tabIndex = shown ? 0 : -1;
          card.setAttribute('aria-hidden', String(!shown));
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }
      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);
      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => prev === near ? prev : near);
      if (Math.abs(target.current - turn.current) > 0.0005) frame = requestAnimationFrame(draw);
    };
    wakeRef.current = () => { if (!frame) frame = requestAnimationFrame(draw); };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); wakeRef.current = () => {}; };
  }, [metrics, stage.h, count, last, reduced]);
  const to = React.useCallback(
    (next) => {
      target.current = clamp(next, 0, last + 1);
      wakeRef.current();
    },
    [last]
  );
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event) => {
      const next = target.current + event.deltaY / WHEEL_UNITS;
      if (next > 0 && next < last + 1) event.preventDefault();
      to(next);
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);
  const drag = React.useRef(null);
  const settling = React.useRef(0);
  return <section
    aria-label={label}
    className={cn(
      "bg-black text-white relative h-full min-h-[24rem] w-full overflow-hidden select-none",
      className
    )}
    {...props}
  ><div
    ref={stageRef}
    tabIndex={0}
    role="group"
    aria-label={label}
    aria-describedby={`${uid}-help`}
    className="focus-visible:outline-white absolute inset-0 cursor-grab touch-pan-x outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing"
    style={{ perspective: `${metrics.depth}px` }}
    onPointerDown={(event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      drag.current = event.clientY;
      dragStart.current = event.clientY;
      moved.current = false;
    }}
    onPointerMove={(event) => {
      if (drag.current === null) return;
      if (Math.abs(event.clientY - dragStart.current) > 6) {
        moved.current = true;
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
      }
      if (!moved.current) return;
      to(target.current + (drag.current - event.clientY) / DRAG_UNITS);
      drag.current = event.clientY;
    }}
    onPointerUp={() => {
      drag.current = null;
      if (target.current > 1) to(Math.round(target.current));
    }}
    onPointerCancel={() => { drag.current = null; to(Math.round(target.current)); }}
    onLostPointerCapture={() => { drag.current = null; }}
    onClickCapture={(event) => { if (moved.current) { event.preventDefault(); event.stopPropagation(); moved.current = false; } }}
    onKeyDown={(event) => {
      if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
      else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
      else if (event.key === "Home") to(0);
      else if (event.key === "End") to(last + 1);
      else return;
      event.preventDefault();
    }}
  ><div
    ref={wheelRef}
    className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
  >{items.map((item, i) => {
    const Tag = item.href ? Link : "div";
    return <React.Fragment key={item.id || item.title}><Tag
      id={`${uid}-work-${i}`}
      aria-current={i === active ? 'true' : undefined}
      to={item.href}
      ref={(node) => {
        cardRefs.current[i] = node;
      }}
      className="group absolute [backface-visibility:hidden]"
      style={{
        width: metrics.cardW,
        height: metrics.cardH,
        marginLeft: -metrics.cardW / 2,
        marginTop: -metrics.cardH / 2
      }}
    ><span className="bg-white/5 shadow-black/40 relative block size-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_18px_40px_-18px_var(--tw-shadow-color)]">{item.image ? <img
      src={item.image}
      alt={item.title}
      draggable={false}
      className="size-full object-cover"
    /> : <span className="block size-full bg-[radial-gradient(ellipse_at_top_right,#484b56,#121316_70%)]" />}{action && item.href ? <span className="bg-black/80 text-white pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] opacity-0 backdrop-blur-sm transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"><svg
      viewBox="0 0 12 12"
      className="size-2.5"
      aria-hidden="true"
    ><path
      d="M3 9 9 3M4 3h5v5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    /></svg>{action}</span> : null}</span></Tag></React.Fragment>;
  })}</div></div>{
    /* Ring title and front-card title trade places across the transition.
       Type is sized off the measured stage, not vh, so the wheel keeps its
       proportions inside a card as well as at full bleed. */
  }<div
    ref={labelRef}
    className="pointer-events-none absolute inset-0 grid place-items-center tracking-tight"
    style={{ fontSize: Math.max(24, metrics.title) }}
  >{label}</div><div
    ref={titleRef}
    className="ww-front-title pointer-events-none absolute top-1/2 left-[5%] -translate-y-1/2 tracking-tight opacity-0 max-w-[20%] leading-tight"
    style={{ fontSize: Math.max(24, metrics.title) }}
  >{items[active]?.title}</div><ol
    className="ww-project-index text-white/40 absolute top-[7.5%] right-[2.5%] text-right leading-[1.75]"
    style={{ fontSize: Math.max(11, metrics.index) }}
  >{items.map((item, i) => <li key={item.id || item.title}><button
    type="button"
    onClick={() => to(i + 1)}
    className={cn(
      "focus-visible:outline-white cursor-pointer transition-colors outline-none focus-visible:outline-1",
      i === active && "text-white font-medium"
    )}
  >{item.title}</button></li>)}</ol><p id={`${uid}-help`} className="sr-only">Scroll or drag vertically to browse projects. Use Up and Down arrow keys to select a project, then Tab to its link. Page scrolling continues at either end.</p></section>;
}
var stdin_default = WorksWheel;
export {
  WorksWheel,
  stdin_default as default
};
