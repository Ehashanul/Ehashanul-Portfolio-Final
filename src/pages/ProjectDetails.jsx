import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { mediaUrl } from '../utils/projectMedia';
import { externalUrl } from '../utils/projectContent';
import ProjectContent from '../components/ProjectContent';

export default function ProjectDetails() {
  const { id } = useParams();
  const project = useProjects().find(item => item.id === id);
  if (!project) return <main className="pt-40 pb-24 px-6 text-center"><h1 className="text-3xl mb-6">Project unavailable</h1><p className="text-white/50 mb-6">This project may be loading, unpublished, or removed.</p><Link className="btn-secondary" to="/projects">View all projects</Link></main>;
  const details = [['Role',project.role],['Studio / client',project.studio],['Duration',project.duration]].filter(([,value]) => value);
  const deliverables = (project.deliverables || []).filter(Boolean);
  const liveUrl = externalUrl(project.liveUrl);
  return <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="pt-36 pb-32 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
    <Link to="/projects" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-12"><ArrowLeft size={16} /> All projects</Link>
    {!project.hideHero && (project.heroImage || project.thumbnail) && <img src={mediaUrl(project.heroImage || project.thumbnail)} alt={project.heroAlt || project.title} className="w-full max-h-[600px] object-cover rounded-[32px] border border-white/10 mb-12" />}
    {project.platform && <p className="text-xs font-mono uppercase tracking-widest text-white/50 mb-6">{project.platform}</p>}
    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight break-words">{project.title}</h1>
    {project.sub && <p className="text-xl md:text-2xl text-white/50 mt-5">{project.sub}</p>}
    {!project.hideMetadata && details.length > 0 && <dl className="grid sm:grid-cols-3 gap-4 my-12">{details.map(([label,value]) => <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"><dt className="text-xs uppercase tracking-widest text-white/40 mb-3">{label}</dt><dd>{value}</dd></div>)}</dl>}
    <div className={`mt-16 ${deliverables.length || liveUrl ? 'grid lg:grid-cols-[1fr_260px] gap-12' : ''}`}>
      <ProjectContent project={project} />
      {(deliverables.length > 0 || liveUrl) && <aside className="space-y-6 lg:sticky lg:top-32 h-fit">
        {deliverables.length > 0 && <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"><h2 className="text-xs uppercase tracking-widest text-white/40 mb-6">Deliverables</h2><ul className="space-y-4 text-sm text-white/70">{deliverables.map((item,index) => <li key={index}>{item}</li>)}</ul></div>}
        {liveUrl && <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center w-full">View live project <ExternalLink size={16} /></a>}
      </aside>}
    </div>
  </motion.main>;
}
