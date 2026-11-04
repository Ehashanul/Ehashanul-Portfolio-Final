import { mediaUrl } from '../utils/projectMedia';
import { externalUrl } from '../utils/projectContent';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

export default function AllProjects() {
  const projects = useProjects();
  return <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pt-32 pb-24 px-6 md:px-14 max-w-7xl mx-auto relative z-10">
    <Link to="/" className="inline-flex items-center gap-2 text-white/45 hover:text-white mb-12 font-mono text-[10px] uppercase tracking-widest"><ArrowLeft size={16} /> Back to home</Link>
    <SectionHeading number="02" label="The complete collection" title="All" accent="projects" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">{projects.map(project => {
      const url = externalUrl(project.liveUrl);
      return <article key={project.id} id={`project-${project.id}`} className="group scroll-mt-32">
        {!project.hideCardImage && <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">{(project.thumbnail || project.img || project.heroImage) && <img src={mediaUrl(project.thumbnail || project.img || project.heroImage)} alt={project.thumbnailAlt || project.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />}</div>}
        <div className="flex items-start justify-between gap-5 mt-5"><div>{project.platform && <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.18em] mb-3">{project.platform}</p>}{!project.hideCardTitle && <h2 className="text-2xl md:text-3xl font-medium tracking-tight">{project.title}</h2>}{!project.hideCardSubtitle && project.sub && <p className="mt-2 text-sm text-white/50 leading-relaxed">{project.sub}</p>}</div>{url && <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title} (opens in a new tab)`} className="inline-flex items-center gap-2 shrink-0 text-xs text-white/65 hover:text-white border border-white/20 rounded-full px-4 py-3">Visit <ArrowUpRight size={16} /></a>}</div>
      </article>;
    })}</div>
    {!projects.length && <p className="py-16 text-white/50">Projects will appear here when published.</p>}
  </motion.main>;
}
