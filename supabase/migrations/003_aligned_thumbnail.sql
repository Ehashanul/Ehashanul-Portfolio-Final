-- Run in Supabase SQL Editor after deploying the accompanying portfolio assets.
-- Updates only the generated Blur Photo Editor homepage/card thumbnail.
begin;
update public.project_drafts
set content = content || '{"bentoImage":"/projects/blur-photo-editor/thumbnail-onboarding-aligned.webp","blurPhotoThumbnailVersion":3}'::jsonb
where id = 'project-03b9e759-7ea5-474a-9ee6-f356d141f71c'
  and deleted_at is null
  and coalesce(content->>'blurPhotoThumbnailVersion','0') in ('0','1','2')
  and coalesce(content->>'bentoImage','') in ('','/projects/blur-photo-editor/bento.svg','/projects/blur-photo-editor/hero-studio.webp','/projects/blur-photo-editor/thumbnail-onboarding.webp');

update public.published_projects published
set content = content || '{"bentoImage":"/projects/blur-photo-editor/thumbnail-onboarding-aligned.webp","blurPhotoThumbnailVersion":3}'::jsonb,
    published_at = now()
where published.id = 'project-03b9e759-7ea5-474a-9ee6-f356d141f71c'
  and coalesce(content->>'blurPhotoThumbnailVersion','0') in ('0','1','2')
  and coalesce(content->>'bentoImage','') in ('','/projects/blur-photo-editor/bento.svg','/projects/blur-photo-editor/hero-studio.webp','/projects/blur-photo-editor/thumbnail-onboarding.webp')
  and exists (select 1 from public.project_drafts draft where draft.id = published.id and draft.deleted_at is null);
commit;
