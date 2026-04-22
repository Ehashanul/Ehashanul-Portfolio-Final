import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

const Contact = () => {
  return (
    <section id="contact" className="py-32 px-14 max-w-7xl mx-auto relative z-10">
      <div className="flex items-center gap-4 text-p300 font-mono text-[10.5px] uppercase tracking-widest mb-4">
        <div className="w-7 h-px bg-p300 shadow-[0_0_8px_#a78bfa]" />
        Get in Touch
      </div>
      
      <h2 className="font-bebas text-6xl lg:text-8xl tracking-wider mb-16">
        LET'S BUILD <span className="bg-grd-accent bg-clip-text text-transparent">SOMETHING.</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-20">
        <div>
          <h3 className="font-bebas text-4xl tracking-widest mb-6">Always open to<br/>collaborations.</h3>
          <p className="text-white/40 font-light leading-relaxed mb-10">
            Whether it's a full-time role, a project collaboration, or just a design chat, my inbox is always open.
          </p>

          <div className="space-y-3">
            {['Email', 'LinkedIn', 'Dribbble', 'Twitter'].map((link) => (
              <a 
                key={link} 
                href="#" 
                className="flex items-center gap-4 p-4 glass-panel rounded-2xl text-sm text-white/60 hover:text-white hover:border-p400/40 hover:bg-p400/10 hover:translate-x-2 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-p400/15 border border-p400/20 flex items-center justify-center text-p300 group-hover:shadow-[0_0_12px_rgba(124,58,237,0.3)] transition-all">
                  {link === 'Email' ? '📧' : link === 'LinkedIn' ? '💼' : '🏀'}
                </div>
                {link}
              </a>
            ))}
          </div>
        </div>

        <GlassCard className="p-10 relative overflow-hidden">
          {/* Inner Glow */}
          <div className="absolute -top-[40%] -right-[30%] w-[440px] h-[440px] bg-[radial-gradient(circle,rgba(124,58,237,0.08),transparent_70%)] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl bg-p400/10 border border-p400/20 mb-10">
            <div className="text-white/60 text-sm mb-4 md:mb-0">📅 Book a free 30-min design strategy chat.</div>
            <button className="px-5 py-2.5 rounded-full glass-panel text-[10px] font-mono uppercase tracking-widest text-p300 hover:bg-p400/30 hover:text-white hover:shadow-[0_0_16px_rgba(124,58,237,0.3)] transition-all">
              Book Meeting →
            </button>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-[9px] text-white/20 uppercase tracking-[0.2em] mb-3">// NAME</label>
                <input 
                  type="text" 
                  placeholder="Your name"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-p400/50 focus:bg-p400/5 transition-all placeholder:text-white/10"
                />
              </div>
              <div>
                <label className="block font-mono text-[9px] text-white/20 uppercase tracking-[0.2em] mb-3">// EMAIL</label>
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-p400/50 focus:bg-p400/5 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[9px] text-white/20 uppercase tracking-[0.2em] mb-3">// MESSAGE</label>
              <textarea 
                rows="4"
                placeholder="Tell me about your project..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-p400/50 focus:bg-p400/5 transition-all placeholder:text-white/10 resize-none"
              ></textarea>
            </div>

            <button type="submit" className="w-full btn-primary justify-center py-4 text-base">
              Send Message ✦
            </button>
          </form>
        </GlassCard>
      </div>
    </section>
  );
};

export default Contact;
