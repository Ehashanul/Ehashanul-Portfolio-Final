import { caseStudySections, legacySections } from '../utils/projectContent';

const caseStudyPrompts = {
  overview: 'What is the product, who is it for, and why did this project matter? Give the reader context in 2–3 sentences.',
  contributions: 'Explain what you personally owned, who you worked with, and what you delivered.',
  challenge: 'Describe the user problem, business need, and constraints. What was difficult before this work?',
  goals: 'What needed to improve? Explain how you would judge success.',
  research: 'What did you actually learn from research, feedback, or reviewing the existing experience? Connect each insight to a design choice.',
  process: 'Describe the steps you took and how the direction changed. Focus on the decisions rather than just listing activities.',
  decisions: 'Explain 2–3 important design choices: the problem, alternatives considered, your choice, and why it helped.',
  validation: 'What did you test or review? What feedback changed the final design? If no testing happened, leave this section empty.',
  outcomes: 'Describe the actual result. Include metrics only when you have evidence; label concepts and proposed benefits clearly.',
  lessons: 'What did you learn, what would you change, and what would you explore next?',
};

const newSection = type => ({ id: crypto.randomUUID(), type, heading: '', ...(type === 'gallery' ? { images: [] } : type === 'metrics' ? { items: [{ value: '', label: '' }] } : {}) });

export default function ProjectContentEditor({ content, change, ImageField, onBusy, onError }) {
  const sections = Array.isArray(content.sections) ? content.sections : caseStudySections(content);
  const update = (id, patch) => change('sections', sections.map(section => section.id === id ? { ...section, ...patch } : section));
  const move = (index, direction) => {
    const next = [...sections];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    change('sections', next);
  };
  const imageProps = { onBusy, onError };
  return <section className="space-y-5 border-t border-white/10 pt-8">
    <h3 className="text-xl font-semibold">Page content & visibility</h3>
    <p className="text-sm text-white/50">Choose what visitors see. You can change the content and structure later.</p>
    <div className="grid sm:grid-cols-2 gap-4">{[['hideCardImage','Hide image on project cards'],['hideCardTitle','Hide title on project cards'],['hideCardSubtitle','Hide subtitle on project cards'],['hideHero','Hide project hero image'],['hideMetadata','Hide role, studio and duration']].map(([key,label]) => <label className="flex items-center gap-3" key={key}><input type="checkbox" checked={Boolean(content[key])} onChange={event => change(key,event.target.checked)} />{label}</label>)}</div>
    <label className="block">Live project URL (optional)<input type="url" placeholder="https://…" value={content.liveUrl || ''} onChange={event => change('liveUrl',event.target.value)} /></label>
    <label className="block">Deliverables (optional, one per line)<textarea rows={3} value={(content.deliverables || []).join('\n')} onChange={event => change('deliverables',event.target.value.split('\n'))} /></label>
    {!Array.isArray(sections) ? <div className="flex flex-wrap gap-3"><button type="button" className="admin-button" onClick={() => change('sections',legacySections(content))}>Customize page sections</button><button type="button" className="admin-button" onClick={() => change('sections',caseStudySections(content))}>Start a detailed case study</button></div> : <>
      <p className="text-xs text-white/50">Sections appear in this order. Hidden sections remain saved in the draft.</p>
      {sections.map((section,index) => <section key={section.id} className="admin-panel space-y-4">
        <div className="flex flex-wrap gap-2 items-center"><strong className="mr-auto capitalize">{index + 1}. {section.type}</strong><button type="button" className="admin-button" disabled={index === 0} onClick={() => move(index,-1)} aria-label="Move section up">↑</button><button type="button" className="admin-button" disabled={index === sections.length - 1} onClick={() => move(index,1)} aria-label="Move section down">↓</button><button type="button" className="admin-button" onClick={() => { if (window.confirm('Remove this section from the draft?')) change('sections',sections.filter(item => item.id !== section.id)); }}>Remove</button></div>
        <label className="flex items-center gap-3"><input type="checkbox" checked={Boolean(section.hidden)} onChange={event => update(section.id,{ hidden: event.target.checked })} />Hide this section</label>
        <label className="block">Heading (optional)<input value={section.heading || ''} onChange={event => update(section.id,{ heading: event.target.value })} /></label>
        {section.type === 'text' && <label className="block">Text{caseStudyPrompts[section.id] && <span className="block text-sm text-white/50 my-2">{caseStudyPrompts[section.id]}</span>}<textarea rows={6} value={section.body || ''} onChange={event => update(section.id,{ body: event.target.value })} /></label>}
        {section.type === 'image' && <><ImageField {...imageProps} label="Section image" value={section.src} onChange={src => update(section.id,{ src })} /><label className="block">Image description<input value={section.alt || ''} onChange={event => update(section.id,{ alt: event.target.value })} /></label><label className="block">Caption<input value={section.caption || ''} onChange={event => update(section.id,{ caption: event.target.value })} /></label></>}
        {section.type === 'gallery' && <><div className="grid sm:grid-cols-2 gap-4">{(section.images || []).map((image,i) => <div className="space-y-3" key={i}><ImageField {...imageProps} label={`Gallery image ${i+1}`} value={image.src} onChange={src => update(section.id,{ images: section.images.map((item,j) => j === i ? { ...item,src } : item) })} /><label className="block">Description<input value={image.alt || ''} onChange={event => update(section.id,{ images: section.images.map((item,j) => j === i ? { ...item,alt: event.target.value } : item) })} /></label><button type="button" className="admin-button" onClick={() => update(section.id,{ images: section.images.filter((_item,j) => j !== i) })}>Remove image</button></div>)}</div><button type="button" className="admin-button" onClick={() => update(section.id,{ images: [...(section.images || []),{ src:'',alt:'' }] })}>Add image</button></>}
        {section.type === 'metrics' && <>{(section.items || []).map((item,i) => <div className="grid grid-cols-2 gap-3" key={i}>{['value','label'].map(field => <label key={field} className="capitalize">{field}<input value={item[field]} onChange={event => update(section.id,{ items: section.items.map((metric,j) => j === i ? { ...metric,[field]:event.target.value } : metric) })} /></label>)}<button type="button" className="admin-button" onClick={() => update(section.id,{ items: section.items.filter((_item,j) => j !== i) })}>Remove result</button></div>)}<button type="button" className="admin-button" onClick={() => update(section.id,{ items: [...(section.items || []),{ value:'',label:'' }] })}>Add result</button></>}
        {section.type === 'link' && <><label className="block">Button label<input value={section.label || ''} onChange={event => update(section.id,{ label:event.target.value })} /></label><label className="block">URL<input type="url" value={section.url || ''} onChange={event => update(section.id,{ url:event.target.value })} /></label></>}
      </section>)}
      <div className="flex flex-wrap gap-2">{['text','image','gallery','metrics','link'].map(type => <button type="button" key={type} className="admin-button capitalize" onClick={() => change('sections',[...sections,newSection(type)])}>+ {type}</button>)}</div>
    </>}
  </section>;
}
