import { ToolDock, ToolDockTile } from '../components/ui/techstack';
import { mediaUrl } from '../utils/projectMedia';

const tools = [
  ['Claude','claude','https://claude.ai/'],
  ['Codex','codex','https://openai.com/codex/'],
  ['Figma','figma','https://www.figma.com/'],
  ['Photoshop','photoshop','https://www.adobe.com/products/photoshop.html'],
  ['Illustrator','illustrator','https://www.adobe.com/products/illustrator.html'],
  ['After Effects','after-effects','https://www.adobe.com/products/aftereffects.html'],
  ['Framer','framer','https://www.framer.com/'],
  ['VS Code','visual-studio-code','https://code.visualstudio.com/'],
  ['Supabase','supabase','https://supabase.com/'],
  ['GitHub','github','https://github.com/'],
];
const items = tools.map(([label,file,href]) => ({ label, href, icon: <ToolDockTile className="bg-[#15161a]"><img src={mediaUrl(`icons/tools/${file}.svg`)} alt="" draggable={false} className="tool-brand-icon object-contain" style={['photoshop', 'illustrator', 'after-effects'].includes(file) ? { width: '76%', height: '76%' } : undefined} /></ToolDockTile> }));

export default function TechStack() {
  return <section aria-labelledby="tech-stack-title" className="relative z-10 bg-black px-6 pt-4 pb-20 md:pb-28 text-center">
    <h2 id="tech-stack-title" className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">Tools behind the craft</h2>
    <ToolDock items={items} label="Design and development tools" size={64} overlap={0.12} tilt />
  </section>;
}
