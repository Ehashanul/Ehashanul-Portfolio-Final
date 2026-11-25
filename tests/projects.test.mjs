import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';

async function load(client) {
  const dependency = new SyntheticModule(['supabase'], function () { this.setExport('supabase', client); });
  const source = await readFile(new URL('../src/lib/projects.js', import.meta.url), 'utf8');
  const module = new SourceTextModule(source);
  await module.link(() => dependency);
  await module.evaluate();
  return module.namespace;
}

test('concurrent draft edits cannot silently overwrite a newer save', async () => {
  const query = { eq: () => query, select: async () => ({ data: [], error: null }) };
  const api = await load({ from: () => ({ update: () => query }) });
  await assert.rejects(api.saveDraft({ id: 'example', updated_at: 'old', content: { title: 'Example' } }), /changed in another tab/);
});

test('blank titles are rejected before contacting the database', async () => {
  const api = await load({ from: () => { throw new Error('Database should not be called'); } });
  await assert.rejects(api.saveDraft({ content: { title: '  ' } }), /project title/);
});

test('failed image uploads never publish a partially prepared snapshot', async () => {
  let published = false;
  const api = await load({ storage: { from: () => ({ download: async () => ({ error: new Error('Storage unavailable') }) }) }, rpc: () => { published = true; } });
  await assert.rejects(api.publishDraft({ id: 'example', content: { thumbnail: 'private:one.webp', heroImage: '/hero.png' } }), /Storage unavailable/);
  assert.equal(published, false);
});

test('shared images are uploaded once and existing media remains compatible with cloud publishing', async () => {
  let uploads = 0;
  let payload;
  const bucket = {
    download: async () => ({ data: new Blob(['image']), error: null }),
    upload: async () => { uploads++; return { data: {}, error: null }; },
    getPublicUrl: path => ({ data: { publicUrl: `https://example.com/${path}` } }),
  };
  const api = await load({ storage: { from: () => bucket }, rpc: async (_name, args) => { payload = args; return { error: null }; } });
  const draft = { id: 'example', updated_at: 'now', content: { title: 'Example', thumbnail: 'private:one.webp', heroImage: 'private:one.webp', gallery: ['private:one.webp'] } };
  await api.publishDraft(draft);
  assert.equal(uploads, 1);
  assert.equal(payload.published_content.thumbnail, payload.published_content.gallery[0]);
  assert.equal(payload.published_content.thumbnail, payload.published_content.heroImage);
  assert.match(payload.published_content.thumbnail, /^https:/);
  assert.equal(draft.content.thumbnail, 'private:one.webp');
});

test('publishing a card needs a thumbnail but no hero image', async () => {
  let snapshot;
  const api = await load({ rpc: async (_name, args) => { snapshot = args.published_content; return { error: null }; } });
  await assert.rejects(api.publishDraft({ content: { title: 'Example' } }), /project image/);
  await api.publishDraft({ content: { title: 'Example', thumbnail: '/image.png', featured: true } });
  assert.equal(snapshot.thumbnail, '/image.png');
  assert.equal(snapshot.featured, true);
});

test('hidden legacy sections stay private and existing draft content is preserved', async () => {
  let snapshot;
  const api = await load({ rpc: async (_name,args) => { snapshot = args.published_content; return { error: null }; } });
  const draft = { id: 'example', content: { title: 'Example', hideCardImage: true, hideHero: true, sections: [
    { id: 'private-notes', type: 'text', hidden: true, body: 'Unfinished confidential notes' },
    { id: 'intro', type: 'text', heading: 'Introduction', body: 'Public copy' },
  ] } };
  await api.publishDraft(draft);
  assert.equal(snapshot.sections.length, 1);
  assert.equal(snapshot.sections[0].id, 'intro');
  assert.equal(draft.content.sections.length, 2);
  assert.ok(!JSON.stringify(snapshot).includes('confidential'));
});

