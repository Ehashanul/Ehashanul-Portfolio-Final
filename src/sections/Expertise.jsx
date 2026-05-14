import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const EXPERTISE_TEXT = [
  "UI Design", "UX Research", "Product Design", "Interaction", "Visual Arts", "Mobile First", "SaaS Design", "Web Design"
];

const TOOLS_DATA = [
  { name: 'Figma', icon: '🎨' },
  { name: 'Photoshop', icon: '📸' },
  { name: 'Illustrator', icon: '🖋️' },
  { name: 'After Effects', icon: '🎬' },
  { name: 'Framer', icon: '⚡' },
  { name: 'Three.js', icon: '🧊' },
  { name: 'React', icon: '⚛️' },
  { name: 'Tailwind', icon: '🌊' },
];

const EXPERTISE_DETAILS = [
  { title: "Strategic UI Design", desc: "Crafting visual languages that communicate brand values through pixel-perfect layouts and cinematic aesthetics.", color: "rgba(124,58,237,0.1)" },
  { title: "User-Centric Research", desc: "Diving deep into user behavior to uncover friction points and design intuitive paths that feel second nature.", color: "rgba(59,130,246,0.1)" },
  { title: "Motion & Interaction", desc: "Bringing static screens to life with purposeful animations that guide, delight, and enhance the overall experience.", color: "rgba(236,72,153,0.1)" },
];

const MarqueeRow = ({ items, direction = 'left', speed = 20, type = 'text' }) => {
  const isLeft = direction === 'left';
  
  return (
    <div className="relative py-6 overflow-hidden bg-black/50 backdrop-blur-sm border-y border-white/[0.03]">
      <motion.div
        animate={{
          x: isLeft ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap items-center gap-12"
      >
        {/* Double the items for perfect loop */}
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex-shrink-0">
            <div className="glass-panel px-10 py-5 rounded-full flex items-center gap-4 border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300">
              {type === 'text' ? (
                <div className="flex items-center gap-4">
                  <span className="text-xl text-p300">✦</span>
                  <span className="font-bebas text-3xl lg:text-4xl tracking-widest text-white/90 uppercase">{item}</span>
                </div>
              ) : (
                <>
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">{item.name}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
    </div>
  );
};

const StackingCard = ({ card, index }) => {
  return (
    <motion.div 
      className="sticky top-40 w-full"
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div 
        className="glass-panel p-8 lg:p-12 rounded-[32px] border border-white/10 relative overflow-hidden h-[300px] flex items-center"
        style={{ backgroundColor: card.color }}
      >
        <div className="absolute top-0 right-0 p-8 text-white/5 font-bebas text-8xl">0{index + 1}</div>
        <div className="relative z-10 max-w-xl">
          <h3 className="font-bebas text-3xl lg:text-5xl tracking-wider mb-4 text-white">{card.title}</h3>
          <p className="text-white/40 text-lg lg:text-xl font-light leading-relaxed">
            {card.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Expertise = () => {
  return (
    <section id="expertise" className="py-20 relative z-10 bg-black">
      {/* Top Marquees */}
      <div className="flex flex-col mb-40">
        <MarqueeRow items={EXPERTISE_TEXT} direction="left" speed={25} type="text" />
        <MarqueeRow items={TOOLS_DATA} direction="right" speed={20} type="pill" />
      </div>

      <div className="max-w-7xl mx-auto px-14">
        <div className="flex items-center gap-4 text-p300 font-mono text-[10.5px] uppercase tracking-widest mb-4">
          <div className="w-7 h-px bg-p300 shadow-[0_0_8px_#a78bfa]" />
          Specializations
        </div>
        
        <h2 className="font-bebas text-6xl lg:text-9xl tracking-wider mb-32">
          EXPERTISE & <span className="bg-grd-accent bg-clip-text text-transparent">CRAFT</span>
        </h2>

        {/* Stacking Cards Section */}
        <div className="relative">
          {EXPERTISE_DETAILS.map((card, index) => (
            <StackingCard key={index} card={card} index={index} />
          ))}
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[10%] left-[-10%] w-[1000px] h-[1000px] bg-p500/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-0 right-[-10%] w-[1000px] h-[1000px] bg-b500/10 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.05),transparent_60%)]" />
      </div>
    </section>
  );
};

export default Expertise;
