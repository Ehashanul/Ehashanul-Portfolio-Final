import { useEffect, useId, useRef, useState } from 'react';

// Once per page visit, including when navigating away and back to the homepage.
let entrancePlayed = false;

export default function useCardDustReveal(root, count, reduced, layoutReady, compact) {
  const uid = useId().replace(/:/g, '');
  const alpha = useRef([]);
  const displacement = useRef([]);
  const [revealed, setRevealed] = useState(entrancePlayed);

  useEffect(() => {
    if (!layoutReady) return;
    const element = root.current;
    const cards = [...element.querySelectorAll('.expertise-stack-card')];
    if (reduced || entrancePlayed) { setRevealed(true); return; }
    let frame = 0;
    let started = false;
    const clear = () => cards.forEach(card => { card.style.removeProperty('filter'); });
    cards.forEach((card, index) => { card.style.filter = `url(#${uid}-dust-${index})`; });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      entrancePlayed = true;
      observer.disconnect();
      setRevealed(true);
      const start = performance.now();
      const draw = now => {
        let done = true;
        cards.forEach((card, index) => {
          const progress = Math.max(0, Math.min(1, (now-start-index*110)/2600));
          if (progress < 1) done = false;
          const eased = 1-Math.pow(1-progress, 2);
          alpha.current[index]?.setAttribute('intercept', String(-11.5+eased*12.5));
          displacement.current[index]?.setAttribute('scale', String(42*Math.pow(1-eased, 2)));
          if (progress === 1) card.style.removeProperty('filter');
        });
        if (!done) frame = requestAnimationFrame(draw);
        else clear();
      };
      frame = requestAnimationFrame(draw);
    }, { threshold: .12 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); clear(); };
  }, [root, count, reduced, layoutReady, compact, uid]);

  const filters = <svg className="expertise-dust-definitions" width="0" height="0" aria-hidden="true" focusable="false"><defs>{Array.from({ length: count }, (_, index) => <filter key={index} id={`${uid}-dust-${index}`} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="1" seed={index*7+3} result="grain" />
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .333 .333 .334 0 0" result="grainAlpha" />
    <feComponentTransfer in="grainAlpha" result="arrival"><feFuncA ref={node => { alpha.current[index] = node; }} type="linear" slope="12" intercept="-11.5" /></feComponentTransfer>
    <feDisplacementMap ref={node => { displacement.current[index] = node; }} in="SourceGraphic" in2="grain" scale="42" xChannelSelector="R" yChannelSelector="G" result="scatteredCard" />
    <feComposite in="scatteredCard" in2="arrival" operator="in" />
  </filter>)}</defs></svg>;
  return { filters, pending: !revealed && !reduced };
}