test('unsafe external project links are rejected before publishing', async () => {
  const api = await load({ rpc: () => { throw new Error('Must not publish'); } });
  await assert.rejects(api.publishDraft({ content: { hideCardImage: true, liveUrl: 'javascript:alert(1)' } }), /https/);
});

test('backend publication errors reach the editor instead of reporting success', async () => {
  const api = await load({ rpc: async () => ({ error: new Error('Not authorized') }) });
  await assert.rejects(api.publishDraft({ id: 'example', content: { thumbnail: '/one.png', heroImage: '/two.png' } }), /Not authorized/);
});

test('case-study media publishes safely while retaining editorial layout and hidden drafts', async () => {
  let snapshot;
  let uploads = 0;
  const bucket = {
    download: async () => ({ data: new Blob(['image']), error: null }),
    upload: async () => { uploads++; return { data: {}, error: null }; },
    getPublicUrl: path => ({ data: { publicUrl: `https://example.com/${path}` } }),
  };
  const api = await load({ storage: { from: () => bucket }, rpc: async (_name, args) => { snapshot = args.published_content; return { error: null }; } });
  const draft = { id: 'case-study', content: { title: 'Case study', thumbnail: '/cover.png', heroImage: 'private:hero.webp', headline: 'Designed for people', summary: 'Project context', year: '2026', tools: ['Figma'], deliverables: ['UX design'], sections: [
    { id: 'overview', type: 'text', layout: 'wide', body: 'The story' },
    { id: 'visual', type: 'image', src: 'private:hero.webp', caption: 'The result' },
    { id: 'gallery', type: 'gallery', columns: 'one', images: [{ src: 'private:gallery.webp', alt: 'Detail', caption: 'A closer look' }] },
    { id: 'private', type: 'text', hidden: true, body: 'Private notes' },
  ] } };
  await api.publishDraft(draft);
  assert.equal(uploads, 2);
  assert.equal(snapshot.sections[0].layout, 'wide');
  assert.equal(snapshot.sections[1].src, snapshot.heroImage);
  assert.equal(snapshot.sections[2].columns, 'one');
  assert.equal(snapshot.sections[2].images[0].caption, 'A closer look');
  assert.deepEqual(snapshot.tools, ['Figma']);
  assert.equal(snapshot.headline, 'Designed for people');
  assert.ok(!JSON.stringify(snapshot).includes('private:'));
  assert.ok(!JSON.stringify(snapshot).includes('Private notes'));
  assert.equal(draft.content.sections.length, 4);
});

test('case-study sections omit blank, hidden, and unsafe content', async () => {
  const source = await readFile(new URL('../src/utils/projectContent.js', import.meta.url), 'utf8');
  const module = new SourceTextModule(source);
  await module.link(() => { throw new Error('Unexpected dependency'); });
  await module.evaluate();
  const { visibleProjectSections, caseStudySections } = module.namespace;
  const visible = visibleProjectSections({ sections: [
    { id: 'blank-text', type: 'text', body: '  ' },
    { id: 'blank-image', type: 'image', src: '' },
    { id: 'blank-gallery', type: 'gallery', images: [] },
    { id: 'blank-metrics', type: 'metrics', items: [{ value: '', label: '' }] },
    { id: 'unsafe', type: 'link', url: 'javascript:alert(1)' },
    { id: 'hidden', type: 'text', body: 'Secret', hidden: true },
    { id: 'story', type: 'text', body: 'Public story' },
    { id: 'visual', type: 'image', src: '/visual.png' },
  ] });
  assert.deepEqual(visible.map(section => section.id), ['story', 'visual']);
  const legacy = caseStudySections({ problem: 'Existing challenge', gallery: ['/one.png'], outcome: 'Existing result' });
  assert.equal(legacy.find(section => section.id === 'challenge').body, 'Existing challenge');
  assert.equal(legacy.find(section => section.id === 'outcomes').body, 'Existing result');
});

