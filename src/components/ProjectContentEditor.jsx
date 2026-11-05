import { caseStudySections } from '../utils/projectContent';

const PROMPTS = {
  overview: 'Introduce the product, its audience, and why the project mattered.',
  contributions: 'What did you personally own, and who did you work with?',
  challenge: 'What user problem, business need, or constraint shaped this work?',
  goals: 'Explain your approach and what needed to improve.',
  research: 'What did research or feedback reveal, and how did it shape the design?',
  process: 'Show how your direction developed, rather than listing activities.',
  decisions: 'Explain the choices that made the biggest difference.',
  validation: 'Describe real testing or feedback. Leave empty if it did not happen.',
  outcomes: 'Share actual results. Add metrics only when you can support them.',
  lessons: 'What did you learn, and what would you explore next?',
};
const newSection = type => ({ id: crypto.randomUUID(), type, heading: type === 'metrics' ? 'Results' : '', ...(type === 'gallery' ? { images: [], columns: 'two' } : type === 'metrics' ? { items: [{ value: '', label: '' }] } : {}) });

export default function ProjectContentEditor({ content, change, ImageField, onBusy, onError }) {
  const sections = Array.isArray(content.sections) ? content.sections : caseStudySections(content);
  const update = (id, patch) => change('sections', sections.map(section => section.id === id ? { ...section, ...patch } : section));
  const move = (index, direction) => {
    const next = [...sections];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    change('sections', next);
  };
  const imageProps = { onBusy, onError };
  return <section className="space-y-6 border-t border-white/10 pt-8">
    <div><h3 className="text-xl font-semibold">Project details page</h3><p className="text-sm text-white/50 mt-2">Every card opens its own case study. All fields below are optional. Empty sections are omitted, and existing project content is preserved.</p></div>
    <label className="block">Case study headline<input maxLength={300} placeholder="A short statement about what you designed" value={content.headline || ''} onChange={event => change('headline', event.target.value)} /><span className="block text-xs text-white/40 mt-2">Uses the card subtext when empty.</span></label>
    <label className="block">Introduction<textarea rows={4} placeholder="Give visitors the context for this project." value={content.summary || ''} onChange={event => change('summary', event.target.value)} /><span className="block text-xs text-white/40 mt-2">Uses the short description when empty.</span></label>
    <ImageField {...imageProps} label="Case study hero image (optional; uses card image when empty)" value={content.heroImage} onChange={value => change('heroImage', value)} />
    <div className="grid sm:grid-cols-2 gap-4"><label>Hero image description<input value={content.heroAlt || ''} onChange={event => change('heroAlt', event.target.value)} /></label><label>Hero caption<input value={content.heroCaption || ''} onChange={event => change('heroCaption', event.target.value)} /></label></div>
    <div className="grid sm:grid-cols-2 gap-4">{[['role', 'Your role'], ['studio', 'Studio'], ['team', 'Project team (optional)'], ['duration', 'Timeline'], ['year', 'Project year'], ['date', 'Display date (optional)']].map(([field, label]) => <label key={field}>{label}<input maxLength={150} value={content[field] || ''} onChange={event => change(field, event.target.value)} /></label>)}</div>
    <div className="grid sm:grid-cols-2 gap-4"><label>Services / deliverables (one per line)<textarea rows={4} value={(content.deliverables || []).join('\n')} onChange={event => change('deliverables', event.target.value.split('\n'))} /></label><label>Tools (one per line)<textarea rows={4} value={(content.tools || []).join('\n')} onChange={event => change('tools', event.target.value.split('\n'))} /></label></div>
    <div className="grid sm:grid-cols-2 gap-4">{[['hideHero', 'Hide the hero image'], ['hideMetadata', 'Hide project facts']].map(([field, label]) => <label key={field} className="flex gap-3 items-center"><input type="checkbox" checked={Boolean(content[field])} onChange={event => change(field, event.target.checked)} />{label}</label>)}</div>
    <div className="border-t border-white/10 pt-6"><h3 className="text-lg">Case study sections</h3><p className="text-sm text-white/50 mt-2">Reorder, hide, remove, or add sections to tell your story. Hidden sections stay in your private draft. Use Preview draft to review the complete page.</p></div>
    {sections.map((section, index) => <section key={section.id} className="admin-panel space-y-4">
      <div className="flex flex-wrap gap-2 items-center"><strong className="mr-auto capitalize">{index + 1}. {section.type === 'metrics' ? 'Results' : section.type}</strong><button type="button" className="admin-button" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move section up">↑</button><button type="button" className="admin-button" disabled={index === sections.length - 1} onClick={() => move(index, 1)} aria-label="Move section down">↓</button><button type="button" className="admin-button" onClick={() => { if (window.confirm('Remove this section from the draft?')) change('sections', sections.filter(item => item.id !== section.id)); }}>Remove</button></div>
      <label className="flex gap-3 items-center"><input type="checkbox" checked={Boolean(section.hidden)} onChange={event => update(section.id, { hidden: event.target.checked })} />Hide this section</label>
      <label className="block">Heading (optional)<input value={section.heading || ''} onChange={event => update(section.id, { heading: event.target.value })} /></label>
      {section.type === 'text' && <><label className="block">Layout<select value={section.layout || 'split'} onChange={event => update(section.id, { layout: event.target.value })}><option value="split">Editorial — heading beside text</option><option value="wide">Wide — heading above text</option></select></label><label className="block">Text{PROMPTS[section.id] && <span className="block text-xs text-white/40 my-2">{PROMPTS[section.id]}</span>}<textarea rows={6} value={section.body || ''} onChange={event => update(section.id, { body: event.target.value })} /></label></>}
      {section.type === 'image' && <><ImageField {...imageProps} label="Full-width section image" value={section.src} onChange={src => update(section.id, { src })} /><label className="block">Image description<input value={section.alt || ''} onChange={event => update(section.id, { alt: event.target.value })} /></label><label className="block">Caption<input value={section.caption || ''} onChange={event => update(section.id, { caption: event.target.value })} /></label></>}
      {section.type === 'gallery' && <><label className="block">Gallery layout<select value={section.columns || 'two'} onChange={event => update(section.id, { columns: event.target.value })}><option value="two">Two columns</option><option value="one">One column / full-width images</option></select></label><div className="grid sm:grid-cols-2 gap-4">{(section.images || []).map((image, i) => {
        const updateImage = patch => update(section.id, { images: section.images.map((item, j) => j === i ? { ...item, ...patch } : item) });
        return <div className="space-y-3" key={i}><ImageField {...imageProps} label={`Image ${i + 1}`} value={image.src} onChange={src => updateImage({ src })} /><label className="block">Image description<input value={image.alt || ''} onChange={event => updateImage({ alt: event.target.value })} /></label><label className="block">Caption<input value={image.caption || ''} onChange={event => updateImage({ caption: event.target.value })} /></label><div className="flex flex-wrap gap-2"><button type="button" className="admin-button" disabled={i === 0} onClick={() => { const images = [...section.images]; [images[i], images[i - 1]] = [images[i - 1], images[i]]; update(section.id, { images }); }}>Move earlier</button><button type="button" className="admin-button" onClick={() => update(section.id, { images: section.images.filter((_item, j) => j !== i) })}>Remove image</button></div></div>;
      })}</div><button type="button" className="admin-button" onClick={() => update(section.id, { images: [...(section.images || []), { src: '', alt: '' }] })}>Add image</button></>}
      {section.type === 'metrics' && <><p className="text-xs text-white/50">Large values with staggered rows. Use verified numbers or short outcome words; no percentage is required.</p>{(section.items || []).map((item, i) => <div className="grid grid-cols-2 gap-3" key={i}>{['value', 'label'].map(field => <label key={field} className="capitalize">{field}<input value={item[field] || ''} onChange={event => update(section.id, { items: section.items.map((metric, j) => j === i ? { ...metric, [field]: event.target.value } : metric) })} /></label>)}<button type="button" className="admin-button" onClick={() => update(section.id, { items: section.items.filter((_item, j) => j !== i) })}>Remove result</button></div>)}<button type="button" className="admin-button" onClick={() => update(section.id, { items: [...(section.items || []), { value: '', label: '' }] })}>Add result</button></>}
      {section.type === 'link' && <><label className="block">Button label<input value={section.label || ''} onChange={event => update(section.id, { label: event.target.value })} /></label><label className="block">URL<input type="url" value={section.url || ''} onChange={event => update(section.id, { url: event.target.value })} /></label></>}
    </section>)}
    <div className="flex flex-wrap gap-2">{['text', 'image', 'gallery', 'metrics', 'link'].map(type => <button type="button" key={type} className="admin-button capitalize" onClick={() => change('sections', [...sections, newSection(type)])}>+ {type === 'metrics' ? 'Results' : type}</button>)}</div>
  </section>;
}
