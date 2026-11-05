// Owner-requested copy for the two existing published projects.
// Applied once to legacy content; saving through the admin stores the version
// marker so later edits (including deliberately empty fields) are respected.
const COPY_VERSION = 1;
const text = (id, heading, body) => ({ id, type: 'text', heading, body });

const COPY = {
  'project-9919bf33-980d-4653-8e5b-1c66e34e5b7e': {
    fields: {
      headline: 'Bringing blurry memories back into focus.',
      summary: 'Unblur is an iOS photo-enhancement app. This project focuses on modernizing its visual experience: making the promise of a clearer photo easy to understand, with a confident first impression and a focused starting point.',
      description: 'A refreshed iOS photo-enhancement experience, with a clearer visual hierarchy and a more expressive introduction to the product.',
      heroAlt: 'Unblur iOS app interface and visual design',
      heroCaption: 'A closer look at the Unblur experience.',
      deliverables: ['Interface design', 'Visual direction', 'Onboarding design'],
    },
    sections: [
      text('overview', 'A familiar problem. A clearer first step.', 'A photo can hold an important moment even when the image itself is imperfect. Unblur introduces photo enhancement through that familiar frustration, keeping the focus on the picture and what it could become.\n\nThe design direction brings the product’s purpose to the surface. Before-and-after imagery explains the benefit visually, while a short message and one prominent action give the opening screen a clear sense of direction.'),
      text('challenge', 'Make the value visible.', 'The starting point was a visual refresh. For an app built around image clarity, the interface needs to communicate its value without turning the first encounter into a technical explanation.\n\nThe challenge was to balance an expressive visual identity with a simple hierarchy: understand the promise, see an example, and know where to begin.'),
      text('goals', 'Let the image tell the story.', 'The opening composition places a soft image beside its sharper counterpart, turning the product’s purpose into something immediately visible. The dark canvas gives the photography room to stand out, while purple accents connect the product name to the primary action.\n\nSupporting copy stays brief. The result is a direction that feels energetic without asking every element to compete for attention.'),
      text('decisions', 'A focused visual hierarchy.', 'Three elements carry the introduction: the photo comparison, the product promise, and the Get Started button. Their order creates a straightforward path through the screen.\n\nGenerous spacing separates the main message from secondary information. A rounded, high-contrast button makes the next step distinct, while the quieter legal text remains available below it.'),
      text('outcomes', 'Clarity beyond the photograph.', 'The visual direction ties the product’s purpose to the way it presents itself: a clear comparison, a clear message, and a clear next step. Photography, typography, and color work together to give the app a cohesive, modern first impression.'),
    ],
  },
  'project-03b9e759-7ea5-474a-9ee6-f356d141f71c': {
    fields: {
      title: 'Blur Photo Editor',
      headline: 'Creative photo tools. A more focused experience.',
      summary: 'An Android photo-editing interface that brings blur effects, enhancement, and creative tools into one visual language. The featured design explores how to introduce premium features and subscription choices without losing sight of the image itself.',
      description: 'An Android photo-editing experience with expressive visuals, clear feature discovery, and a considered premium-plan presentation.',
      heroAlt: 'Blur Photo Editor Android interface showing editing features and subscription options',
      heroCaption: 'Feature discovery and subscription choices in the Android photo-editing experience.',
      deliverables: ['Mobile interface design', 'Visual hierarchy', 'Subscription screen design'],
    },
    sections: [
      text('overview', 'Room for creativity. Space for clarity.', 'Photo editors bring together tools with very different purposes, from softening a background to restoring detail or adding a creative effect. Presenting those possibilities is a design problem of its own.\n\nThis interface uses the photo as the starting point, then layers feature names and plan choices beneath it. The composition connects what the app offers with the decision the user is being asked to make.'),
      text('challenge', 'Give a busy screen a clear order.', 'The featured screen needs to hold several kinds of information: a product image, editing capabilities, subscription options, a trial choice, and supporting terms. Without a strong hierarchy, these elements can compete with one another.\n\nThe design direction separates discovery from decision-making, using grouping, contrast, and spacing to make each part easier to scan.'),
      text('goals', 'Start with the photograph.', 'A large portrait anchors the upper part of the screen. Feature labels introduce the range of creative tools, while a dark background connects the image area to the subscription section below.\n\nPurple accents give the selected plan and primary action a shared visual language. Secondary text stays quieter, keeping the central choices visually distinct.'),
      text('decisions', 'Make choices distinct.', 'The plan options sit in separate rounded containers, with a stronger border marking the selected state. Pricing and billing periods are grouped together, while the trial control sits close to the continuation action.\n\nThe main button uses a saturated gradient to stand apart from the surrounding interface. Restore, close, and legal information remain visible as supporting controls rather than competing primary actions.'),
      text('outcomes', 'One consistent visual language.', 'The featured interface brings imagery, feature labels, plan cards, and controls into a cohesive dark theme. Shared rounded shapes connect the elements, while a selective use of color distinguishes the main choices. The composition gives a feature-rich product a more focused visual presentation.'),
    ],
  },
};