test('authored copy fills both live case studies and preserves images and visibility', async () => {
  const source = await readFile(new URL('../src/data/caseStudyCopy.js', import.meta.url), 'utf8');
  const module = new SourceTextModule(source);
  await module.link(() => { throw new Error('Unexpected dependency'); });
  await module.evaluate();
  const { populateCaseStudy, populateDraft } = module.namespace;
  const original = { id: 'project-9919bf33-980d-4653-8e5b-1c66e34e5b7e', title: 'Unblur', thumbnail: '/cover.png', hideCardSubtitle: true, sections: [
    { id: 'goals', type: 'text', body: 'Modernize' },
    { id: 'outcomes', type: 'text', body: 'Well ' },
    { id: 'private', type: 'text', hidden: true, body: 'Private notes' },
    { id: 'custom', type: 'image', src: '/my-image.png' },
  ] };
  const filled = populateCaseStudy(original);
  assert.ok(filled.headline.length > 20);
  assert.ok(filled.summary.length > 100);
  assert.equal(filled.thumbnail, '/projects/unblur/cover-v2.svg');
  assert.equal(original.thumbnail, '/cover.png');
  assert.equal(filled.hideCardSubtitle, true);
  assert.equal(filled.sections.find(section => section.id === 'private').hidden, true);
  assert.equal(filled.sections.find(section => section.id === 'custom').src, '/my-image.png');
  assert.ok(filled.sections.find(section => section.id === 'contributions').body.length > 100);
  assert.equal(original.sections[0].body, 'Modernize');
  const android = populateCaseStudy({ id: 'project-03b9e759-7ea5-474a-9ee6-f356d141f71c', title: 'App', description: 'Nice', hideCardTitle: true });
  assert.equal(android.title, 'Blur Photo Editor');
  assert.equal(android.hideCardTitle, true);
  assert.ok(android.sections.filter(section => section.type === 'text' && !section.hidden).length === 3);
  const edited = { ...filled, headline: '', sections: [] };
  assert.equal(populateCaseStudy(edited), edited);
  const custom = { id: 'another-project', title: 'My project' };
  assert.equal(populateCaseStudy(custom), custom);
  const draft = populateDraft({ id: original.id, updated_at: 'same-timestamp', content: original });
  assert.equal(draft.updated_at, 'same-timestamp');
  assert.equal(draft.content.caseStudyCopyVersion, 1);
  assert.equal(draft.content.id, undefined);
});

test('image grain reveal follows scroll and reaches an exactly sharp settled image', async () => {
  const source = await readFile(new URL('../src/utils/imageMotion.js', import.meta.url), 'utf8');
  const module = new SourceTextModule(source);
  await module.link(() => { throw new Error('Unexpected dependency'); });
  await module.evaluate();
  const { imageRevealProgress: progress } = module.namespace;
  assert.equal(progress(1000, 1000), 0);
  assert.equal(progress(920, 1000), 0);
  assert.ok(Math.abs(progress(635, 1000) - 0.5) < 0.0001);
  assert.equal(progress(350, 1000), 1);
  assert.equal(progress(-500, 1000), 1);
  assert.equal(progress(100, 0), 1);
  assert.ok(progress(500, 1000) > progress(700, 1000));
});

test('requested project setup skips existing and trashed entries and publishes only new projects', async () => {
  const source = await readFile(new URL('../src/utils/seedRequestedProjects.js', import.meta.url), 'utf8');
  const module = new SourceTextModule(source);
  await module.link(() => { throw new Error('Unexpected dependency'); });
  await module.evaluate();
  const current = [{ id: 'existing', content: { title: 'Unblur' } }, { id: 'retouch', deleted_at: 'yesterday', content: { title: 'Retouch' } }];
  const requested = [{ id: 'unblur', title: 'Unblur' }, { id: 'retouch', title: 'Retouch' }, { id: 'beauty-editor', title: 'Beauty Editor', featured: true }];
  const saves = [];
  const published = [];
  const count = await module.namespace.seedRequestedProjects(current, requested, async draft => { saves.push(draft); return { ...draft, updated_at: 'saved' }; }, async draft => { published.push(draft); });
  assert.equal(count, 1);
  assert.equal(saves[0].id, 'beauty-editor');
  assert.equal(saves[0].content.id, undefined);
  assert.equal(published[0].updated_at, 'saved');
  const again = await module.namespace.seedRequestedProjects([...current, saves[0]], requested, () => { throw Error('Must not overwrite'); }, () => {});
  assert.equal(again, 0);
});

