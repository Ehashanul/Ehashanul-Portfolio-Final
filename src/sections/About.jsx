import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Download } from 'lucide-react';

const WORDS = [
  ['I’m',false],['Ehashanul,',true],['a',false],['UI/UX',true],['designer',true],['who',false],
  ['turns',false],['complex',false],['ideas',false],['into',false],['clear,',true],['intuitive',true],
  ['digital',false],['experiences.',false],
];

export default function About() {
  const frameRef = useRef(null);
  const cursorRef = useRef(null);
  const clickRef = useRef(null);
  const boxRef = useRef(null);
  const played = useRef(false);
  const inView = useInView(frameRef, { amount: 0.35, once: true });
  const reduced = useReducedMotion();
  const [completed, setCompleted] = useState(false);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !inView || reduced || interacting || played.current) return;
    let alive = true;
    let animations = [];
    document.fonts.ready.then(() => {
      if (!alive || played.current) return;
      played.current = true;
      const { width, height } = frame.getBoundingClientRect();
      const position = (x,y) => `translate3d(${x}px,${y}px,0)`;
      const duration = 4200;
      const cursor = cursorRef.current.animate([
        { offset: 0, transform: position(width * 0.7,height * 0.2), opacity: 0 },
        { offset: 0.1, transform: position(width * 0.7,height * 0.2), opacity: 1 },
        { offset: 0.26, transform: position(0,0), opacity: 1 },
        { offset: 0.32, transform: position(0,0), opacity: 1 },
        { offset: 0.72, transform: position(width,height), opacity: 1 },
        { offset: 0.84, transform: position(width,height), opacity: 1 },
        { offset: 1, transform: position(width,height), opacity: 1 },
      ], { duration, fill: 'forwards', easing: 'ease-in-out' });
      const box = boxRef.current.animate([
        { offset: 0, width: '0%', height: '0%', opacity: 0 },
        { offset: 0.32, width: '0%', height: '0%', opacity: 0 },
        { offset: 0.33, width: '1%', height: '1%', opacity: 1 },
        { offset: 0.72, width: '100%', height: '100%', opacity: 1 },
        { offset: 1, width: '100%', height: '100%', opacity: 1 },
      ], { duration, fill: 'forwards', easing: 'ease-in-out' });
      const click = clickRef.current.animate([
        { offset: 0, transform: 'translate(-50%,-50%) scale(0.3)', opacity: 0 },
        { offset: 0.26, transform: 'translate(-50%,-50%) scale(0.3)', opacity: 0 },
        { offset: 0.28, transform: 'translate(-50%,-50%) scale(0.6)', opacity: 0.8 },
        { offset: 0.34, transform: 'translate(-50%,-50%) scale(1.7)', opacity: 0 },
        { offset: 1, transform: 'translate(-50%,-50%) scale(1.7)', opacity: 0 },
      ], { duration, fill: 'forwards' });
      animations = [cursor,box,click];
      cursor.onfinish = () => { if (alive) { cursor.cancel(); setCompleted(true); } };
    });
    return () => { alive = false; animations.forEach(animation => animation.cancel()); };
  }, [inView,reduced,interacting]);
  return <section id="about" className="about-selection-section relative z-10 bg-black py-14 md:py-20 px-6 md:px-14">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-5 mb-10">
        <h2 className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em]">About me</h2>
        <a href={`${import.meta.env.BASE_URL}Ehashanul_CV.pdf`} download className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.025] px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.12em] text-white/70 hover:text-white hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8FF5F]">
          <span>Download CV</span>
          <Download aria-hidden="true" size={14} />
        </a>
      </div>
      <div ref={frameRef} className={`about-selection-frame ${completed || reduced ? 'about-selection-complete' : ''}`} onPointerDown={() => { setCompleted(true); setInteracting(true); }}>
        <span aria-hidden="true" ref={boxRef} className="about-drag-selection">{['top-left','top-right','bottom-left','bottom-right'].map(corner => <span key={corner} className={`about-frame-handle about-frame-${corner}`} />)}</span>
        <p className="about-belief-label">A little about me</p>
        <blockquote className="about-selection-quote">
          <span aria-hidden="true" className="about-quote-mark">“</span>
          {WORDS.map(([word,bold],index) => <span key={index}><span data-about-word className={`about-selection-word ${bold ? 'about-word-bold' : ''}`}><span className="relative">{word}</span></span>{index < WORDS.length - 1 ? ' ' : ''}</span>)}
          <span aria-hidden="true" className="about-quote-mark">”</span>
        </blockquote>
        <span aria-hidden="true" ref={clickRef} className="about-auto-click" />
        <span aria-hidden="true" ref={cursorRef} className="about-auto-cursor">
          <svg width="26" height="32" viewBox="0 0 26 32" fill="none"><path d="M3 2L22 19L13 20L9 29L3 2Z" fill="#D8FF5F" stroke="#11140a" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          <span className="about-cursor-label">Ehashanul</span>
        </span>
      </div>
    </div>
  </section>;
}
