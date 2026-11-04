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

export const projectSections = project => Array.isArray(project.sections) ? project.sections : legacySections(project);
