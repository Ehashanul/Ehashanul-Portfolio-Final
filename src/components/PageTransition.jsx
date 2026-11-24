import { useLayoutEffect, useRef } from 'react';
import { motion, useIsPresent, useReducedMotion } from 'framer-motion';

export default function PageTransition({ location, children }) {
  const root = useRef(null);
  const lastPath = useRef(null);
  const reduced = useReducedMotion();
  const present = useIsPresent();
  const admin = location.pathname.replace(/\/+$/, '') === '/admin';
  const move = !reduced && !admin;

  // This runs when the incoming page mounts, after the outgoing page has left.
  // A section link within the same page scrolls without replaying the transition.
  useLayoutEffect(() => {
    const samePage = lastPath.current === location.pathname;
    lastPath.current = location.pathname;
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    let anchor = '';
    try { anchor = decodeURIComponent(location.hash.slice(1)); } catch { /* Ignore malformed anchors. */ }
    const target = anchor && document.getElementById(anchor);
    if (target) target.scrollIntoView({ behavior: samePage && !reduced ? 'smooth' : 'instant', block: 'start' });
    else if (!samePage) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.style.scrollBehavior = previous;
  }, [location.pathname, location.hash, reduced]);

  return <motion.div ref={root} className="portfolio-page-transition" initial="initial" animate="enter" exit="exit"
    variants={{
      initial: { opacity: 0, y: move ? 16 : 0 },
      enter: { opacity: 1, y: 0, transition: { duration: reduced ? .12 : .48, ease: [.22, 1, .36, 1] } },
      exit: { opacity: 0, y: move ? -10 : 0, transition: { duration: reduced ? .08 : .18, ease: [.4, 0, 1, 1] } },
    }}
    style={{ pointerEvents: present ? undefined : 'none' }}
    onAnimationComplete={phase => {
      if (phase !== 'enter' || admin || location.hash) return;
      const main = root.current?.querySelector('main');
      if (main) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
    }}>
    {children}
  </motion.div>;
}
