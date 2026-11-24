import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';
import Home from './pages/Home';
import AllProjects from './pages/AllProjects';
import ProjectDetails from './pages/ProjectDetails';
import Admin from './pages/Admin';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HalftoneWordmarkFooter from './components/ui/halftone-wordmark-footer';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(null);
  useLayoutEffect(() => {
    const samePage = previousPath.current === pathname;
    previousPath.current = pathname;
    let anchor = '';
    try { anchor = decodeURIComponent(hash.slice(1)); } catch { /* Ignore malformed anchors. */ }
    const target = anchor && document.getElementById(anchor);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (target) target.scrollIntoView({ behavior: samePage && !reduced ? 'smooth' : 'instant', block: 'start' });
    else if (!samePage) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.replace(/\/+$/, '') === '/admin';
  return (
    <>
      <ScrollToTop />
      <div className={isAdmin ? 'admin-layout relative min-h-screen' : 'relative min-h-screen cursor-none'}>
        <CustomCursor />
        {/* Background Layers */}
        <div className="bg-grid" />
        <div className="bg-orb w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)] -top-48 -left-36 animate-orb-drift" />
        <div className="bg-orb w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.03),transparent_70%)] -bottom-24 -right-20 animate-orb-drift [animation-direction:reverse]" />
        <div className="bg-noise" />

        {!isAdmin && <Navbar />}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>

        {!isAdmin && <footer className="relative z-10 bg-black overflow-hidden">
          {/* Top bar */}
          <div className="border-t border-white/[0.07] px-8 py-4 flex justify-between items-center">
            <span className="text-white/40 font-mono text-[10px] tracking-widest">
              © 2025 Ehashanul. All Rights Reserved.
            </span>
            <div className="flex items-center gap-6 font-mono text-[10px] tracking-widest text-white/40">
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <span className="text-white/20">|</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>

          <HalftoneWordmarkFooter
            wordmark="EHASHANUL"
            fontFamily='"Bebas Neue", sans-serif'
            fontWeight={400}
            palette={{ background: '#000000', ink: '#f0f1f5', warm: '#b8c9f2' }}
            height="clamp(170px, 24vw, 420px)"
            dotGap={5}
            radius={90}
            crop={0.12}
            grain={0.25}
            className="select-none"
          />
        </footer>}
      </div>
    </>
  );
}

function App() {
  return <Router><AppLayout /></Router>;
}

export default App;
