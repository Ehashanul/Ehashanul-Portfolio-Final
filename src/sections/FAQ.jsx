import { useId, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
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

const FAQItem = ({ item, index, isOpen, onClick }) => {
  const id = useId();
  return <div className={`portfolio-faq-item ${isOpen ? 'is-open' : ''}`}>
    <h3><button type="button" id={`${id}-question`} aria-expanded={isOpen} aria-controls={`${id}-answer`} onClick={onClick} className="portfolio-faq-question"><span className="portfolio-faq-number">{String(index + 1).padStart(2, '0')}</span><span>{item.q}</span><span className="portfolio-faq-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span></button></h3>
    <div id={`${id}-answer`} role="region" aria-labelledby={`${id}-question`} hidden={!isOpen}><AnimatePresence initial={false}>{isOpen && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}><p className="portfolio-faq-answer">{item.a}</p></motion.div>}</AnimatePresence></div>
  </div>;
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  return <section id="faq" className="relative z-10 bg-black py-24 md:py-32 px-6 md:px-14"><div className="max-w-7xl mx-auto">
    <SectionHeading number="03" label="A few answers" title="Asked" accent="questions" description="A little clarity on the process, the practical details, and working together." />
    <div className="portfolio-faq-list">{FAQS.map((item, index) => <FAQItem key={item.q} item={item} index={index} isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)} />)}</div>
  </div></section>;
}