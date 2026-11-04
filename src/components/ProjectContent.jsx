import { useEffect, useState } from 'react';
import { mediaUrl } from '../utils/projectMedia';
import { externalUrl, sectionAnchor, visibleProjectSections } from '../utils/projectContent';
import { previewImage } from '../lib/projects';

function ContentImage({ image, preview }) {
  const [signed, setSigned] = useState('');
  useEffect(() => {
    if (!preview || !image.src?.startsWith('private:')) return;
    let active = true;
    previewImage(image.src).then(url => { if (active) setSigned(url); }).catch(() => {});
    return () => { active = false; };
  }, [image.src, preview]);
  const src = image.src?.startsWith('private:') ? signed : mediaUrl(image.src);
  if (!src) return null;
  return <figure><img src={src} alt={image.alt || ''} loading="lazy" className="w-full rounded-3xl border border-white/10 object-contain" />{image.caption && <figcaption className="mt-3 text-sm text-white/50">{image.caption}</figcaption>}</figure>;
}

export default function ProjectContent({ project, preview = false, editorial = false }) {
  const sections = visibleProjectSections(project);
  return <div className={editorial ? 'project-story-content' : 'space-y-16'}>{sections.map((section, index) => <section key={section.id} id={sectionAnchor(section.id)} className={editorial ? `project-story-block project-story-block--${section.type} scroll-mt-32` : 'space-y-6 scroll-mt-32 border-t border-white/10 pt-8'}>
    {section.heading && <h2 className="text-2xl md:text-3xl font-semibold tracking-tight"><span className={editorial ? 'dixor-section-number' : 'block font-mono text-[10px] tracking-[0.2em] text-white/35 mb-4'}>{String(sections.slice(0, index + 1).filter(item => item.heading).length).padStart(2, '0')}</span>{section.heading}</h2>}
    <div className="project-section-body">
    {section.type === 'text' && section.body && <p className="text-white/60 text-lg leading-relaxed whitespace-pre-wrap break-words">{section.body}</p>}
    {section.type === 'image' && <ContentImage image={section} preview={preview} />}
    {section.type === 'gallery' && <div className="grid md:grid-cols-2 gap-6">{(section.images || []).filter(image => image.src).map((image,index) => <ContentImage key={`${index}-${image.src}`} image={image} preview={preview} />)}</div>}
    {section.type === 'metrics' && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{(section.items || []).map((item,index) => <div key={index} className="p-6 rounded-3xl border border-white/10 bg-white/[0.03]"><p className="text-3xl font-semibold">{item.value}</p><p className="text-sm text-white/50 mt-3">{item.label}</p></div>)}</div>}
    {section.type === 'link' && externalUrl(section.url) && <a href={externalUrl(section.url)} target="_blank" rel="noopener noreferrer" className="btn-secondary">{section.label || 'View project'} ↗</a>}
    </div>
  </section>)}</div>;
}
