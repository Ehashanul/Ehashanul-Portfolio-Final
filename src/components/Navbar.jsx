import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
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
    <div className="fixed top-8 left-0 right-0 z-[500] pointer-events-none flex justify-center">
      <nav 
        className={`pointer-events-auto flex items-center justify-between px-6 py-2 rounded-full border transition-all duration-500 ${
          scrolled 
            ? 'bg-black/40 backdrop-blur-2xl border-white/10 w-[90%] max-w-4xl shadow-2xl' 
            : 'bg-transparent border-transparent w-[95%] max-w-7xl'
        }`}
      >
        <Link to="/" className="text-xl font-bold text-white tracking-tighter shrink-0">Ehashanul Akter</Link>

        {/* Desktop Navigation - The Frosted Middle Part */}
        <div className={`hidden md:flex items-center space-x-1 rounded-full p-1 transition-all duration-500 ${
          scrolled ? 'bg-white/5 border border-white/5' : 'bg-white/5 border border-white/10 backdrop-blur-xl'
        }`}>
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

        <div className="flex items-center gap-4 shrink-0">
          <Link to="/#contact" className="hidden sm:block">
            <button className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-p300 hover:text-white transition-all flex items-center gap-2">
              Hire <ArrowRight className="w-3 h-3" />
            </button>
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
              <Link to="/#contact" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest">
                  Hire Me
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
