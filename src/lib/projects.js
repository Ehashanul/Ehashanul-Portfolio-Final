import { supabase } from './supabase';

const checked = ({ data, error }) => { if (error) throw error; return data; };
export const listDrafts = async () => checked(await supabase.from('project_drafts').select('*').order('updated_at', { ascending: false }));
export const listPublished = async () => checked(await supabase.from('published_projects').select('id,content').order('sort_order'));

export async function saveDraft(draft) {
  const content = { ...draft.content, title: draft.content.title.trim() };
  if (!content.title) throw new Error('Please enter a project title.');
  if (draft.updated_at) {
    const rows = checked(await supabase.from('project_drafts').update({ content }).eq('id', draft.id).eq('updated_at', draft.updated_at).select());
    if (!rows.length) throw new Error('This project changed in another tab. Close and reopen it before saving.');
    return rows[0];
  }
  return checked(await supabase.from('project_drafts').insert({ id: draft.id, content }).select().single());
}

export async function uploadImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG, or WebP image.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Source images must be below 10 MB.');
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.85));
  if (!blob || blob.size > 5 * 1024 * 1024) throw new Error('Image is too large after optimization. Choose a smaller image.');
  const path = `${crypto.randomUUID()}.webp`;
  checked(await supabase.storage.from('project-drafts').upload(path, blob, { contentType: 'image/webp' }));
  return `private:${path}`;
}

export async function previewImage(path) {
  if (!path?.startsWith('private:')) return path;
  return checked(await supabase.storage.from('project-drafts').createSignedUrl(path.slice(8), 3600)).signedUrl;
}

export async function publishDraft(draft) {
  const content = structuredClone(draft.content);
  if (!content.thumbnail && !content.hideCardImage) throw new Error('Add a project image or hide the project image before publishing.');
  if (content.liveUrl) {
    let url;
    try { url = new URL(content.liveUrl); } catch { throw new Error('Enter a valid external project URL.'); }
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Use an https:// or http:// project link.');
  }
  const replacements = new Map();
  const publishImage = async value => {
    if (!value?.startsWith('private:')) return value;
    if (replacements.has(value)) return replacements.get(value);
    const blob = checked(await supabase.storage.from('project-drafts').download(value.slice(8)));
    const path = `${draft.id}/${crypto.randomUUID()}.webp`;
    checked(await supabase.storage.from('project-media').upload(path, blob, { contentType: 'image/webp' }));
    const url = supabase.storage.from('project-media').getPublicUrl(path).data.publicUrl;
    replacements.set(value, url);
    return url;
  };
  content.thumbnail = await publishImage(content.thumbnail);
  content.heroImage = await publishImage(content.heroImage);
  content.gallery = await Promise.all((content.gallery || []).filter(Boolean).map(publishImage));
  if (Array.isArray(content.sections)) {
    const visibleSections = [];
    for (const section of content.sections.filter(section => !section.hidden)) {
      if (section.type === 'image') section.src = await publishImage(section.src);
      if (section.type === 'gallery') {
        section.images = await Promise.all((section.images || []).filter(image => image.src).map(async image => ({ ...image, src: await publishImage(image.src) })));
      }
      visibleSections.push(section);
    }
    content.sections = visibleSections;
  }
  checked(await supabase.rpc('publish_project', { project_id: draft.id, expected_updated_at: draft.updated_at, published_content: content }));
}

export const unpublishProject = async id => checked(await supabase.rpc('unpublish_project', { project_id: id }));
export const trashProject = async (id, restore = false) => checked(await supabase.rpc('set_project_trash', { project_id: id, restore }));
