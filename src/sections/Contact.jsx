import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle } from 'lucide-react';

const WAVE_PALETTE = [
  { offset: 0,              amplitude: 60,  frequency: 0.0028, color: 'rgba(220,220,230,', opacity: 0.7  },
  { offset: Math.PI / 2,   amplitude: 80,  frequency: 0.0022, color: 'rgba(200,200,215,', opacity: 0.55 },
  { offset: Math.PI,       amplitude: 50,  frequency: 0.0036, color: 'rgba(240,240,250,', opacity: 0.5  },
  { offset: Math.PI * 1.5, amplitude: 70,  frequency: 0.002,  color: 'rgba(180,180,200,', opacity: 0.4  },
  { offset: Math.PI * 2,   amplitude: 40,  frequency: 0.004,  color: 'rgba(255,255,255,', opacity: 0.35 },
];

const WaveCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let time = 0;
    const smoothing = 0.08;
    const mouseInfluence = 60;
    const influenceRadius = 350;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const center = { x: canvas.width / 2, y: canvas.height / 2 };
      mouseRef.current = { ...center };
      targetMouseRef.current = { ...center };
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const drawWave = (wave) => {
      ctx.save();
      ctx.beginPath();

      for (let x = 0; x <= canvas.width; x += 3) {
        const dx = x - mouseRef.current.x;
        const dy = canvas.height / 2 - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / influenceRadius);
        const mouseEffect = influence * mouseInfluence * Math.sin(time * 0.001 + x * 0.01 + wave.offset);

        const y =
          canvas.height / 2 +
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) * (wave.amplitude * 0.4) +
          mouseEffect;

        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = wave.color + wave.opacity + ')';
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 50;
      ctx.shadowColor = wave.color + '1)';
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      time++;
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * smoothing;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * smoothing;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      WAVE_PALETTE.forEach(drawWave);
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
};

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch("https://formspree.io/f/xeenbgwv", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("Oops! There was a problem submitting your form. Please try again.");
      }
    } catch (error) {
      alert("Oops! There was a problem submitting your form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative z-10 overflow-hidden bg-black">

      {/* Wave Canvas Background */}
      <WaveCanvas />

      {/* Subtle dark overlay so content stays readable */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none z-[1]" />

      {/* Grey bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#1a1a1a] via-[#111]/60 to-transparent pointer-events-none z-[2]" />

      {/* Top Banner */}
      <div className="relative py-20 px-14 text-center z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-bebas text-5xl lg:text-7xl tracking-wider text-white mb-8"
        >
          Booking 30 min free call
        </motion.h2>
        <motion.a
          href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2" 
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="inline-block px-10 py-4 rounded-full bg-white text-black font-bold text-sm uppercase tracking-[0.15em] hover:bg-p300 hover:text-white hover:scale-105 transition-all duration-300 backdrop-blur-xl"
        >
          Book Now ↗
        </motion.a>
      </div>

      {/* Bottom Form Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-14 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-bebas text-6xl lg:text-8xl tracking-wider leading-none text-white mb-16">
            LET'S START<br />CREATING<br />TOGETHER
          </h2>

          {/* Social Links */}
          <div className="space-y-2">
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-4">
              Email — ehashanula@gmail.com
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { name: 'LinkedIn', url: '#' },
                { name: 'Facebook', url: '#' },
                { name: 'Twitter', url: '#' },
                { name: 'Instagram', url: '#' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="font-mono text-[11px] uppercase tracking-widest text-white/50 hover:text-white transition-colors group flex items-center gap-1"
                >
                  {social.name}
                  <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
                onSubmit={handleFormSubmit}
              >
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Name"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-p400/60 focus:bg-white/[0.09] transition-all placeholder:text-white/25 font-light backdrop-blur"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-p400/60 focus:bg-white/[0.09] transition-all placeholder:text-white/25 font-light backdrop-blur"
                />

                <textarea
                  name="message"
                  required
                  rows="6"
                  placeholder="Project Details"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-p400/60 focus:bg-white/[0.09] transition-all placeholder:text-white/25 resize-none font-light backdrop-blur"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-2xl bg-white text-black font-bold font-mono text-sm uppercase tracking-[0.15em] hover:bg-p300 hover:text-white transition-all duration-300 backdrop-blur-xl disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Submit Message"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.03] border border-white/10 rounded-[40px] p-12 text-center backdrop-blur-3xl"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8 text-green-500">
                  <CheckCircle size={40} />
                </div>
                <h3 className="font-bebas text-4xl text-white mb-4 tracking-widest">MESSAGE SENT!</h3>
                <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
                  Thank you for reaching out.<br />I will get back to you at ehashanula@gmail.com soon.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-p300 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
