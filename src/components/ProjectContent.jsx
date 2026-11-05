import { useEffect, useState } from 'react';
import { mediaUrl } from '../utils/projectMedia';
import { externalUrl, sectionAnchor, visibleProjectSections } from '../utils/projectContent';
import { previewImage } from '../lib/projects';
import ParticleImage from './ParticleImage';

export function ContentImage({ image, preview = false, eager = false }) {
  const [signed, setSigned] = useState('');
  useEffect(() => {
    setSigned('');
    if (!preview || !image.src?.startsWith('private:')) return;
    let active = true;
    previewImage(image.src).then(url => { if (active) setSigned(url); }).catch(() => {});
    return () => { active = false; };
  }, [image.src, preview]);
  const src = image.src?.startsWith('private:') ? signed : mediaUrl(image.src);
  if (!src) return null;
  return <figure><ParticleImage src={src} alt={image.alt || ''} eager={eager} />{image.caption && <figcaption className="mt-3 text-sm text-white/50">{image.caption}</figcaption>}</figure>;
}

export default function ProjectContent({ project, preview = false, editorial = false }) {
  const sections = visibleProjectSections(project);
  return <div className={editorial ? 'project-story-content' : 'space-y-16'}>{sections.map((section, index) => <section key={section.id} id={preview ? undefined : sectionAnchor(section.id)} className={editorial ? `project-story-block project-story-block--${section.type} ${section.layout === 'wide' ? 'project-story-wide' : ''} scroll-mt-32` : 'space-y-6 scroll-mt-32 border-t border-white/10 pt-8'}>
    {section.heading && <h2 className="text-2xl md:text-3xl font-semibold tracking-tight"><span className={editorial ? 'project-story-number' : 'block font-mono text-[10px] tracking-[0.2em] text-white/35 mb-4'}>{String(sections.slice(0, index + 1).filter(item => item.heading).length).padStart(2, '0')}</span>{section.heading}</h2>}
    <div className="project-section-body">
    {section.type === 'text' && section.body && <p className="text-white/60 text-lg leading-relaxed whitespace-pre-wrap break-words">{section.body}</p>}
    {section.type === 'image' && <ContentImage image={section} preview={preview} />}
    {section.type === 'gallery' && <div className={`project-story-gallery grid ${section.columns === 'one' ? '' : 'md:grid-cols-2'} gap-6`}>{(section.images || []).filter(image => image.src).map((image,index) => <ContentImage key={`${index}-${image.src}`} image={image} preview={preview} />)}</div>}
    {section.type === 'metrics' && <dl className="case-result-list">{(section.items || []).filter(item => item.value || item.label).map((item,index) => <div key={index} className="case-result-row"><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}
    {section.type === 'link' && externalUrl(section.url) && <a href={externalUrl(section.url)} target="_blank" rel="noopener noreferrer" className="btn-secondary">{section.label || 'View project'} ↗</a>}
    </div>
  </section>)}</div>;
}
