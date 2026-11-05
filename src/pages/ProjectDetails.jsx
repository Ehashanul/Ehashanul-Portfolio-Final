import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useProjectCollection } from '../hooks/useProjects';
import ProjectCaseStudy from '../components/ProjectCaseStudy';

export default function ProjectDetails() {
  const { id } = useParams();
  const { projects, loading } = useProjectCollection();
  const reduced = useReducedMotion();
  const project = projects.find(item => item.id === id);
  const index = projects.findIndex(item => item.id === id);
  const nextProject = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  useEffect(() => {
    const previous = document.title;
    if (project) document.title = `${project.title} | Ehashanul`;
    return () => { document.title = previous; };
  }, [project?.title]);
  if (loading) return <main className="case-status" role="status"><span className="case-label">Opening the project</span><div className="case-loading-bar" /></main>;
  if (!project) return <main className="case-status"><span className="case-label">Project unavailable</span><h1>This project isn't here.</h1><p>It may have been unpublished or moved.</p><Link to="/projects" className="case-back"><ArrowLeft size={14} /> Browse all projects</Link></main>;
  return <motion.main initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}><ProjectCaseStudy key={project.id} project={project} nextProject={nextProject} /></motion.main>;
}
