import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { ArrowLeft } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group overflow-hidden rounded-[32px] aspect-square"
    >
      <Link to={`/project/${project.id}`}>
        <img 
          src={`${import.meta.env.BASE_URL}${(project.thumbnail || project.img || '').replace(/^\//, '')}`} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        
        <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start">
          <h3 className="font-bebas text-3xl lg:text-4xl tracking-widest text-white mb-2">{project.title}</h3>
          <p className="text-white/40 font-mono text-[9px] uppercase tracking-[0.2em]">{project.sub}</p>
        </div>

        <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover:translate-y-0">
          <span className="text-white text-lg">↗</span>
        </div>
      </Link>
    </motion.div>
  );
};

const AllProjects = () => {
  const projects = useProjects();
  
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-24 px-14 max-w-7xl mx-auto relative z-10"
    >
      <Link 
        to="/"
        className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-16 font-mono text-[11px] uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </Link>

      <div className="mb-20">
        <div className="flex items-center gap-4 text-p300 font-mono text-[10.5px] uppercase tracking-widest mb-4">
          <div className="w-7 h-px bg-p300 shadow-[0_0_8px_#a78bfa]" />
          Full Archive
        </div>
        <h1 className="font-bebas text-7xl lg:text-9xl tracking-wider">
          ALL <span className="bg-grd-accent bg-clip-text text-transparent">WORKS</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>
    </motion.main>
  );
};

export default AllProjects;
