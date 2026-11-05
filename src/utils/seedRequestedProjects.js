// Add only missing requested projects. Never overwrite or restore an existing
// draft, including trashed entries; repeated sign-ins are safe.
export async function seedRequestedProjects(current, requested, save, publish) {
  const normalize = value => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const known = new Set(current.flatMap(row => [row.id, normalize(row.content.title), normalize(row.content.name)]).filter(Boolean));
  let added = 0;
  for (const project of requested) {
    if (known.has(project.id) || known.has(normalize(project.title)) || (project.name && known.has(normalize(project.name)))) continue;
    const { id, ...content } = project;
    let saved;
    try { saved = await save({ id, content }); }
    catch (error) { if (error.code === '23505') continue; throw error; }
    await publish(saved);
    known.add(id);
    known.add(normalize(content.title));
    added++;
  }
  return added;
}
