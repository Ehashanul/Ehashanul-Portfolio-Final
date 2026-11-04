-- Run once in your Supabase project's SQL Editor. No passwords or keys belong here.
begin;
create table public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
create policy "Read own admin membership" on public.portfolio_admins
  for select to authenticated using (user_id = (select auth.uid()));

create function public.is_portfolio_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.portfolio_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to authenticated;

create table public.project_drafts (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{0,99}$'),
  content jsonb not null check (jsonb_typeof(content) = 'object' and content ? 'title' and jsonb_typeof(content->'title') = 'string' and length(trim(content->>'title')) > 0),
  deleted_at timestamptz,
  updated_at timestamptz not null default clock_timestamp()
);
create table public.published_projects (
  id text primary key references public.project_drafts(id),
  content jsonb not null,
  sort_order integer not null default 0,
  published_at timestamptz not null default now()
);
alter table public.project_drafts enable row level security;
alter table public.published_projects enable row level security;
revoke all on public.project_drafts, public.published_projects from anon, authenticated;
grant select, insert, update on public.project_drafts to authenticated;
grant select on public.published_projects to anon, authenticated;
create policy "Admins manage drafts" on public.project_drafts for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "Visitors read published projects" on public.published_projects for select to anon, authenticated using (true);

create function public.touch_project() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = clock_timestamp(); return new; end;
$$;
create trigger project_updated before update on public.project_drafts for each row execute function public.touch_project();

create function public.publish_project(project_id text, expected_updated_at timestamptz, published_content jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare draft public.project_drafts;
begin
  if not public.is_portfolio_admin() then raise exception 'Not authorized'; end if;
  select * into draft from public.project_drafts where id = project_id for update;
  if not found or draft.deleted_at is not null then raise exception 'Project unavailable'; end if;
  if draft.updated_at <> expected_updated_at then raise exception 'Project changed. Reopen it before publishing.'; end if;
  if published_content->>'title' is distinct from draft.content->>'title' then raise exception 'Save your draft first'; end if;
  insert into public.published_projects(id, content, sort_order)
  values(project_id, published_content, coalesce((published_content->>'sortOrder')::integer, 0))
  on conflict(id) do update set content = excluded.content, sort_order = excluded.sort_order, published_at = now();
  -- Reuse immutable published URLs on subsequent edits instead of copying files again.
  update public.project_drafts set content = draft.content
    || jsonb_build_object('thumbnail', published_content->'thumbnail', 'heroImage', published_content->'heroImage', 'gallery', published_content->'gallery')
    || case when jsonb_typeof(draft.content->'sections') = 'array' then
      jsonb_build_object('sections', coalesce((
        select jsonb_agg(coalesce((select item from jsonb_array_elements(published_content->'sections') item where item->>'id' = original->>'id' limit 1), original) order by position)
        from jsonb_array_elements(draft.content->'sections') with ordinality as sections(original,position)
      ), '[]'::jsonb))
    else '{}'::jsonb end
  where id = project_id;
end;
$$;
create function public.unpublish_project(project_id text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_portfolio_admin() then raise exception 'Not authorized'; end if;
  delete from public.published_projects where id = project_id;
end;
$$;
create function public.set_project_trash(project_id text, restore boolean default false) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_portfolio_admin() then raise exception 'Not authorized'; end if;
  update public.project_drafts set deleted_at = case when restore then null else now() end where id = project_id;
  if not restore then delete from public.published_projects where id = project_id; end if;
end;
$$;
revoke all on function public.publish_project(text,timestamptz,jsonb), public.unpublish_project(text), public.set_project_trash(text,boolean) from public;
grant execute on function public.publish_project(text,timestamptz,jsonb), public.unpublish_project(text), public.set_project_trash(text,boolean) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types) values
  ('project-drafts', 'project-drafts', false, 5242880, array['image/webp','image/png','image/jpeg']),
  ('project-media', 'project-media', true, 5242880, array['image/webp','image/png','image/jpeg']);
create policy "Admins upload portfolio images" on storage.objects for insert to authenticated
  with check (bucket_id in ('project-drafts','project-media') and public.is_portfolio_admin());
create policy "Admins read portfolio image originals" on storage.objects for select to authenticated
  using (bucket_id in ('project-drafts','project-media') and public.is_portfolio_admin());
-- Public bucket files are readable by URL. Draft bucket files require signed URLs.
-- Media removal is deliberately not automatic: old published revisions may still use them.
commit;
