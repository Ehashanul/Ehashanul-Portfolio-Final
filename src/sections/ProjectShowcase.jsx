import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { mediaUrl } from '../utils/projectMedia';
import ZoomSlider from '../components/ui/zoom-slider';

export default function ProjectShowcase() {
  const projects = useProjects();
  const items = useMemo(() => projects.filter(project => project.featured !== false).map((project,index) => ({
    id: project.id,
    title: project.hideCardTitle ? `Project ${String(index + 1).padStart(2,'0')}` : project.title,
    image: project.hideCardImage ? '' : mediaUrl(project.thumbnail || project.img || project.heroImage),
    href: `/project/${project.id}`,
  })), [projects]);
  return <section id="work" className="work-showcase relative z-10 bg-black py-24 md:py-32">
    <header className="max-w-7xl mx-auto px-6 md:px-14 flex flex-wrap justify-between items-end gap-6 mb-8">
      <div><p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] mb-5">Selected work · Thoughtfully made</p><h2 className="font-bebas text-6xl md:text-8xl lg:text-9xl tracking-wide leading-none">BEST <span className="text-white/45">PROJECTS</span></h2></div>
      <Link to="/projects" className="inline-flex items-center gap-3 text-white/55 hover:text-white text-[10px] font-mono uppercase tracking-[0.2em] py-3">All projects <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </header>
    {items.length ? <ZoomSlider key={items.map(item=>item.id).join('|')} items={items} /> : <p className="max-w-7xl mx-auto px-6 md:px-14 py-20 text-white/40">Featured projects will appear here when published.</p>}
  </section>;
}
