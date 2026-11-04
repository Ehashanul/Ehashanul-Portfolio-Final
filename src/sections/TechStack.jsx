import { ToolDock, ToolDockTile } from '../components/ui/techstack';
import { mediaUrl } from '../utils/projectMedia';

const tools = [
  ['Figma','figma','bg-white','https://www.figma.com/','46%'],
  ['Photoshop','photoshop','bg-[#18191d]','https://www.adobe.com/products/photoshop.html','70%'],
  ['Illustrator','illustrator','bg-[#efefed]','https://www.adobe.com/products/illustrator.html','70%'],
  ['After Effects','after-effects','bg-[#191821]','https://www.adobe.com/products/aftereffects.html','68%'],
  ['Framer','framer','bg-[#222327]','https://www.framer.com/','50%'],
  ['VS Code','visual-studio-code','bg-white','https://code.visualstudio.com/','56%'],
  ['React','react','bg-[#17191f]','https://react.dev/','58%'],
  ['Tailwind CSS','tailwind-css','bg-white','https://tailwindcss.com/','60%'],
  ['GitHub','github','bg-[#0d1117]','https://github.com/','57%'],
  ['Supabase','supabase','bg-[#171717]','https://supabase.com/','54%'],
];
const items = tools.map(([label,file,tile,href,fit]) => ({ label, href, icon: <ToolDockTile className={tile}><img src={mediaUrl(`icons/tools/${file}.svg`)} alt="" draggable={false} style={{ width: fit, height: fit }} className="object-contain" /></ToolDockTile> }));

export default function TechStack() {
  return <section aria-labelledby="tech-stack-title" className="relative z-10 bg-black px-6 pt-4 pb-20 md:pb-28 text-center">
    <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/35 mb-4">From idea to interaction</p>
    <h2 id="tech-stack-title" className="text-base md:text-lg font-medium text-white/80">Tools behind the craft</h2>
    <ToolDock items={items} label="Design and development tools" />
  </section>;
}
