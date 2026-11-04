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
