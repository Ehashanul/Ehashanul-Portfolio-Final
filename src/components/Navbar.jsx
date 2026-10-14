import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { trackButtonGlow } from '../utils/buttonGlow';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const linksRef = useRef(null);
  const [pillSize, setPillSize] = useState({ width: 0, height: 0 });
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useLayoutEffect(() => {
    const links = linksRef.current;
    const measure = () => setPillSize({ width: links.offsetWidth, height: links.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(links);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: isHome ? '#home' : '/#home' },
    { name: 'Expertise', href: isHome ? '#expertise' : '/#expertise' },
    { name: 'Work', href: isHome ? '#work' : '/#work' },
    { name: 'About', href: isHome ? '#about' : '/#about' },
  ];

  const handleLinkClick = (href) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.getElementById(href.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="site-nav-enter fixed top-8 left-0 right-0 z-[500] pointer-events-none flex justify-center">
      <nav 
        className={`relative isolate pointer-events-auto flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between px-6 py-2 rounded-full transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'w-[90%] max-w-4xl'
            : 'w-[95%] max-w-7xl'
        }`}
      >
        {/* One glass surface expands from the link pill to the full navbar. */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 backdrop-blur-2xl transition-all duration-500 ease-in-out motion-reduce:transition-none"
          style={{
            width: scrolled ? '100%' : `${pillSize.width}px`,
            height: scrolled ? '100%' : `${pillSize.height}px`,
            opacity: scrolled || pillSize.width > 0 ? 1 : 0,
            backgroundColor: scrolled ? 'rgba(80, 80, 80, 0.35)' : 'rgba(100, 100, 100, 0.2)',
            boxShadow: scrolled ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 0 0 0 rgba(0, 0, 0, 0)',
          }}
        />
        <Link to="/" className="text-xl font-bold text-white tracking-tighter shrink-0">Ehashanul Akter</Link>

        <div ref={linksRef} className="hidden md:flex items-center space-x-1 rounded-full border border-transparent p-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="rounded-full px-5 py-2 text-[10px] font-mono uppercase tracking-widest text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0 justify-self-end">
          <Link to="/#contact" className="hire-cta hidden sm:inline-flex" onPointerMove={trackButtonGlow}>
              <span>Hire</span>
              <span aria-hidden="true" className="hire-arrow-pulse">
                <ArrowRight className="hire-arrow-echo w-3 h-3" />
                <ArrowRight className="w-3 h-3" />
              </span>
          </Link>
          
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-4 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 flex flex-col gap-6 md:hidden shadow-2xl"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-2xl font-bebas tracking-widest text-white/70 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/#contact" onClick={() => setMobileMenuOpen(false)} className="hire-cta hire-cta-mobile" onPointerMove={trackButtonGlow}>
                <span>Hire Me</span>
                <span aria-hidden="true" className="hire-arrow-pulse">
                  <ArrowRight className="hire-arrow-echo w-4 h-4" />
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