test('Unblur case study uses the supplied screens and qualitative owner-reported results', async () => {
  const source = await readFile(new URL('../src/data/caseStudyCopy.js', import.meta.url), 'utf8');
  const module = new SourceTextModule(source);
  await module.link(() => { throw new Error('Unexpected dependency'); });
  await module.evaluate();
  const project = module.namespace.populateCaseStudy({ id: 'project-9919bf33-980d-4653-8e5b-1c66e34e5b7e', title: 'Unblur', sections: [] });
  assert.equal(project.role, 'Lead UI/UX Designer');
  assert.equal(project.unblurStoryVersion, 1);
  assert.match(project.sections.find(section => section.id === 'outcomes').body, /Download and purchase rates/i);
  assert.ok(!/\d+\s*%/.test(JSON.stringify(project.sections)));
  const results = project.sections.find(section => section.id === 'project-results');
  assert.equal(results.items.length, 2);
  assert.match(results.items[0].label, /Download/);
  assert.match(results.items[1].label, /Purchase/);
  for (const section of project.sections.filter(section => section.type === 'image')) {
    const asset = await readFile(new URL(`../public${section.src}`, import.meta.url), 'utf8');
    if (section.src.endsWith('.svg')) assert.ok(asset.includes('data:image/webp;base64,'));
    assert.ok(!asset.includes('C:\\Users'));
  }
  await readFile(new URL(`../public${project.heroImage}`, import.meta.url));
  const edited = { ...project, summary: 'My updated introduction', sections: [] };
  assert.equal(module.namespace.populateCaseStudy(edited), edited);
});


test('Unblur assigns each supplied screen to one iPhone 18 Pro composition', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/projects/unblur/mockup-manifest.json', import.meta.url), 'utf8'));
  assert.equal(manifest.device, 'iPhone 18 Pro');
  const used = manifest.compositions.flatMap(composition => composition.screens);
  assert.equal(used.length, 8);
  assert.equal(new Set(used).size, 8);
  for (const composition of manifest.compositions) {
    const data = await readFile(new URL(`../public/projects/unblur/${composition.asset}`, import.meta.url));
    if (composition.asset.endsWith('.svg')) {
      const markers = [...data.toString().matchAll(/data-screen="([^"]+)"/g)].map(match => match[1]);
      assert.deepEqual(markers, composition.screens);
      if (markers.length) assert.ok(data.toString().includes('iPhone 18 Pro mockup'));
    }
  }
});


