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

function populateOriginalCaseStudy(project) {
  project = populateBeautyCaseStudy(project);
  project = populateBlurPhotoCaseStudy(project);
  project = populateUnblurMockups(populateUnblurCaseStudy(project));
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

// November 2026: owner-supplied screens and confirmed lead-designer role.
// Upgrade only once so subsequent admin edits and deliberate removals survive.
function populateUnblurCaseStudy(project) {
  if (project.id !== 'project-9919bf33-980d-4653-8e5b-1c66e34e5b7e' || project.unblurStoryVersion >= 1) return project;
  const image = (id, file, alt, caption = '') => ({ id, type: 'image', src: `/projects/unblur/${file}`, alt, caption });
  const narrative = [
    text('overview', 'Make the possibility visible.', 'Unblur helps people enhance their photographs and explore AI-powered creative styles. I was the main designer of the project, shaping the visual experience across onboarding, editing, feature access, the paywall, and purchase confirmation.\n\nThe opportunity was to make the value of the product easier to see—and carry that clarity through the moments when someone decides to start, save a result, or upgrade.'),
    text('contributions', 'One designer. A connected journey.', 'As lead UI/UX designer, I worked across the key screens presented in this case study. My focus was the connection between visual communication and action: introducing the product clearly, keeping the photograph prominent during editing, and making the benefits of PRO distinct.\n\nA shared dark canvas, purple gradients, rounded controls, and consistent emphasis connect the experience from the first screen to the final confirmation.'),
    image('journey-visual', 'hero.svg', 'Three Unblur screen mockups showing onboarding, the creative editor, and the PRO paywall', 'The core journey: understand the promise, explore the tools, and discover PRO.'),
    text('challenge', 'An AI product should not feel complicated.', 'The interface brings together several decisions: choosing a creative style, comparing the result, saving an image, and deciding whether premium access is worthwhile. Each moment needs a clear priority.\n\nThe design challenge was to make an expressive, feature-rich app feel approachable while giving the upgrade journey a place within the experience.'),
    text('onboarding-story', 'Show the difference before explaining it.', 'The welcome screen uses an overlapping photo comparison to introduce the product visually. A short headline supports the image, and a single Get Started button gives the screen an unmistakable next step.\n\nThe purple accent links the Unblur name with the primary action. Supporting information stays secondary so the first impression remains focused on the product’s promise.'),
    image('onboarding-visual', 'onboarding.svg', 'Unblur onboarding screen presented in a graphite phone mockup', 'An image-led introduction with one clear starting action.'),
    text('editing-story', 'Keep the photograph at the center.', 'In the creative editor, the before-and-after comparison occupies most of the screen. Style categories and preview thumbnails sit below the image, with a purple selection outline identifying the active choice.\n\nRegenerate stays close to the result, while Save remains available in the top bar. The saved-result screen confirms completion and keeps sharing, returning home, and watermark removal within reach.'),
    image('editing-visual', 'creative-flow.svg', 'Unblur creative editor, saved result, and feature-access screen presented as three phone mockups', 'Explore a style, compare the image, save the result, and discover the next option.'),
    text('upgrade-story', 'Make the upgrade understandable.', 'The feature-access screen presents two distinct paths: watch an ad to continue or upgrade to PRO. The filled purple button gives the premium route stronger visual emphasis while preserving the alternative.\n\nThe paywall connects the offer to the product through a large photographic example and a short benefits list. Separate subscription cards, a selected state, a trial toggle, and a prominent Continue button organize the purchase decision.'),
    image('upgrade-visual', 'upgrade.svg', 'The Unblur PRO paywall and successful purchase confirmation in paired device mockups', 'A consistent visual language connects the premium offer with the confirmation that follows.'),
    text('completion-story', 'Finish the purchase with a clear welcome.', 'The purchase-confirmation screen makes the new PRO status explicit. The crown and celebratory imagery mark the transition, while the Continue button provides a straightforward return to the app.\n\nThe settings screen carries the same identity into the supporting experience, bringing premium access, purchase restoration, help, and legal information into an organized list.'),
    image('settings-visual', 'settings.svg', 'Unblur settings screen with the PRO promotion and account-support options', 'The same product identity extends beyond the editor.'),
    text('outcomes', 'A clearer experience, with business impact.', 'Following the design work, the project saw increases in download and purchase rates. My contribution focused on the screens that communicate the product’s value and support the journey from first use to premium access.\n\nThe work connects product presentation, creative exploration, saving, and upgrading through a consistent interface. The visual story remains centered on the photograph, with clear actions at each step.'),
    { id: 'project-results', type: 'metrics', heading: 'Results', items: [{ value: '↑', label: 'Download rate increased' }, { value: '↑', label: 'Purchase rate increased' }] },
  ];
  const legacy = new Set(['overview','contributions','challenge','goals','research','process','decisions','gallery-intro','gallery','design-gallery','validation','outcomes','lessons','project-results']);
  const existing = project.sections || [];
  const sections = narrative.map(section => {
    const previous = existing.find(item => item.id === section.id);
    return previous?.hidden ? { ...section, hidden: true } : section;
  });
  sections.push(...existing.filter(section => !legacy.has(section.id) && !narrative.some(item => item.id === section.id)));
  return {
    ...project,
    unblurStoryVersion: 1,
    caseStudyCopyVersion: COPY_VERSION,
    caseStudyResultsVersion: 1,
    title: 'Unblur',
    role: 'Lead UI/UX Designer',
    headline: 'From a clearer photo to a clearer product experience.',
    summary: 'I led the design of Unblur’s core iOS experience—from the first impression to creative editing and PRO access. The project brought together an expressive visual identity, focused actions, and an upgrade journey, alongside increases in download and purchase rates.',
    description: 'Lead UI/UX design for an AI photo app, connecting onboarding, creative tools, and the premium experience.',
    thumbnail: '/projects/unblur/cover.svg',
    bentoImage: '/projects/unblur/hero-studio.webp',
    thumbnailAlt: 'Unblur onboarding screen in a graphite device mockup on a muted lavender background',
    heroImage: '/projects/unblur/hero-studio.webp',
    heroAlt: 'Studio presentation of the Unblur onboarding screen in a graphite smartphone',
    heroCaption: 'Unblur / Lead UI & UX design',
    hideHero: false,
    deliverables: ['UI/UX design', 'Visual direction', 'Onboarding', 'Creative editor', 'Paywall & PRO journey'],
    gallery: [],
    sections,
  };
}

function populateUnblurMockups(project) {
  if (project.id !== 'project-9919bf33-980d-4653-8e5b-1c66e34e5b7e') return project;
  if (project.unblurMockupVersion >= 4) return project.unblurThumbnailVersion >= 1 ? project : { ...project, unblurThumbnailVersion: 1, bentoImage: '/projects/unblur/hero-studio-v2.webp' };
  const removed = new Set(['journey-visual', 'onboarding-visual', 'feature-access-visual']);
  const revised = {
    'editing-story': {
      heading: 'From feature access to the final save.',
      body: 'The feature-access screen gives people two distinct paths: watch an ad to continue or upgrade to PRO. The filled purple action emphasizes the premium option while keeping the alternative available.\n\nOnce inside the creative editor, the photograph remains the focus. A before-and-after comparison, grouped style previews, and a visible selected state support exploration. Saving leads to a clear confirmation, with sharing and watermark removal close to the finished result.',
    },
    'editing-visual': { src: '/projects/unblur/creative-flow-v4.svg', alt: 'Feature access, creative editing, and saving presented left to right in three iPhone 18 Pro mockups', caption: '01 / Feature access → Editing → Saving' },
    'upgrade-story': {
      heading: 'Make the premium offer understandable.',
      body: 'The paywall connects the offer to the product through a large photographic example and a concise benefits list. Separate subscription cards make the available plans distinct, while the purple selection state identifies the current choice.\n\nA trial control and a prominent Continue button organize the next step. The purchase-confirmation screen then makes the new PRO status explicit and gives the user a clear route back into the app.',
    },
    'upgrade-visual': { src: '/projects/unblur/upgrade-v2.svg', alt: 'Unblur paywall and purchase confirmation in black iPhone 18 Pro mockups', caption: '02 / Paywall → Purchase confirmation' },
    'settings-visual': { src: '/projects/unblur/settings-v2.svg', alt: 'Unblur settings in a black iPhone 18 Pro mockup', caption: '03 / Settings and support' },
  };
  const sections = (project.sections || []).filter(section => !removed.has(section.id)).map(section => revised[section.id] ? { ...section, ...revised[section.id] } : section);
  if (!sections.some(section => section.id === 'editing-visual')) {
    const index = sections.findIndex(section => section.id === 'editing-story');
    sections.splice(index < 0 ? sections.length : index+1, 0, { id: 'editing-visual', type: 'image', ...revised['editing-visual'] });
  }
  if (!sections.some(section => section.id === 'feedback-visual')) {
    const index = sections.findIndex(section => section.id === 'settings-visual');
    const story = text('feedback-story', 'Invite feedback in the product’s own voice.', 'The rating screen extends Unblur’s visual identity into a moment of feedback. Layered review cards introduce the request, while the app icon and purple accents connect it to the rest of the experience.\n\nA short invitation and one Rate us button keep the action clear. The layered composition gives this supporting moment a more expressive character while preserving the same visual language.');
    const image = { id: 'feedback-visual', type: 'image', src: '/projects/unblur/feedback-v4.webp', alt: 'Unblur rating invitation and review-card collage presented on an iPhone 18 Pro', caption: '04 / Rating invitation' };
    sections.splice(index < 0 ? sections.length : index+1, 0, story, image);
  }
  return { ...project, unblurMockupVersion: 4, unblurThumbnailVersion: 1, thumbnail: '/projects/unblur/cover-v2.svg', thumbnailAlt: 'Unblur visual identity with layered lavender forms', bentoImage: '/projects/unblur/hero-studio-v2.webp', heroImage: '/projects/unblur/hero-studio-v2.webp', heroAlt: 'Unblur onboarding screen presented on a black iPhone 18 Pro', heroCaption: 'Unblur / Onboarding', sections };
}


// Owner-supplied legacy/current screens, lead role, relaunch ownership, and
// continuing management. No unprovided research or business metrics are added.
function populateBlurPhotoCaseStudy(project) {
  if (project.id !== 'project-03b9e759-7ea5-474a-9ee6-f356d141f71c') return project;
  if (project.blurPhotoStoryVersion >= 1) return project.blurPhotoThumbnailVersion >= 3 ? project : { ...project, blurPhotoThumbnailVersion: 3, bentoImage: '/projects/blur-photo-editor/thumbnail-onboarding-aligned.webp' };
  const visual = (id, file, alt, caption) => ({ id, type: 'image', src: `/projects/blur-photo-editor/${file}.svg`, alt, caption });
  const narrative = [
    text('overview', 'A bigger product. A simpler way to edit.', 'Blur Photo Editor brings together blur tools, image restoration, enhancement, and AI-powered creative styles. I led the design work over roughly a year and managed the project through its relaunch. I continue to manage the app today.\n\nThe new version focused on the editing experience: helping people find the right tool, understand the current mode, and make adjustments without losing sight of their photograph.'),
    text('contributions', 'Leading the design—and carrying it through launch.', 'My role extended beyond individual screens. I was the lead designer and managed the project through the relaunch, connecting the interface work with the delivery of the new version.\n\nThe scope presented here spans onboarding, feature discovery, photo selection, editing tools, AI styles, and premium offers. That responsibility continues through my ongoing management of the app.'),
    visual('home-comparison', 'home-before-after', 'Previous and relaunched Blur Photo Editor home screens, labeled before and after', '01 / Home screen: previous version → Relaunch'),
    text('challenge', 'The challenge was not adding another tool.', 'The app already offered a broad range of editing capabilities. The design task was to organize that breadth into an experience that felt easier to use.\n\nThe earlier screens placed many tools and effects close together. In the relaunch, the focus shifted toward clearer entry points, task-specific controls, and more consistent editing patterns.'),
    text('onboarding-story', 'Begin with the user’s intention.', 'The new introduction moves from a visual overview of the product to a choice of goals: Pro Portrait, Fix & Restore, or AI Filter. A subsequent preview shows the kind of change the selected direction can offer.\n\nThis gives the opening flow a practical purpose. Rather than presenting every capability at once, it starts with what someone wants to achieve with their photo.'),
    visual('onboarding-visual', 'onboarding', 'The relaunched app introduction, goal selection, and portrait preview in three Android screen mockups', '02 / Introduction → Goal selection → Feature preview'),
    text('discovery-story', 'Connect inspiration with a clear starting point.', 'The photo picker brings image selection into a dedicated screen, with a visible Gallery action and grouped photo sources. Preset previews give a creative effect its own introduction before someone enters the editor.\n\nThese screens separate choosing an image from choosing a direction, giving each decision a clearer place in the experience.'),
    visual('discovery-visual', 'discovery', 'Photo selection and an Acrylic Art preset preview in the redesigned app', '03 / Choose a photo → Preview a creative direction'),
    text('editing-story', 'Make the editing hierarchy easier to follow.', 'The redesigned blur workspace separates the task from the adjustment. Touch Blur, Face Blur, Effects, and Shape sit within a consistent mode selector, while the active mode exposes its relevant controls above it.\n\nIntensity stays close to the image, and undo, redo, comparison, confirmation, and cancellation retain distinct places. The aim was to make the current action easier to understand without shrinking the photograph into a secondary element.'),
    visual('editing-comparison', 'editing-before-after', 'The older effects workspace next to the relaunched blur workspace', '04 / Editing workspace: previous version → Relaunch'),
    text('editing-modes-story', 'Different tools, familiar patterns.', 'Face selection, blur effects, shape controls, and image sharpening serve different purposes. The new screens use a shared control structure so the interface does not feel like a different product every time the tool changes.\n\nA visible active state, a consistent intensity control, and recognizable completion actions give these capabilities a common editing language.'),
    visual('editing-modes-visual', 'editing-modes', 'Four redesigned editing modes: Face Blur, Effects, Shape, and Unblur', '05 / Face Blur → Effects → Shape → Unblur'),
    text('ai-story', 'Structure the creative exploration.', 'The AI Filter experience keeps style categories and thumbnail previews below a large result area. The selected style is visible, and the generated-result state places Regenerate near the image.\n\nThe comparison shows how the newer interface organizes browsing and result review while keeping the creative output prominent.'),
    visual('ai-comparison', 'ai-before-after', 'The previous AI-filter screen and two redesigned AI-filter states', '06 / Previous AI filters → New result and browsing states'),
    text('feature-entry-story', 'Introduce capabilities where they make sense.', 'The feature-entry screens use a focused preview and a direct action to introduce a specific tool, such as blur or restoration. They carry the visual language of the new home screen into a more contextual explanation.\n\nThe goal is a more understandable transition from discovering a capability to using it.'),
    visual('feature-entry-visual', 'feature-entry', 'Contextual introductions to blur and restoration tools', '07 / Contextual entry points for individual tools'),
    text('premium-story', 'Give the premium decision a clearer structure.', 'The relaunch also included the premium presentation. The newer screen organizes the feature summary, available plans, selected state, trial control, and Continue action into a stronger hierarchy.\n\nA visible selected plan, a concise feature summary, and a distinct primary action give the decision a more focused presentation.'),
    visual('premium-comparison', 'premium-before-after', 'The previous subscription screen next to a relaunch paywall variant', '08 / Premium presentation: previous version → Relaunch'),
    text('offers-story', 'Keep offers part of the same experience.', 'The supplied annual-offer and feature-offer designs explore additional ways to present premium access. They retain the app’s dark surfaces, purple emphasis, rounded containers, and distinct primary actions.\n\nThese variants are shown as part of the design scope, with a consistent visual system connecting the offer to the product behind it.'),
    visual('offers-visual', 'offers', 'Annual and feature-based premium offer designs', '09 / Annual-offer and feature-offer designs'),
    text('relaunch-story', 'The relaunch was a milestone, not the finish line.', 'I managed the project through the relaunch and continue managing the app. That ongoing responsibility keeps the work connected to the product after the redesigned screens have shipped.\n\nThe central contribution was a revised editing experience: clearer navigation between tasks, more consistent controls, and a more deliberate path from discovery to editing.'),
    { id: 'project-results', type: 'metrics', heading: 'Project milestones', items: [{ value: '~1 year', label: 'Lead design and project work through relaunch' }, { value: 'Relaunched', label: 'Managed the project through the new release' }, { value: 'Ongoing', label: 'Continuing responsibility for the app' }] },
  ];
  const legacy = new Set(['overview','contributions','challenge','goals','research','process','decisions','gallery-intro','gallery','design-gallery','validation','outcomes','lessons','project-results']);
  const existing = project.sections || [];
  const sections = narrative.map(section => existing.find(item => item.id === section.id)?.hidden ? { ...section, hidden: true } : section);
  sections.push(...existing.filter(section => !legacy.has(section.id) && !narrative.some(item => item.id === section.id)));
  return { ...project, blurPhotoStoryVersion: 1, blurPhotoThumbnailVersion: 3, caseStudyCopyVersion: COPY_VERSION, caseStudyResultsVersion: 1,
    title: 'Blur Photo Editor', name: 'Blur Photo Editor', platform: 'Android App', role: 'Lead UI/UX Designer & Project Lead', duration: 'Approximately 1 year', status: 'Relaunched · Ongoing management',
    headline: 'A simpler editing experience. A relaunch I led.',
    summary: 'Over roughly a year, I led the design of Blur Photo Editor and managed the project through its relaunch. The new version focused on making editing easier through clearer tool organization, task-based flows, and a more consistent interface. I continue to manage the app today.',
    description: 'Lead design and project ownership for a photo-editing app relaunch, with a focus on simpler editing UX and ongoing product management.',
    deliverables: ['UI/UX design', 'Onboarding', 'Editing workflows', 'AI-filter experience', 'Premium presentation', 'Relaunch coordination'],
    thumbnail: '/projects/blur-photo-editor/cover.svg', thumbnailAlt: 'Blur Photo Editor identity with layered violet and orange forms',
    bentoImage: '/projects/blur-photo-editor/thumbnail-onboarding-aligned.webp', heroImage: '/projects/blur-photo-editor/hero-studio.webp', heroAlt: 'The redesigned Blur Photo Editor workspace in a black Android device mockup', heroCaption: 'Blur Photo Editor / Lead design, relaunch, and ongoing management', hideHero: false, gallery: [], sections,
  };
}

// Owner-confirmed supporting role: asset management and design refinements
// across both platforms. No timeline, growth figures, or lead ownership assumed.
function populateBeautyCaseStudy(project) {
  if (project.id !== 'beauty-editor' || project.beautyStoryVersion >= 2) return project;
  const visual = (id, file, alt, caption) => ({ id, type: 'image', src: `/projects/beauty-editor/${file}.svg`, alt, caption });
  const narrative = [
    text('overview', 'Good product work also lives in the details.', 'Beauty Editor brings together portrait retouching, reshaping, makeup, and finishing tools across iOS and Android. I contributed to the project as an assistant designer, helping manage visual assets and make design refinements.\n\nMy work supported the wider design effort through practical attention to the interface: preparing the visual material used across screens and helping refine how the product was presented on each platform.'),
    text('contributions', 'Supporting the design through assets and refinements.', 'My contribution centered on asset management and design tweaks across the iOS and Android versions. Working with screens from both platforms meant paying attention to the details that support a coherent product: imagery, interface presentation, and the relationship between the tools and the photograph.\n\nThis case study presents the product screens as context for that supporting contribution. The scope includes editing tools, premium access, and the save-and-share experience.'),
    text('retouch-story', 'Let the portrait stay prominent.', 'Both retouch screens keep the portrait prominent, with smoothing controls close to the image. Android groups related retouch options beneath the photograph, while iOS presents its face adjustments along the bottom.\n\nThese equivalent screens show how the same task is presented on each platform, with distinct control layouts and a shared emphasis on the result.'),
    visual('retouch-visual', 'retouch', 'Beauty Editor Android and iOS retouch screens with Smooth adjustments', '01 / Retouching on Android and iOS'),
    text('reshape-story', 'Related capabilities, platform-specific presentation.', 'The Android reshape screen presents presets and facial areas in horizontal groups. The iOS screen shows an adjustment value alongside a selection of facial controls.\n\nBoth place the portrait above the editing interface, but their layouts and visual treatments differ. My cross-platform support involved working within these distinct presentations while helping with assets and design refinements.'),
    visual('reshape-visual', 'reshape', 'Android reshape presets and iOS facial adjustment controls shown side by side', '02 / Android presets and iOS reshape controls'),
    text('makeup-story', 'Make small choices easy to identify.', 'Both makeup screens place color choices beneath the portrait. Android shows its color palette and makeup categories, while iOS uses a compact swatch strip. The selected controls remain close to the photograph.\n\nThis is the kind of detailed interface presentation where supporting design work matters: visual assets and small refinements need to sit comfortably within the wider screen.'),
    visual('makeup-visual', 'makeup', 'Beauty Editor Android and iOS makeup screens with color selection', '03 / Makeup and color selection on both platforms'),
    text('premium-story', 'Keep premium access connected to the product.', 'The Android subscription screen uses a feature comparison and plan cards to introduce premium access. The iOS presentation is more image-led, placing the offer over a portrait with the subscription choices and primary action below.\n\nThe supplied screens show two approaches within the same product. They provide context for the cross-platform asset and refinement work, with each interface retaining its own presentation.'),
    visual('premium-visual', 'premium', 'Beauty Editor Android subscription comparison and iOS premium offer', '04 / Android and iOS premium-access screens'),
    text('save-story', 'Finish with a clear confirmation.', 'Both platforms confirm that the edited photograph has been saved. Android places sharing destinations and further content below the result, while iOS groups watermark removal, a new-photo action, and sharing beneath the image.\n\nThese screens complete the editing journey and show how the product’s supporting actions are organized around the finished photograph.'),
    visual('save-visual', 'save-share', 'Beauty Editor saved-result screens on Android and iOS', '05 / Save confirmation and sharing across both platforms'),
    text('contribution-summary', 'A collaborative contribution across two platforms.', 'My role in Beauty Editor was to support the design through asset management and interface refinements across iOS and Android. The work reflects the practical, collaborative side of product design: making the visual material and smaller decisions fit the wider experience.\n\nThe screens bring that contribution into context across the editing tools and the supporting product flows.'),
    { id: 'project-results', type: 'metrics', heading: 'Contribution', items: [{ value: '02', label: 'Platforms supported: iOS and Android' }, { value: 'Support', label: 'Asset management and design refinements' }] },
  ];
  const existing = project.sections || [];
  const legacy = new Set(['overview','challenge','direction','project-results']);
  const sections = narrative.map(section => existing.find(item => item.id === section.id)?.hidden ? { ...section, hidden: true } : section);
  sections.push(...existing.filter(section => !legacy.has(section.id) && !narrative.some(item => item.id === section.id)));
  return { ...project, beautyStoryVersion: 2, title: 'Beauty Editor', platform: 'iOS & Android', role: 'Assistant UI/UX Designer',
    headline: 'Supporting the details across iOS and Android.',
    summary: 'I worked on Beauty Editor as an assistant designer across the iOS and Android versions, helping manage visual assets and refine interface details. My contribution supported the broader design effort across the portrait-editing experience and its surrounding screens.',
    sub: 'Cross-platform beauty editing', description: 'Assistant design across iOS and Android, focused on asset management and thoughtful interface refinements.',
    deliverables: ['Asset management', 'Design refinements', 'iOS design support', 'Android design support'],
    thumbnail: '/projects/beauty-editor/thumbnail.webp', bentoImage: '/projects/beauty-editor/thumbnail.webp', thumbnailAlt: 'Beauty Editor Android home screen in a proportion-correct rose studio mockup',
    heroImage: '/projects/beauty-editor/hero.webp', heroAlt: 'Beauty Editor Android and iOS home screens presented side by side', heroCaption: 'Beauty Editor / Assistant design across iOS and Android', hideHero: false, gallery: [], sections,
  };
}


// One-time editorial update. Subsequent admin edits retain their saved copy.
export function populateCaseStudy(project) {
  return organizeCaseStudy(populateOriginalCaseStudy(project));
}

function organizeCaseStudy(project) {
  if (project.caseStudyFlowVersion >= 1) return project;
  const stories = {
    'project-9919bf33-980d-4653-8e5b-1c66e34e5b7e': {
      headline: 'A clearer path from first impression to PRO.',
      summary: 'I was the main designer of Unblur, an iOS photo-editing app. My work covered onboarding, editing, premium access, and the supporting app experience.',
      challenge: 'Make the value of photo enhancement clear from the first screen, then guide users through editing and premium access without competing actions.',
      contribution: 'I designed the onboarding around a visible before-and-after benefit. I organized editing controls around the photo, made premium entry points distinct, and connected saving, purchase confirmation, settings, and feedback through the same visual language.',
      result: 'Download and purchase rates increased following my design work. Exact figures are not included because they have not been provided.',
      metrics: [{value:'Increased',label:'Download rate — owner-reported'},{value:'Increased',label:'Purchase rate — owner-reported'}],
    },
    'project-03b9e759-7ea5-474a-9ee6-f356d141f71c': {
      headline: 'Simpler editing. A relaunch I led.',
      summary: 'I led design and managed Blur Photo Editor through a roughly year-long relaunch. I continue to manage the app today.',
      challenge: 'A growing collection of tools made editing harder to navigate. The relaunch needed to help users find a tool, understand its controls, and stay focused on their photo.',
      contribution: 'I reorganized tool discovery and editing flows, introduced task-specific controls, and made adjustment patterns more consistent across modes. I also worked on onboarding and premium screens, and managed the project through relaunch.',
      result: 'The redesigned app was relaunched with clearer editing flows and more consistent controls. I continue to manage the product. No quantified usability or commercial results are available for this case study.',
      metrics: [{value:'Relaunched',label:'New editing experience delivered'},{value:'Ongoing',label:'Product management after launch'}],
    },
    'beauty-editor': {
      headline: 'Design support across iOS and Android.',
      summary: 'As an assistant designer on Beauty Editor, I helped manage assets and refine interface details across the iOS and Android apps.',
      challenge: 'Support two platform versions with different layouts while keeping visual assets and interface details coherent across editing and supporting flows.',
      contribution: 'I helped manage design assets and made interface tweaks across iOS and Android. My contribution supported the wider design team across the editing experience and its surrounding screens.',
      result: 'My contribution was asset management and design refinements across both platforms. The paired screens show the product context; no measured usability or business outcome is claimed.',
    },
    zstack: {
      headline: 'A template editor, still taking shape.',
      summary: 'ZStack is the working name of an ongoing, unreleased mobile editor. The current direction brings images, pages, layers, typography, and export into one workspace.',
      challenge: 'Keep the artwork visible while making page management, image tools, layers, and export easy to distinguish within a compact mobile interface.',
      contribution: 'The current screens explore a canvas-first workspace, focused crop and adjustment panels, page previews, a layer list, typography choices, and export settings. For this portfolio presentation, repeated placeholder icons were replaced with tool-specific symbols. My project role is still to be specified.',
      result: 'The project is in progress and has not been released. These screens show the current design direction; launch results and validated user outcomes are not available yet.',
    },
  };
  const story = stories[project.id];
  if (!story) {
    if (!['time-warp','retouch'].includes(project.id)) return project;
    const existing = project.sections || [];
    return {...project,caseStudyFlowVersion:1,sections:[
      text('challenge','Challenges',existing.find(item => item.id === 'challenge')?.body || ''),
      text('contributions','Design direction',existing.find(item => item.id === 'direction')?.body || ''),
      ...existing.filter(item => item.type !== 'text' || !['overview','challenge','direction'].includes(item.id)),
      text('outcomes','Results','This entry presents a design direction. A confirmed implementation scope and measured results have not been added yet.'),
    ]};
  }
  const existing = project.sections || [];
  const generatedIds = new Set(['overview','contributions','challenge','goals','research','process','decisions','gallery-intro','validation','outcomes','lessons','project-results','onboarding-story','discovery-story','editing-story','editing-modes-story','ai-story','feature-entry-story','premium-story','offers-story','relaunch-story','completion-story','settings-story','feedback-story','retouch-story','reshape-story','makeup-story','save-story','contribution-summary','image-story','composition-story','export-story','project-state','feature-story','upgrade-story','access-story','purchase-story','feature-access-story','upgrade-intro','support-story']);
  const section = (id,heading,body) => {
    const prior = existing.find(item => item.id === id);
    return {...text(id,heading,body), ...(prior?.hidden ? {hidden:true} : {})};
  };
  const visuals = existing.filter(item => item.type === 'image' || item.type === 'gallery');
  const custom = existing.filter(item => !generatedIds.has(item.id) && item.type !== 'image' && item.type !== 'gallery');
  const hidden = existing.filter(item => generatedIds.has(item.id) && item.hidden && !['challenge','contributions','outcomes','project-results'].includes(item.id));
  const sections = [section('challenge','Challenges',story.challenge),section('contributions','What I did',story.contribution),...visuals,section('outcomes','Results',story.result)];
  if (story.metrics) sections.push({id:'project-results',type:'metrics',heading:'At a glance',items:story.metrics,...(existing.find(item => item.id === 'project-results')?.hidden ? {hidden:true} : {})});
  sections.push(...custom,...hidden);
  return {...project,caseStudyFlowVersion:1,headline:story.headline,summary:story.summary,sections};
}
