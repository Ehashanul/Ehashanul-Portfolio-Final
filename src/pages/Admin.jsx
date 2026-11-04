import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, LogOut, Upload, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { listDrafts, listPublished, saveDraft, publishDraft, unpublishProject, trashProject, uploadImage, previewImage } from '../lib/projects';
import { projects as starterProjects } from '../data/projects';
import { mediaUrl } from '../utils/projectMedia';



const emptyProject = () => ({ id: `project-${crypto.randomUUID()}`, content: { name: '', title: '', sub: '', description: '', platform: 'Web', thumbnail: '', thumbnailAlt: '', liveUrl: '', featured: false, sortOrder: 0 } });

function PreviewImage({ path, title }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let active = true;
    previewImage(path).then(value => { if (active) setUrl(mediaUrl(value)); }).catch(() => {});
    return () => { active = false; };
  }, [path]);
  return url ? <img src={url} alt={title} className="w-full rounded-2xl object-contain max-h-96" /> : null;
}

function ImageField({ label, value, onChange, onBusy, onError }) {
  const [preview, setPreview] = useState('');
  useEffect(() => {
    let active = true;
    setPreview('');
    previewImage(value).then(url => { if (active) setPreview(mediaUrl(url)); }).catch(onError);
    return () => { active = false; };
  }, [value]);
  return <div className="admin-image-field">
    <span>{label}</span>
    {preview && <img src={preview} alt={label} />}
    <label className="admin-button"><Upload size={14} /> Upload image
      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        onBusy(true);
        try { onChange(await uploadImage(file)); } catch (error) { onError(error); } finally { onBusy(false); event.target.value = ''; }
      }} />
    </label>
    {value && <button type="button" className="text-xs text-white/50" onClick={() => onChange('')}>Remove from project</button>}
  </div>;
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rows, setRows] = useState([]);
  const [published, setPublished] = useState([]);
  const [editor, setEditor] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('active');
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState(false);
  const [retry, setRetry] = useState(0);
  const fail = error => setError(error.message || String(error));
  const refresh = async () => {
    const [drafts, live] = await Promise.all([listDrafts(), listPublished()]);
    setRows(drafts); setPublished(live.map(row => row.id));
    return drafts;
  };
  const run = async task => {
    setBusy(true); setError(''); setMessage('');
    try { await task(); } catch (error) { fail(error); } finally { setBusy(false); }
  };

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const update = next => { if (active) { setSession(next); setAllowed(false); setAuthReady(!next); if (!next) { setRows([]); setPublished([]); setEditor(null); setDirty(false); setPreview(false); } } };
    supabase.auth.getSession().then(({ data, error }) => { if (!active) return; if (error) { fail(error); setAuthReady(true); } else update(data.session); }).catch(error => { if (active) { fail(error); setAuthReady(true); } });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => update(next));
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session) return;
    let active = true;
    setAuthReady(false);
    setError('');
    (async () => {
      try {
        const { data, error } = await supabase.rpc('is_portfolio_admin');
        if (error) throw error;
        if (!data) throw new Error('Your account is not authorized to manage this portfolio.');
        if (active) { await refresh(); if (active) setAllowed(true); }
      } catch (error) { if (active) fail(error); }
      finally { if (active) setAuthReady(true); }
    })();
    return () => { active = false; };
  }, [session, retry]);

  useEffect(() => {
    const warn = event => { if (dirty || uploads) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, uploads]);

  useEffect(() => {
    if (!editor) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.querySelector('.admin-editor button')?.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, [Boolean(editor)]);

  const change = (field, value) => { setEditor(current => ({ ...current, content: { ...current.content, [field]: value } })); setDirty(true); };
  const close = () => {
    if (uploads || busy) return;
    if (dirty && !window.confirm('Discard your unsaved changes?')) return;
    setEditor(null); setDirty(false); setPreview(false);
  };
  const announce = text => { setMessage(text); window.dispatchEvent(new Event('portfolio-published')); };
  const save = async publish => {
    const saved = await saveDraft(editor);
    setEditor(saved); setDirty(false);
    if (publish) await publishDraft(saved);
    const refreshed = await refresh();
    setEditor(refreshed.find(row => row.id === saved.id) || saved);
    announce(publish ? 'Project published. Visitors will see this version on their next page load.' : 'Draft saved. The published version is unchanged.');
  };
  const download = (name, data) => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = name; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (!supabase) return <main className="admin-shell"><section className="admin-panel max-w-xl mx-auto"><p className="admin-eyebrow">Portfolio studio</p><h1>Connect your cloud workspace</h1><p>The dashboard is ready for Supabase. Follow <code>docs/SUPABASE_SETUP.md</code>, add the two public settings from <code>.env.example</code> to <code>.env.local</code>, then restart Vite.</p><p>Your existing portfolio remains available until the cloud connection is configured.</p><Link to="/" className="admin-button">Back to portfolio</Link></section></main>;

  const notice = <div aria-live="polite">{error && <p role="alert" className="admin-error">{error}</p>}{message && <p className="admin-success">{message}</p>}</div>;
  if (!authReady) return <main className="admin-shell"><p role="status">Opening your workspace…</p></main>;
  if (!session || !allowed) return <main className="admin-shell"><section className="admin-panel max-w-md mx-auto"><p className="admin-eyebrow">Private workspace</p><h1>Portfolio studio</h1><p>Sign in with your authorized admin account.</p>{notice}{session ? <div className="flex flex-wrap gap-3"><button className="admin-button admin-primary" disabled={busy} onClick={() => { setAllowed(false); setRetry(value => value + 1); }}>Retry connection</button><button className="admin-button" disabled={busy} onClick={() => run(async () => { const { error } = await supabase.auth.signOut({ scope: 'local' }); if (error) throw error; })}>Sign out</button></div> : <form className="space-y-5" onSubmit={event => { event.preventDefault(); run(async () => { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; setPassword(''); }); }}>
    <label>Email<input required type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} /></label>
    <label>Password<input required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} /></label>
    <button disabled={busy} className="admin-button admin-primary">{busy ? 'Signing in…' : 'Sign in'}</button>
    <p className="text-xs text-white/40">Accounts are created by the portfolio owner. Public registration is disabled.</p>
  </form>}<Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mt-6"><ArrowLeft size={14} /> Back to portfolio</Link></section></main>;

  const visible = rows.filter(row => Boolean(row.deleted_at) === (filter === 'trash') && row.content.title.toLowerCase().includes(search.toLowerCase()));
  return <main className="admin-shell">
    <header className="flex flex-wrap items-end justify-between gap-6 mb-8"><div><p className="admin-eyebrow">Your creative workspace</p><h1>Portfolio studio</h1><p className="text-white/50">{rows.filter(row => !row.deleted_at).length} projects · {published.length} published</p></div><div className="flex flex-wrap gap-3"><Link className="admin-button" to="/"><ArrowLeft size={16} /> Portfolio</Link><button className="admin-button" disabled={busy} onClick={() => run(async () => { const { error } = await supabase.auth.signOut(); if (error) throw error; setRows([]); setEditor(null); })}><LogOut size={16} /> Sign out</button></div></header>
    {notice}
    <div className="admin-toolbar"><input aria-label="Search projects" placeholder="Search projects…" value={search} onChange={event => setSearch(event.target.value)} /><select aria-label="Project status" value={filter} onChange={event => setFilter(event.target.value)}><option value="active">Active projects</option><option value="trash">Trash</option></select><button className="admin-button" onClick={() => run(async () => { download('portfolio-content-backup.json', { version: 1, exportedAt: new Date().toISOString(), drafts: await listDrafts(), published: await listPublished() }); announce('Content exported. Back up Storage files separately.'); })}><Download size={16} /> Export</button><button className="admin-button admin-primary" onClick={() => { setEditor(emptyProject()); setDirty(false); }}><Plus size={16} /> New project</button></div>
    {!rows.length && <section className="admin-panel mb-8"><h2>Start with your current portfolio</h2><p>Import the bundled projects as private drafts. Review each one before publishing.</p><button className="admin-button" disabled={busy} onClick={() => run(async () => { for (const [index, project] of starterProjects.entries()) { await saveDraft({ id: project.id, content: { ...project, featured: project.featured === true, sortOrder: index } }); } await refresh(); announce('Starter projects imported as drafts.'); })}>Import existing projects</button></section>}
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map(row => <article className="admin-panel" key={row.id}><div className="flex items-center justify-between gap-3"><span className="admin-eyebrow">{row.deleted_at ? 'In trash' : published.includes(row.id) ? 'Published + editable draft' : 'Draft'}</span>{row.content.featured && <span className="text-xs text-white/40">Featured</span>}</div><h2>{row.content.title}</h2><p>{row.content.sub || 'Add a subtitle'}</p><div className="flex flex-wrap gap-3 mt-6">{row.deleted_at ? <button disabled={busy} className="admin-button" onClick={() => run(async () => { await trashProject(row.id, true); await refresh(); announce('Restored as a draft.'); })}>Restore draft</button> : <><button className="admin-button" onClick={() => { setEditor(structuredClone(row)); setDirty(false); }}>Edit project</button><button disabled={busy} className="admin-button" onClick={() => { if (window.confirm(`Move “${row.content.title}” to trash and remove it from the public portfolio?`)) run(async () => { await trashProject(row.id); await refresh(); announce('Project moved to trash.'); }); }}>Trash</button></>}</div></article>)}</div>
    {!visible.length && rows.length > 0 && <p className="py-12 text-white/40">No projects match this view.</p>}
    {editor && <div className="admin-editor-overlay"><section role="dialog" aria-modal="true" aria-labelledby="project-editor-title" className="admin-editor" onKeyDown={event => { if (event.key === 'Escape') close(); if (event.key === 'Tab') { const items = [...event.currentTarget.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]')].filter(node => node.getClientRects().length); const first = items[0]; const last = items[items.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } } }}><div className="flex justify-between items-center gap-4"><div><p className="admin-eyebrow">{dirty ? 'Unsaved changes' : 'Project editor'}</p><h2 id="project-editor-title">{editor.content.title || 'New project'}</h2></div><button className="admin-button" disabled={busy || uploads > 0} onClick={close}>Close</button></div>{notice}<button type="button" className="admin-button mt-4" onClick={() => setPreview(value => !value)}>{preview ? 'Back to editing' : 'Preview draft'}</button>{preview && <article className="admin-panel mt-6 space-y-4"><p className="admin-eyebrow">Project card preview</p>{!editor.content.hideCardImage && <PreviewImage path={editor.content.thumbnail} title={editor.content.thumbnailAlt || editor.content.title} />}{(editor.content.name || editor.content.platform) && <p className="admin-eyebrow">{editor.content.name || editor.content.platform}</p>}{!editor.content.hideCardTitle && <h2>{editor.content.title}</h2>}{!editor.content.hideCardSubtitle && <p>{editor.content.sub}</p>}{editor.content.description && <p className="text-sm text-white/50">{editor.content.description}</p>}<p className="text-xs text-white/40">{editor.content.featured ? 'Selected for the homepage and All Projects.' : 'Shown on All Projects only.'}</p></article>}<form hidden={preview} onSubmit={event => { event.preventDefault(); run(() => save(false)); }}>
      <fieldset disabled={busy || uploads > 0} className="space-y-6 mt-6">
      <p className="text-sm text-white/50">Manage the card shown on All Projects. Select a project to also show it on the homepage.</p>
      <div className="grid sm:grid-cols-2 gap-5">{[['name','Project / client name'],['title','Project title'],['sub','Subtext'],['platform','Category / platform']].map(([field,label]) => <label key={field}>{label}<input required={field === 'title'} maxLength={200} value={editor.content[field] || ''} onChange={event => change(field,event.target.value)} /></label>)}<label>Display order<input type="number" min="0" max="10000" value={editor.content.sortOrder ?? 0} onChange={event => change('sortOrder',Number(event.target.value))} /></label></div>
      <label className="block">Short description<textarea rows={3} maxLength={600} value={editor.content.description || ''} onChange={event => change('description',event.target.value)} /></label>
      <label className="flex items-center gap-3"><input type="checkbox" checked={Boolean(editor.content.featured)} onChange={event => change('featured',event.target.checked)} /> Selected project: show on homepage</label>
      <ImageField label="Project image" value={editor.content.thumbnail} onChange={value => change('thumbnail',value)} onBusy={value => setUploads(count => count + (value ? 1 : -1))} onError={fail} />
      <label className="block">Image description<input value={editor.content.thumbnailAlt || ''} onChange={event => change('thumbnailAlt',event.target.value)} /></label>
      <label className="block">External project link (optional)<input type="url" placeholder="https://" value={editor.content.liveUrl || ''} onChange={event => change('liveUrl',event.target.value)} /><span className="block text-xs text-white/40 mt-2">Link to a live website, Figma prototype, or Behance project. Leave empty to display the card without a link.</span></label>
      <div className="grid sm:grid-cols-2 gap-3">{[['hideCardImage','Hide project image'],['hideCardTitle','Hide project title'],['hideCardSubtitle','Hide subtext']].map(([key,label]) => <label key={key} className="flex items-center gap-3"><input type="checkbox" checked={Boolean(editor.content[key])} onChange={event => change(key,event.target.checked)} />{label}</label>)}</div>
      <div className="flex flex-wrap gap-3 pt-4"><button className="admin-button" type="submit">Save draft</button><button className="admin-button admin-primary" type="button" onClick={() => run(() => save(true))}>Save & publish</button>{published.includes(editor.id) && <button type="button" className="admin-button" onClick={() => run(async () => { await unpublishProject(editor.id); await refresh(); announce('Project unpublished. Your draft is retained.'); })}>Unpublish</button>}</div>      </fieldset>{(busy || uploads > 0) && <p role="status" className="py-4 text-white/60">{uploads ? 'Optimizing and uploading image…' : 'Saving changes…'}</p>}
    </form></section></div>}
  </main>;
}
