import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ShieldCheck, Zap, Layers } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const PROJECT_DATA = {
  unblur: {
    emoji: '📷', platform: 'iOS', title: 'Unblur',
    problem: 'Most users end up with blurry, unusable photos taken in motion or low-light. Existing sharpening tools were either desktop-only, destructive, or required technical expertise.',
    goal: 'Design a one-tap, feel-good iOS experience that uses on-device AI to restore photo sharpness — fast, intuitive, and result-satisfying.',
    process: ['Discover', 'Define', 'Design', 'Test', 'Ship'],
    outcome: '4.8★ App Store rating within 90 days. 200K+ downloads in Q1.',
  },
  blur: {
    emoji: '🌫️', platform: 'Android', title: 'Blur Photo',
    problem: 'Android users lacked a high-quality, intuitive bokeh tool that could replicate DSLR-style depth-of-field.',
    goal: 'Build a playful yet powerful blur studio that makes professional photo aesthetics instant and accessible.',
    process: ['Research', 'Concept', 'Prototype', 'Validate', 'Launch'],
    outcome: 'Reached #1 in Photo & Video on Google Play in 3 markets.',
  },
  // Add more as needed
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECT_DATA[id] || PROJECT_DATA['unblur'];

  return (
    <motion.main
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-14 max-w-5xl mx-auto relative z-10"
    >
      <button 
        onClick={() => navigate('/')}
        className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 font-mono text-[11px] uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Gallery
      </button>

      <div className="w-full aspect-[21/9] rounded-3xl bg-gradient-to-br from-[#0d0422] to-[#050d1e] flex items-center justify-center text-8xl border border-white/10 relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.2),transparent_70%)]" />
        <span className="relative z-10">{project.emoji}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-c300/20 bg-c300/5 text-c300 font-mono text-[10.5px] uppercase tracking-widest mb-6">
             {project.platform} Application
          </div>
          <h1 className="font-bebas text-7xl lg:text-8xl tracking-wider mb-12">{project.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <GlassCard className="p-5">
              <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-3">// ROLE</div>
              <div className="font-semibold text-sm">Lead UI/UX Designer</div>
            </GlassCard>
            <GlassCard className="p-5">
              <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-3">// STUDIO</div>
              <div className="font-semibold text-sm">Kite Games Studio</div>
            </GlassCard>
            <GlassCard className="p-5">
              <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-3">// DURATION</div>
              <div className="font-semibold text-sm">4 Months</div>
            </GlassCard>
          </div>

          <section className="space-y-12">
            <div>
              <h3 className="font-bebas text-2xl tracking-widest text-p200 mb-4">THE PROBLEM</h3>
              <p className="text-white/60 font-light leading-relaxed text-lg">{project.problem}</p>
            </div>
            
            <div>
              <h3 className="font-bebas text-2xl tracking-widest text-p200 mb-4">GOAL & VISION</h3>
              <p className="text-white/60 font-light leading-relaxed text-lg">{project.goal}</p>
            </div>

            <div>
              <h3 className="font-bebas text-2xl tracking-widest text-p200 mb-6">DESIGN PROCESS</h3>
              <div className="grid grid-cols-5 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                {project.process.map((step, i) => (
                  <div key={step} className="bg-ink/40 p-6 text-center">
                    <span className="block font-bebas text-3xl bg-grd-accent bg-clip-text text-transparent mb-1">0{i+1}</span>
                    <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 rounded-[22px] bg-gradient-to-br from-p400/10 to-b400/5 border border-p400/20">
              <h3 className="font-bebas text-2xl tracking-widest text-p300 mb-4">OUTCOME & IMPACT</h3>
              <p className="text-white/80 font-light leading-relaxed italic">"{project.outcome}"</p>
            </div>
          </section>
        </div>

        <aside className="lg:w-80 space-y-6">
          <GlassCard className="bg-p400/5 border-p400/20">
            <h4 className="font-mono text-[10px] text-p300 uppercase tracking-widest mb-6">Key Achievements</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 text-white/60"><ShieldCheck className="w-4 h-4 text-p300 shrink-0" /> Reduced user churn by 14%</li>
              <li className="flex gap-3 text-white/60"><Zap className="w-4 h-4 text-p300 shrink-0" /> Optimized AI processing flow</li>
              <li className="flex gap-3 text-white/60"><Layers className="w-4 h-4 text-p300 shrink-0" /> Built design system for scale</li>
            </ul>
          </GlassCard>
          
          <button className="w-full btn-primary justify-center">
            View Live Prototype <ExternalLink className="w-4 h-4" />
          </button>
        </aside>
      </div>
    </motion.main>
  );
};

export default ProjectDetails;
