import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { mediaUrl } from '../utils/projectMedia';
import ZoomSlider from '../components/ui/zoom-slider';
import SectionHeading from '../components/SectionHeading';

export default function ProjectShowcase() {
  const projects = useProjects();
  const items = useMemo(() => projects.filter(project => project.featured === true).map((project,index) => ({
    id: project.id,
    title: project.hideCardTitle ? `Project ${String(index + 1).padStart(2,'0')}` : project.title,
    image: project.hideCardImage ? '' : mediaUrl(project.thumbnail || project.img || project.heroImage),
    href: `/projects#project-${project.id}`,
  })), [projects]);
  return <section id="work" className="work-showcase relative z-10 bg-black pt-8 pb-6 md:pt-10 md:pb-8">
    <div className="max-w-7xl mx-auto px-6 md:px-14"><SectionHeading title="Selected" accent="projects" action={<Link to="/projects" className="section-heading-link">Show all projects <ArrowUpRight size={16} aria-hidden="true" /></Link>} /></div>
    {items.length ? <ZoomSlider key={items.map(item=>item.id).join('|')} items={items} /> : <p className="max-w-7xl mx-auto px-6 md:px-14 py-20 text-white/40">Featured projects will appear here when published.</p>}
  </section>;
}
