import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

        <footer className="border-t border-white/10 py-12 px-14 flex justify-between items-center relative z-10">
          <div className="font-bebas text-2xl tracking-[3px] text-white">Ehashanul Akter.</div>
          <div className="text-white/40 text-sm">© 2025 — Ehashanul Akter</div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
