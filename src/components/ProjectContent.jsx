import { useEffect, useState } from 'react';
import { mediaUrl } from '../utils/projectMedia';
import { externalUrl, projectSections } from '../utils/projectContent';
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

export default function ProjectContent({ project, preview = false }) {
  return <div className="space-y-16">{projectSections(project).filter(section => !section.hidden).map(section => <section key={section.id} className="space-y-6">
    {section.heading && <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{section.heading}</h2>}
    {section.type === 'text' && section.body && <p className="text-white/60 text-lg leading-relaxed whitespace-pre-wrap break-words">{section.body}</p>}
    {section.type === 'image' && <ContentImage image={section} preview={preview} />}
    {section.type === 'gallery' && <div className="grid md:grid-cols-2 gap-6">{(section.images || []).filter(image => image.src).map((image,index) => <ContentImage key={`${index}-${image.src}`} image={image} preview={preview} />)}</div>}
    {section.type === 'metrics' && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{(section.items || []).map((item,index) => <div key={index} className="p-6 rounded-3xl border border-white/10 bg-white/[0.03]"><p className="text-3xl font-semibold">{item.value}</p><p className="text-sm text-white/50 mt-3">{item.label}</p></div>)}</div>}
    {section.type === 'link' && externalUrl(section.url) && <a href={externalUrl(section.url)} target="_blank" rel="noopener noreferrer" className="btn-secondary">{section.label || 'View project'} ↗</a>}
  </section>)}</div>;
}
