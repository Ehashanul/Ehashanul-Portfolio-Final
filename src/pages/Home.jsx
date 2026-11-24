import Hero from '../sections/Hero';
import Expertise from '../sections/Expertise';
import About from '../sections/About';
import TechStack from '../sections/TechStack';
import ProjectShowcase from '../sections/ProjectShowcase';
import Contact from '../sections/Contact';
import FAQ from '../sections/FAQ';

const Home = () => {
  return (
    <main>
      <Hero />
      <About />
      <TechStack />
      <Expertise />
      <ProjectShowcase />
      <FAQ />
      <Contact />
    </main>
  );
};

export default Home;