test('Blur Photo Editor documents the lead role, relaunch, ongoing work, and unique comparisons', async () => {
  const source = await readFile(new URL('../src/data/caseStudyCopy.js', import.meta.url), 'utf8');
  const module = new SourceTextModule(source);
  await module.link(() => { throw new Error('Unexpected dependency'); });
  await module.evaluate();
  const project = module.namespace.populateCaseStudy({ id: 'project-03b9e759-7ea5-474a-9ee6-f356d141f71c', title: 'App', sections: [{ id: 'private-notes', type: 'text', body: 'Private', hidden: true }] });
  assert.equal(project.title, 'Blur Photo Editor');
  assert.match(project.role, /Lead/);
  assert.match(project.duration, /1 year/);
  assert.match(project.status, /Ongoing/);
  assert.match(project.summary, /relaunch/);
  assert.ok(!/\d+\s*%/.test(JSON.stringify(project.sections)));
  assert.ok(project.sections.find(section => section.id === 'private-notes').hidden);
  const visuals = project.sections.filter(section => section.type === 'image');
  assert.equal(visuals.length, 9);
  const manifest = JSON.parse(await readFile(new URL('../public/projects/blur-photo-editor/mockup-manifest.json', import.meta.url), 'utf8'));
  const screens = manifest.compositions.flatMap(item => item.screens);
  assert.equal(screens.length, new Set(screens).size);
  assert.ok(screens.includes('old-home'));
  assert.ok(screens.includes('main-home'));
  for (const item of manifest.compositions) {
    const bytes = await readFile(new URL(`../public/projects/blur-photo-editor/${item.asset}`, import.meta.url));
    if (item.asset.endsWith('.svg')) assert.deepEqual([...bytes.toString().matchAll(/data-screen="([^"]+)"/g)].map(match => match[1]), item.screens);
  }
  const edited = { ...project, summary: 'My edited copy', sections: [] };
  assert.equal(module.namespace.populateCaseStudy(edited), edited);
});

test('Beauty Editor credits the assistant role and preserves all cross-platform screens', async () => {
  const source = await readFile(new URL('../src/data/caseStudyCopy.js', import.meta.url), 'utf8');
  const module = new SourceTextModule(source);
  await module.link(() => { throw new Error('Unexpected dependency'); });
  await module.evaluate();
  const project = module.namespace.populateCaseStudy({ id: 'beauty-editor', title: 'Beauty Editor', sections: [{id:'private-note', type:'text', body:'Private', hidden:true}] });
  assert.equal(project.role, 'Assistant UI/UX Designer');
  assert.equal(project.platform, 'iOS & Android');
  assert.match(project.summary, /assets/);
  assert.ok(!/lead designer|led the project|\d+\s*%/i.test(JSON.stringify(project.sections)));
  assert.equal(project.sections.find(section => section.id === 'private-note').hidden, true);
  const manifest = JSON.parse(await readFile(new URL('../public/projects/beauty-editor/mockup-manifest.json', import.meta.url), 'utf8'));
  const main = manifest.compositions.filter(item => !item.preview);
  const screens = main.flatMap(item => item.screens);
  assert.equal(screens.length, 12);
  assert.equal(new Set(screens).size, 12);
  for (const item of manifest.compositions) {
    const svg = await readFile(new URL(`../public/projects/beauty-editor/${item.asset}`, import.meta.url), 'utf8');
    assert.deepEqual([...svg.matchAll(/data-screen="([^"]+)"/g)].map(match => match[1]), item.screens);
    assert.ok(svg.includes('preserveAspectRatio="xMidYMid meet"'));
  }
  await readFile(new URL(`../public${project.heroImage}`, import.meta.url));
  await readFile(new URL(`../public${project.bentoImage}`, import.meta.url));
  const edited = {...project, sections:[], summary:'Updated by owner'};
  assert.equal(module.namespace.populateCaseStudy(edited), edited);
});


test('case studies follow challenge, contribution, evidence, and results with concise copy', async () => {
  const module = new SourceTextModule(await readFile(new URL('../src/data/caseStudyCopy.js', import.meta.url), 'utf8'));
  await module.link(() => { throw new Error('Unexpected dependency'); });
  await module.evaluate();
  for (const id of ['project-9919bf33-980d-4653-8e5b-1c66e34e5b7e','project-03b9e759-7ea5-474a-9ee6-f356d141f71c','beauty-editor','zstack']) {
    const project = module.namespace.populateCaseStudy({id,title:id,sections:[]});
    const visible = project.sections.filter(section => !section.hidden);
    assert.deepEqual(visible.slice(0,2).map(section => section.id),['challenge','contributions']);
    assert.ok(visible.findIndex(section => section.id === 'outcomes') > 1);
    assert.ok(visible.filter(section => section.type === 'text').every(section => section.body.length < 600));
    const edited = {...project,summary:'Owner edit',sections:[]};
    assert.equal(module.namespace.populateCaseStudy(edited),edited);
  }
});
