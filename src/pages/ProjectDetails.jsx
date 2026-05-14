import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ShieldCheck, Zap, Layers } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useProjects } from '../hooks/useProjects';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const projects = useProjects();
  
  const project = projects.find(p => p.id === id) || projects[0];

  if (!project) return null;

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-32 px-14 max-w-6xl mx-auto relative z-10"
    >
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 font-mono text-[11px] uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Gallery
      </button>

      {/* Hero Image - Wide */}
      <div className="w-full aspect-[21/9] rounded-[40px] bg-white/[0.03] border border-white/10 relative overflow-hidden mb-20 group">
        <img 
          src={`${import.meta.env.BASE_URL}${(project.heroImage || project.thumbnail || project.img || '').replace(/^\//, '')}`} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-[10vw] opacity-40 mix-blend-overlay font-bebas tracking-tighter">
          {project.title}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-p300/20 bg-p300/5 text-p300 font-mono text-[10px] uppercase tracking-[0.2em] mb-8">
             <span className="w-1.5 h-1.5 rounded-full bg-p300 animate-pulse" />
             {project.platform} Experience
          </div>
          <h1 className="font-bebas text-7xl lg:text-[10rem] leading-[0.9] tracking-tight mb-16 uppercase italic">
            {project.title} <span className="bg-grd-accent bg-clip-text text-transparent not-italic font-normal">{project.sub}</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24">
            <GlassCard className="p-6 rounded-3xl border-white/5">
              <div className="font-mono text-[9px] text-white/20 uppercase tracking-[0.3em] mb-4">// ROLE</div>
              <div className="font-medium text-white/90 text-sm tracking-wide">{project.role}</div>
            </GlassCard>
            <GlassCard className="p-6 rounded-3xl border-white/5">
              <div className="font-mono text-[9px] text-white/20 uppercase tracking-[0.3em] mb-4">// STUDIO</div>
              <div className="font-medium text-white/90 text-sm tracking-wide">{project.studio}</div>
            </GlassCard>
            <GlassCard className="p-6 rounded-3xl border-white/5">
              <div className="font-mono text-[9px] text-white/20 uppercase tracking-[0.3em] mb-4">// DURATION</div>
              <div className="font-medium text-white/90 text-sm tracking-wide">{project.duration}</div>
            </GlassCard>
          </div>

          <section className="space-y-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 font-bebas text-3xl tracking-widest text-p300 uppercase">The Challenge</div>
              <div className="md:col-span-8 text-white/50 font-light leading-relaxed text-xl">{project.problem}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 font-bebas text-3xl tracking-widest text-p300 uppercase">The Vision</div>
              <div className="md:col-span-8 text-white/50 font-light leading-relaxed text-xl">{project.goal}</div>
            </div>

            {/* Gallery Section - 3 More Images */}
            <div className="space-y-12">
               <div className="font-bebas text-3xl tracking-widest text-p300 uppercase">Gallery</div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {(project.gallery || []).map((img, i) => (
                   <div key={i} className="rounded-3xl border border-white/10 overflow-hidden aspect-[4/5] bg-white/5">
                      <img 
                        src={`${import.meta.env.BASE_URL}${(img || '').replace(/^\//, '')}`} 
                        alt={`Gallery ${i+1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 opacity-80 hover:opacity-100"
                      />
                   </div>
                 ))}
               </div>
            </div>

            <div>
              <div className="font-bebas text-3xl tracking-widest text-p300 uppercase mb-12">Methodology</div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {project.process.map((step, i) => (
                  <div key={step} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl text-center group hover:bg-white/[0.05] transition-all">
                    <span className="block font-bebas text-4xl text-white/10 group-hover:text-p300 transition-colors mb-2">0{i+1}</span>
                    <div className="font-mono text-[9px] text-white/40 uppercase tracking-[0.2em]">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-12 lg:p-16 rounded-[48px] bg-gradient-to-br from-p500/10 via-b500/5 to-transparent border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 text-white/[0.02] font-bebas text-9xl italic">Impact</div>
              <h3 className="font-bebas text-4xl tracking-widest text-white mb-8 relative z-10 italic">OUTCOME & RESULTS</h3>
              <p className="text-white/80 font-light leading-relaxed text-2xl relative z-10 italic">
                "{project.outcome}"
              </p>
            </div>
          </section>
        </div>

        <aside className="lg:w-80 space-y-6 lg:sticky lg:top-32 h-fit">
          <GlassCard className="bg-white/[0.02] border-white/10 p-8 rounded-[32px]">
            <h4 className="font-mono text-[10px] text-p300 uppercase tracking-[0.3em] mb-8">Key Deliverables</h4>
            <ul className="space-y-6">
              {[
                { label: 'Conversion Lift', icon: <Zap className="w-4 h-4" /> },
                { label: 'Design System', icon: <Layers className="w-4 h-4" /> },
                { label: 'User Validation', icon: <ShieldCheck className="w-4 h-4" /> }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-white/50 text-xs tracking-wider uppercase">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-p300">
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </GlassCard>
          
          <button className="w-full py-5 rounded-[24px] bg-white text-black font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-p300 hover:text-white transition-all shadow-2xl shadow-white/5">
            Live Case Study <ExternalLink className="w-4 h-4" />
          </button>
        </aside>
      </div>
    </motion.main>
  );
};

export default ProjectDetails;
