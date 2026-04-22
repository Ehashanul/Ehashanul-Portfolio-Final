import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-14 h-[68px] transition-all duration-500 border-b ${
        scrolled ? 'bg-ink/55 backdrop-blur-2xl border-p400/25' : 'bg-transparent border-white/5'
      }`}
    >
      <Link to="/" className="font-bebas text-2xl tracking-[3px] bg-grd-accent bg-clip-text text-transparent">
        KGS
      </Link>

      <div className="flex items-center gap-10">
        {['Home', 'Expertise', 'Work', 'Contact'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`}
            className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/40 hover:text-p200 transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-5 py-2 rounded-full border-1.5 border-p400/45 bg-p400/10 text-p200 text-xs font-semibold tracking-wide hover:bg-p400/30 hover:shadow-[0_0_24px_rgba(124,58,237,0.35)] transition-all"
      >
        Hire Me ✦
      </motion.button>
    </nav>
  );
};

export default Navbar;
