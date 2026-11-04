import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackButtonGlow } from '../utils/buttonGlow';
import { WovenCanvas } from '../components/ui/woven-light-hero';
export default function Hero() {
  const reduced = useReducedMotion();
  const enter = delay => ({ initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.85, delay: reduced ? 0 : delay, ease: [0.2, 0.65, 0.3, 0.9] } });
  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-black">
      <WovenCanvas />
      <div aria-hidden="true" className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.18)_45%,transparent_80%)]" />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen pt-16 items-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <motion.div {...enter(0.15)} className="mb-8 inline-flex items-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 text-sm text-white/90">
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Associate UI/UX Designer
            </motion.div>

            {/* Main Heading */}
            <motion.h1 {...enter(0.3)} className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-8xl">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Ehashanul Akter
              </span>{" "}
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/80">
                Designing digital experiences.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p {...enter(0.55)} className="mb-10 text-lg leading-8 text-white/80 sm:text-xl lg:text-2xl max-w-3xl mx-auto">
              UI/UX designer turning complex ideas into simple, engaging products.
            </motion.p>

            {/* CTA Buttons - Modified to Download CV and Contact */}
            <motion.div {...enter(0.75)} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href={`${import.meta.env.BASE_URL}Ehashanul_CV.pdf`}
                download
                className="cv-download"
                onPointerMove={trackButtonGlow}
              >
                <span>Download CV</span>
                <ArrowRight aria-hidden="true" className="cv-download-arrow h-5 w-5" />
              </a>
              <Link to="/#contact" className="contact-cta" onPointerMove={trackButtonGlow}>
                <span>Contact</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div {...enter(0.95)} className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">15+</div>
                <div className="text-white/60 text-sm">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10+</div>
                <div className="text-white/60 text-sm">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/60 text-sm">Creative Support</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}
