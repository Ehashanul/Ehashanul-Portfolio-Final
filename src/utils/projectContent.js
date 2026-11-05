export const externalUrl = (value = '') => {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
  catch { return ''; }
};

export function legacySections(project) {
  return [
    { id: 'challenge', type: 'text', heading: 'The Challenge', body: project.problem },
    { id: 'vision', type: 'text', heading: 'The Vision', body: project.goal },
    { id: 'gallery', type: 'gallery', heading: 'Gallery', images: (project.gallery || []).filter(Boolean).map(src => ({ src, alt: '' })) },
    { id: 'process', type: 'text', heading: 'Methodology', body: (project.process || []).filter(Boolean).join(' → ') },
    { id: 'outcome', type: 'text', heading: 'Outcome & Results', body: project.outcome },
  ].filter(section => section.body || section.images?.length);
}

export const projectSections = project => Array.isArray(project.sections) ? project.sections : caseStudySections(project);

export const visibleProjectSections = project => projectSections(project).filter(section =>
  !section.hidden &&
  (section.type !== 'image' || Boolean(section.src)) &&
  (section.type !== 'link' || Boolean(externalUrl(section.url))) &&
  (section.type !== 'metrics' || section.items?.some(item => item.value || item.label)) &&
  (section.type !== 'text' || section.body?.trim()) &&
  (section.type !== 'gallery' || section.images?.some(image => image.src))
);

export const sectionAnchor = id => `case-study-${encodeURIComponent(id)}`;

// Preserve existing project facts when starting a longer case study.
// Empty sections are prompts for the editor, never invented project claims.
export function caseStudySections(project) {
  const images = (project.gallery || []).filter(Boolean).map(src => ({ src, alt: '' }));
  return [
    { id: 'gallery-intro', type: 'gallery', heading: '', images: images.slice(0, 2) },
    { id: 'overview', type: 'text', heading: 'Project overview', body: project.overview || project.sub || '' },
    { id: 'contributions', type: 'text', heading: 'My role & contributions', body: project.contributions || project.role || '' },
    { id: 'challenge', type: 'text', heading: 'The challenge', body: project.problem || '' },
    { id: 'goals', type: 'text', heading: 'Design approach', body: project.goal || '' },
    { id: 'research', type: 'text', heading: 'Research & insights', body: project.research || '' },
    { id: 'process', type: 'text', heading: 'Design process', body: (project.process || []).filter(Boolean).join(' → ') },
    { id: 'decisions', type: 'text', heading: 'Key design decisions', body: project.decisions || '' },
    { id: 'gallery', type: 'gallery', heading: 'Design highlights', images: images.slice(2) },
    { id: 'validation', type: 'text', heading: 'Testing & refinements', body: project.validation || '' },
    { id: 'outcomes', type: 'text', heading: 'Design outcome', body: project.outcome || '' },
    { id: 'lessons', type: 'text', heading: 'What I learned', body: project.lessons || '' },
  ];
}
