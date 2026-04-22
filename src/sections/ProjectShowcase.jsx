import { motion } from 'framer-motion';

const BEST_PROJECTS = [
  { id: 1, title: 'Tom Ford', sub: 'Ombre Leather', img: '/project-1.png', size: 'large' },
  { id: 2, title: 'Lampre', sub: 'Editorial', img: '/project-2.png', size: 'small' },
  { id: 3, title: 'Lexus', sub: 'Automotive', img: '/project-3.png', size: 'small' },
];

const ProjectCard = ({ project }) => {
  const isLarge = project.size === 'large';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative group overflow-hidden rounded-[32px] ${isLarge ? 'col-span-2 aspect-[16/9]' : 'col-span-1 aspect-square'}`}
    >
      <img 
        src={project.img} 
        alt={project.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
      
      <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start">
        <h3 className="font-bebas text-3xl lg:text-5xl tracking-widest text-white mb-2">{project.title}</h3>
        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">{project.sub}</p>
      </div>

      {/* Hover Overlay Icon */}
      <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover:translate-y-0">
        <span className="text-white text-xl">↗</span>
      </div>
    </motion.div>
  );
};

const ProjectShowcase = () => {
  return (
    <section id="work" className="py-40 px-14 max-w-7xl mx-auto relative z-10">
      <div className="flex justify-between items-end mb-20">
        <div>
          <div className="flex items-center gap-4 text-p300 font-mono text-[10.5px] uppercase tracking-widest mb-4">
            <div className="w-7 h-px bg-p300 shadow-[0_0_8px_#a78bfa]" />
            Portfolio
          </div>
          <h2 className="font-bebas text-6xl lg:text-9xl tracking-wider">
            BEST <span className="bg-grd-accent bg-clip-text text-transparent">PROJECTS</span>
          </h2>
        </div>
        
        <a href="#" className="flex items-center gap-2 text-white/40 font-mono text-[11px] uppercase tracking-[0.3em] hover:text-p300 transition-colors mb-4 group">
          See More <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        {BEST_PROJECTS.map((proj) => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>
    </section>
  );
};

export default ProjectShowcase;
