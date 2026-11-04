import HoverStack from '../components/ui/hover-stack';

const CARDS = [
  { id:'interface', title:'Interface design', quote:'Clear layouts. Considered typography. A visual language that makes your product feel like itself.', category:'Design', tag:'UI / Visual systems', bg:'linear-gradient(145deg,#e9eaee,#bfc3ce)',ink:'#17191f' },
  { id:'research', title:'User experience', quote:'Finding the friction, asking better questions, and shaping a simpler path for the people using your product.', category:'Understand', tag:'Research / Strategy', bg:'linear-gradient(145deg,#292c35,#15171d)' },
  { id:'interaction', title:'Motion & interaction', quote:'Small moments of movement that make an interface easier to understand and more satisfying to use.', category:'Connect', tag:'Prototyping / Motion', bg:'linear-gradient(145deg,#3a3d46,#202228)' },
  { id:'systems', title:'Design systems', quote:'Reusable components and thoughtful foundations that keep every screen consistent as a product grows.', category:'Build', tag:'Components / Tokens', bg:'linear-gradient(145deg,#c3c7d0,#9298a6)',ink:'#12151c' },
  { id:'product', title:'Product design', quote:'Bringing user needs, business goals, and the smallest details together in one cohesive experience.', category:'Create', tag:'Concept / Delivery', bg:'linear-gradient(145deg,#282b32,#14161c)' },
  { id:'development', title:'Creative development', quote:'Turning the design into a responsive, interactive website with the care it deserves.', category:'Make', tag:'Web / Interactive', bg:'linear-gradient(145deg,#454b59,#272c36)' },
];

export default function Expertise() {
  return <section id="expertise" className="expertise-hover-section relative z-10 bg-black py-24 md:py-32 px-6 md:px-14">
    <div className="max-w-7xl mx-auto">
      <header className="mb-14 md:mb-20"><p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mb-5">The thinking. The making. The details.</p><div className="flex flex-col md:flex-row justify-between md:items-end gap-6"><h2 className="font-bebas text-6xl md:text-8xl lg:text-9xl tracking-wide leading-none">EXPERTISE & <span className="text-white/45">CRAFT</span></h2><p className="text-white/45 text-sm leading-relaxed max-w-xs">A considered blend of strategy, visual design, and interaction. Built around people.</p></div></header>
      <HoverStack cards={CARDS} />
    </div>
  </section>;
}
