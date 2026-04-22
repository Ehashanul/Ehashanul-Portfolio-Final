import { motion } from 'framer-motion';

const About = () => {
  const sentence = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.05,
      },
    },
  };

  const word = {
    hidden: { opacity: 0.1, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      }
    },
  };

  const textLines = [
    "As a designer — I believe",
    "that design is not just",
    "about appearance but",
    "also about creating —",
    "immersive and meaningful",
    "— experiences."
  ];

  return (
    <section id="about" className="py-40 px-14 max-w-7xl mx-auto relative z-10 overflow-hidden bg-black">
      {/* Enhanced Animated Grid Background */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] animate-grid-drift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_50%)] animate-pulse" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-p500/10 rounded-full blur-[120px] animate-orb-drift" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-b500/10 rounded-full blur-[120px] animate-orb-drift [animation-direction:reverse]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Label */}
        <div className="lg:col-span-2">
          <div className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] sticky top-32">
            About Me
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-10">
          <motion.div 
            variants={sentence}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-5xl"
          >
            {textLines.map((line, lineIndex) => (
              <div key={lineIndex} className="overflow-hidden mb-1">
                <motion.h2 
                  className={`text-4xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-[-0.03em] ${
                    lineIndex >= 3 ? 'text-white/30' : 'text-white'
                  }`}
                >
                  {line.split(" ").map((w, i) => (
                    <motion.span 
                      key={i} 
                      variants={word}
                      className="inline-block mr-[0.2em] hover:text-white transition-colors duration-300 cursor-default"
                    >
                      {w === "meaningful" ? (
                        <span className="relative inline-flex items-center">
                          {w}
                          <span className="ml-4 flex -space-x-2">
                            {[1, 2, 3].map((n) => (
                              <div key={n} className="w-8 h-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px]">
                                {n === 1 ? '✦' : n === 2 ? '◈' : '○'}
                              </div>
                            ))}
                          </span>
                        </span>
                      ) : w}
                    </motion.span>
                  ))}
                </motion.h2>
              </div>
            ))}
          </motion.div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-white/50 text-lg leading-relaxed max-w-sm"
            >
              My journey in design is driven by curiosity and problem-solving. I translate complex ideas into simple, user-friendly experiences that not only look good but also make a real impact.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col items-start gap-8"
            >
              <a href="#work" className="group flex items-center gap-4 text-white font-medium tracking-widest uppercase text-xs">
                Learn More
                <span className="w-12 h-px bg-white/20 group-hover:w-20 group-hover:bg-white transition-all duration-500" />
              </a>

              {/* Decorative Boxes from the image style */}
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-24 h-32 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
