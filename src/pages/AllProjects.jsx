import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { mediaUrl } from '../utils/projectMedia';
import './AllProjects.css';


function ProjectCard({ project, index, reduced }) {
  const image = !project.hideCardImage && mediaUrl(project.thumbnail || project.img || project.heroImage);
  return <motion.article layout={!reduced} transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    id={`project-${project.id}`} className="archive-project">
    {!project.hideCardImage && <div className="archive-project-image">
      {image ? <img src={image} alt={project.thumbnailAlt || (project.hideCardTitle ? '' : project.title)} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
        : <div className="archive-project-placeholder" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div>}
      {!project.hideCardTitle ? <h2 className="archive-project-tab">{project.title}</h2> : <span className="archive-project-tab">{project.name || project.platform || 'Project'}</span>}
      <span className="archive-image-visit">View project <ArrowUpRight size={15} /></span>
    </div>}
    <div className="archive-project-info">
      <span className="archive-project-index">{String(index + 1).padStart(2, '0')}</span>
      <div className="archive-project-name">
        {project.hideCardImage && !project.hideCardTitle && <h2>{project.title}</h2>}
        {!project.hideCardSubtitle && project.sub && <p>{project.sub}</p>}
      </div>
      <span className="archive-project-platform">{project.name || project.platform || 'Independent project'}</span>
      <span className="archive-project-role">{project.role || '—'}</span>
      <ArrowUpRight className="archive-project-arrow" size={20} aria-hidden="true" />
    </div>
    {project.description && <p className="archive-project-description">{project.description}</p>}
    <Link className="archive-project-link" to={`/project/${encodeURIComponent(project.id)}`} aria-label={`View ${project.hideCardTitle ? 'project details' : project.title}`} />
  </motion.article>;
}

export default function AllProjects() {
  const projects = useProjects();
  const reduced = useReducedMotion();

  return <motion.main className="project-archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <header className="archive-header">
      <Link to="/" className="archive-back"><ArrowLeft size={14} /> Back to home</Link>
      <div className="archive-intro">
        <h1>All <span>projects</span><sup>({String(projects.length).padStart(2, '0')})</sup></h1>
        <p>A collection of interfaces, experiences, and ideas brought to life. Each project, a different problem to make simpler.</p>
      </div>
    </header>
    <section aria-label="Project collection">
      <div className="archive-collection archive-gallery">
        {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} reduced={reduced} />)}
      </div>
      {!projects.length && <div className="archive-empty"><h2>Good work is on its way.</h2><p>Projects will appear here when published.</p></div>}
      <div className="archive-end"><span>Thoughtful design. Every detail.</span><Link to="/#contact">Have something in mind? <ArrowUpRight size={16} /></Link></div>
    </section>
  </motion.main>;
}
