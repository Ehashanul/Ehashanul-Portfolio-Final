import { motion } from 'framer-motion';
import Hero from '../sections/Hero';
import Expertise from '../sections/Expertise';
import About from '../sections/About';
import ProjectShowcase from '../sections/ProjectShowcase';
import Contact from '../sections/Contact';

const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <About />
      <Expertise />
      <ProjectShowcase />
      <Contact />
    </motion.main>
  );
};

export default Home;
