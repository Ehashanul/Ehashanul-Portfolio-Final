import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { mediaUrl } from '../utils/projectMedia';
import SectionHeading from '../components/SectionHeading';
import './ProjectShowcase.css';

export default function ProjectShowcase() {
  const projects = useProjects();
  const reduced = useReducedMotion();
  const selected = projects.filter(project => project.featured === true).slice(0, 5);
  return <section id="work" className="work-showcase relative z-10 bg-black pt-8 pb-6 md:pt-10 md:pb-8">
    <div className="max-w-7xl mx-auto px-6 md:px-14">
      <SectionHeading title="Selected" accent="projects" action={<Link to="/projects" className="section-heading-link">Show all projects <ArrowUpRight size={16} aria-hidden="true" /></Link>} />
      {selected.length ? <div className={`selected-bento selected-bento-count-${selected.length}`}>
        {selected.map((project, index) => {
          const image = !project.hideCardImage && mediaUrl(project.thumbnail || project.img || project.heroImage);
          return <motion.article key={project.id} className="selected-bento-tile" initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65, delay: reduced ? 0 : index * .06 }}>
            <Link to={`/project/${encodeURIComponent(project.id)}`} className="selected-bento-link" aria-label={`View ${project.hideCardTitle ? 'project details' : project.title}`}>
              {image ? <img src={image} alt={project.thumbnailAlt || (project.hideCardTitle ? '' : project.title)} loading="lazy" decoding="async" /> : <div className="selected-bento-placeholder" aria-hidden="true" />}
              <div className="selected-bento-shade" />
              <span className="selected-bento-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {project.platform && <span className="selected-bento-category">{project.platform}</span>}
              <div className="selected-bento-caption"><div>{!project.hideCardTitle && <h3>{project.title}</h3>}{!project.hideCardSubtitle && project.sub && <p>{project.sub}</p>}</div><span className="selected-bento-arrow"><ArrowUpRight size={21} strokeWidth={1.5} aria-hidden="true" /></span></div>
            </Link>
          </motion.article>;
        })}
      </div> : <p className="py-20 text-white/40">Selected projects will appear here when published.</p>}
    </div>
  </section>;
}
