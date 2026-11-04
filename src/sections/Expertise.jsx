import HoverStack from '../components/ui/hover-stack';
import SectionHeading from '../components/SectionHeading';

const CARDS = [
  { id:'interface', title:'Interface design', quote:'Clear layouts. Considered typography. A visual language that makes your product feel like itself.', category:'Design', tag:'UI / Visual systems', bg:'linear-gradient(145deg,#F4A9A4,#F6C29A)',ink:'#241c20' },
  { id:'research', title:'User experience', quote:'Finding the friction, asking better questions, and shaping a simpler path for the people using your product.', category:'Understand', tag:'Research / Strategy', bg:'linear-gradient(145deg,#F1DE95,#D5E69D)',ink:'#241c20' },
  { id:'interaction', title:'Motion & interaction', quote:'Small moments of movement that make an interface easier to understand and more satisfying to use.', category:'Connect', tag:'Prototyping / Motion', bg:'linear-gradient(145deg,#A9DCB6,#9EDDDD)',ink:'#241c20' },
  { id:'systems', title:'Design systems', quote:'Reusable components and thoughtful foundations that keep every screen consistent as a product grows.', category:'Build', tag:'Components / Tokens', bg:'linear-gradient(145deg,#A7CFF0,#B7C0F2)',ink:'#241c20' },
  { id:'product', title:'Product design', quote:'Bringing user needs, business goals, and the smallest details together in one cohesive experience.', category:'Create', tag:'Concept / Delivery', bg:'linear-gradient(145deg,#C9B4EC,#D4B6E8)',ink:'#241c20' },
  { id:'development', title:'Creative development', quote:'Turning the design into a responsive, interactive website with the care it deserves.', category:'Make', tag:'Web / Interactive', bg:'linear-gradient(145deg,#ECAED4,#EDBAC4)',ink:'#241c20' },
];

export default function Expertise() {
  return <section id="expertise" className="expertise-hover-section relative z-10 bg-black pt-14 pb-6 md:pt-20 md:pb-8 px-6 md:px-14">
    <div className="max-w-7xl mx-auto">
      <SectionHeading title="Expertise &" accent="craft" description="Thoughtful design, from the first question to the final interaction." />
      <HoverStack cards={CARDS} />
    </div>
  </section>;
}
