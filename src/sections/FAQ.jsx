import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'What design services do you offer?',
    a: 'I offer end-to-end UI/UX design including user research, wireframing, prototyping, visual design, and design systems. I work across web, mobile, and SaaS products.',
  },
  {
    q: 'How does your design process work with clients?',
    a: 'I start with a discovery call to understand your goals, then move into research, ideation, and iterative design phases. You are involved at every stage with regular check-ins and feedback loops.',
  },
  {
    q: 'How long does it take to complete a design project?',
    a: 'Timelines vary by scope. A landing page typically takes 1–2 weeks, while a full product design can take 4–8 weeks. I will give you a clear timeline after our initial consultation.',
  },
  {
    q: 'Do you take on mobile app design projects?',
    a: 'Absolutely. I have experience designing for both iOS and Android platforms, following platform-specific guidelines while maintaining a cohesive and premium visual identity.',
  },
  {
    q: 'How do I get started with a project?',
    a: 'Simply reach out via the contact form below or book a free 30-minute discovery call. We will discuss your project, goals, and how I can help bring your vision to life.',
  },
  {
    q: 'What does it cost to work with you?',
    a: 'Pricing depends on the project scope and complexity. I offer flexible engagements — from fixed-price project packages to ongoing monthly retainers. Let\'s talk and find the right fit.',
  },
];

const FAQItem = ({ item, isOpen, onClick }) => (
  <div
    className="border-b border-white/[0.07] cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-center justify-between py-6 gap-6">
      <span className="text-white/80 text-base lg:text-lg font-light group-hover:text-white transition-colors duration-300">
        {item.q}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-shrink-0 w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:border-white/40 group-hover:text-white transition-all duration-300"
      >
        <span className="text-lg leading-none">+</span>
      </motion.div>
    </div>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="answer"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className="pb-6 text-white/40 text-sm lg:text-base font-light leading-relaxed max-w-2xl">
            {item.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="relative z-10 bg-black py-32 px-14 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-p500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 pb-16 border-b border-white/[0.07]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 text-white/30 font-mono text-[10.5px] uppercase tracking-widest mb-4">
              <div className="w-7 h-px bg-white/20" />
              FAQ
            </div>
            <h2 className="font-bebas text-6xl lg:text-8xl tracking-wider leading-none whitespace-nowrap">
              ASKED <span className="bg-grd-accent bg-clip-text text-transparent">QUESTIONS</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex items-end lg:justify-end"
          >
            <p className="text-white/30 text-sm font-light leading-relaxed max-w-xs">
              You can find explanations about my design process, services, policies and anything else you may need to know.
            </p>
          </motion.div>
        </div>

        {/* FAQ List — right-aligned like the screenshot */}
        <div className="lg:ml-auto lg:max-w-3xl">
          {FAQS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <FAQItem
                item={item}
                isOpen={openIndex === i}
                onClick={() => toggle(i)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
