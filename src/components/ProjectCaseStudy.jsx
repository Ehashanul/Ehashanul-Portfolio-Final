import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import ProjectContent, { ContentImage } from './ProjectContent';
import { externalUrl } from '../utils/projectContent';
import '../pages/ProjectDetails.css';

export default function ProjectCaseStudy({ project, preview = false, nextProject }) {
  const site = externalUrl(project.liveUrl);
  const services = (project.deliverables || []).filter(value => value.trim());
  const hero = project.heroImage || project.thumbnail || project.img;
  const tools = (project.tools || []).filter(value => value.trim());
  const facts = [
    [project.name ? 'Client' : 'Project', project.name || project.title],
    [project.date ? 'Date' : project.year ? 'Year' : 'Timeline', project.date || project.year || project.duration],
    ['Services', services.join(', ') || project.role],
    ['Project team', project.team || project.studio],
    ['Tools', tools.join(', ')],
  ].filter(([, value]) => value);
  return <article className={`case-study${preview ? ' case-study-preview' : ''}`}>
    <header className="case-header case-container">
      {preview ? <p className="case-back">Draft preview / Unpublished changes</p> : <Link to="/projects" className="case-back"><ArrowLeft size={14} /> All projects</Link>}
      <div className="case-kicker"><span>{project.platform || 'Selected project'}</span>{project.year && <span>{project.year}</span>}</div>
      <h1>{project.title}</h1>
    </header>
    {!project.hideHero && hero && <div className="case-hero case-container"><ContentImage image={{ src: hero, alt: project.heroAlt || project.thumbnailAlt || project.title, caption: project.heroCaption }} preview={preview} eager /></div>}
    <section className={`case-facts case-container${project.hideMetadata ? ' case-facts-no-metadata' : ''}`} aria-label="About the project">
      {!project.hideMetadata && <dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      <div className="case-about-copy">
        <h2>{project.headline || project.sub || 'A closer look at the work.'}</h2>
        {(project.summary || project.description || '').split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {site && <a href={site} target="_blank" rel="noopener noreferrer" className="case-site">Visit live project <ArrowUpRight size={16} /></a>}
      </div>
    </section>
    <div className="case-container"><ProjectContent project={project} preview={preview} editorial /></div>
    {!preview && <footer className="case-bottom case-container">
      {nextProject ? <Link to={`/project/${encodeURIComponent(nextProject.id)}`} className="case-next"><span className="case-label">Next project</span><span className="case-next-title">{nextProject.title}<ArrowRight aria-hidden="true" /></span>{!nextProject.hideCardSubtitle && nextProject.sub && <span className="case-next-sub">{nextProject.sub}</span>}</Link> : <Link to="/projects" className="case-next"><span className="case-label">Keep exploring</span><span className="case-next-title">All projects<ArrowUpRight aria-hidden="true" /></span></Link>}
      <Link to="/projects" className="case-back">Back to all projects <ArrowUpRight size={14} /></Link>
    </footer>}
  </article>;
}