const PLACEHOLDERS = new Set(['', 'nice', 'well', 'modernize', 'visual issue', 'great app', 'app']);
const isPlaceholder = value => typeof value === 'string' && PLACEHOLDERS.has(value.trim().toLowerCase());

// These are documented project / design facts, not invented business metrics.
const RESULTS = {
  'project-9919bf33-980d-4653-8e5b-1c66e34e5b7e': [
    { value: '06', label: 'Months project duration' },
    { value: 'Clear', label: 'Before-and-after product storytelling' },
    { value: 'Focused', label: 'A single primary onboarding action' },
  ],
  'project-03b9e759-7ea5-474a-9ee6-f356d141f71c': [
    { value: '02', label: 'Subscription options in the featured design' },
    { value: 'Distinct', label: 'Selected plan and primary action' },
    { value: 'Unified', label: 'Visual language across the featured screen' },
  ],
};

function populateResults(project) {
  const items = RESULTS[project.id];
  if (!items || project.caseStudyResultsVersion >= 1) return project;
  const sections = project.sections || [];
  return { ...project, caseStudyResultsVersion: 1, sections: sections.some(section => section.type === 'metrics') ? sections : [...sections, { id: 'project-results', type: 'metrics', heading: 'Results', items: structuredClone(items) }] };
}

export function populateCaseStudy(project) {
  const copy = COPY[project.id];
  if (!copy || project.caseStudyCopyVersion >= COPY_VERSION) return populateResults(project);
  const next = { ...project, caseStudyCopyVersion: COPY_VERSION };
  for (const [field, value] of Object.entries(copy.fields)) {
    const existing = project[field];
    if (existing == null || isPlaceholder(existing) || (Array.isArray(existing) && !existing.filter(Boolean).length)) next[field] = structuredClone(value);
  }
  const sections = Array.isArray(project.sections) ? structuredClone(project.sections) : [];
  // Keep all authored, hidden, and custom blocks. Only replace empty or known
  // placeholder copy, and add the missing narrative sections for these projects.
  for (const authored of copy.sections) {
    const index = sections.findIndex(section => section.id === authored.id);
    if (index < 0) sections.push({ ...authored });
    else if (sections[index].type === 'text' && (sections[index].body == null || isPlaceholder(sections[index].body))) {
      sections[index] = { ...sections[index], heading: authored.heading, body: authored.body };
    }
  }
  if (!Array.isArray(project.sections) && project.gallery?.length) {
    sections.splice(2, 0, { id: 'design-gallery', type: 'gallery', heading: 'Inside the experience', images: project.gallery.filter(Boolean).map(src => ({ src, alt: `${next.title} interface detail` })) });
  }
  const order = ['overview', 'contributions', 'challenge', 'research', 'gallery-intro', 'process', 'goals', 'decisions', 'design-gallery', 'gallery', 'validation', 'outcomes', 'lessons'];
  next.sections = sections.sort((a, b) => {
    const rank = section => order.includes(section.id) ? order.indexOf(section.id) : order.length;
    return rank(a) - rank(b);
  });
  return populateResults(next);
}

export function populateDraft(draft) {
  const { id: _id, ...content } = populateCaseStudy({ ...draft.content, id: draft.id });
  return { ...draft, content };
}
