import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen cursor-none">
        <CustomCursor />
        {/* Background Layers */}
        <div className="bg-grid" />
        <div className="bg-orb w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)] -top-48 -left-36 animate-orb-drift" />
        <div className="bg-orb w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.03),transparent_70%)] -bottom-24 -right-20 animate-orb-drift [animation-direction:reverse]" />
        <div className="bg-noise" />


        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Routes>
        </AnimatePresence>

        <footer className="relative z-10 bg-black overflow-hidden">
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

          {/* Massive name — left aligned, flush to bottom */}
          <div className="relative overflow-hidden leading-none select-none">
            {/* Ghost rounded rectangle logo mark */}
            <div className="absolute left-[-2vw] top-1/2 -translate-y-1/2 w-[16vw] h-[14vw] rounded-[2.5vw] border-[2.5vw] border-white/[0.07] pointer-events-none" />

            {/* Left & right dark edge vignettes */}
            <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />

            <h2 className="font-bebas text-[19vw] leading-none tracking-tight text-white pl-[8vw] pb-0 -mb-[1.5vw]">
              EHASHANUL
            </h2>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
