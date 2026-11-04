import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Grid2X2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { mediaUrl } from '../utils/projectMedia';
import { externalUrl } from '../utils/projectContent';
import ProjectContent from '../components/ProjectContent';

export default function ProjectDetails() {
  const { id } = useParams();
  const projects = useProjects();
  const index = projects.findIndex(item => item.id === id);
  const project = projects[index];
  if (!project) return <main className="pt-40 pb-24 px-6 text-center"><h1 className="text-3xl mb-6">Project unavailable</h1><p className="text-white/50 mb-6">This project may be loading, unpublished, or removed.</p><Link className="btn-secondary" to="/projects">View all projects</Link></main>;
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const liveUrl = externalUrl(project.liveUrl);
  const deliverables = (project.deliverables || []).filter(Boolean);
  const details = [
    ...(!project.hideMetadata ? [['Client', project.studio], ['Role', project.role], ['Duration', project.duration]] : []),
    ['Disciplines used', deliverables.length ? deliverables.join('\n') : project.platform],
    ['Project details', project.overview || project.sub],
  ].filter(([,value]) => value);
  return <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dixor-project relative z-10">
    <header className="dixor-banner dixor-container"><p className="dixor-eyebrow">The thinking. The process. The details.</p><h1>PROJECT <span>STORY</span></h1><nav aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/projects">Projects</Link><span aria-hidden="true">/</span><span aria-current="page">{project.title}</span></nav></header>
    <article>
      <div className="dixor-container">
        {!project.hideHero && (project.heroImage || project.thumbnail) && <div className="dixor-cover"><img src={mediaUrl(project.heroImage || project.thumbnail)} alt={project.heroAlt || project.title} fetchPriority="high" /></div>}
        <div className="dixor-intro">{project.platform && <span className="dixor-category">{project.platform}</span>}<h2>{project.title}</h2>
          <dl className="dixor-facts">{details.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}{liveUrl && <div><dt>Live project</dt><dd><a href={liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#D5E69D] hover:text-white">Visit project <ArrowUpRight size={17} /></a></dd></div>}</dl>
        </div>
      </div>
      <ProjectContent project={project} editorial />
    </article>
    <nav aria-label="Project navigation" className="dixor-pagination dixor-container">
      {projects.length > 1 && <Link to={`/project/${previous.id}`} className="dixor-page-link"><ArrowLeft aria-hidden="true" /><div><span>Previous project</span><strong>{previous.hideCardTitle ? 'View project' : previous.title}</strong></div></Link>}
      <Link to="/projects" className="dixor-all" aria-label="View all projects"><Grid2X2 size={24} /></Link>
      {projects.length > 1 && <Link to={`/project/${next.id}`} className="dixor-page-link dixor-page-link--next"><div><span>Next project</span><strong>{next.hideCardTitle ? 'View project' : next.title}</strong></div><ArrowRight aria-hidden="true" /></Link>}
    </nav>
  </motion.main>;
}
