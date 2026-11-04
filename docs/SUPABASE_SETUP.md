# Portfolio cloud setup — Supabase Free

The app uses a hosted Supabase database; there is no local database to install.
Until configured, the portfolio uses `src/data/projects.js` and `/#/admin` shows setup guidance.
The dashboard never stores project content in localStorage. Supabase Auth persists your login session in browser storage.

## 1. Create your cloud project

1. Create a free project at https://supabase.com/dashboard (choose a region near your visitors).
2. Save the database password privately. Do not put it into the frontend.
3. In **SQL Editor**, run `supabase/migrations/001_portfolio.sql` once.
4. In **Authentication → Providers → Email**, disable new user signups.
5. In **Authentication → Users**, create your admin user with email and a strong password. Confirm the account through the Dashboard if needed.
6. Copy that user's UUID. In SQL Editor, run the following with your UUID:

```sql
insert into public.portfolio_admins(user_id)
values ('YOUR-AUTH-USER-UUID');
```

Only SQL administrators can grant dashboard access. An arbitrary authenticated user cannot add themselves.

## 2. Connect the app

Copy `.env.example` to `.env.local`. Set these public frontend settings from your project's **Connect / API Keys** settings:

```dotenv
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLISHABLE-KEY
VITE_BASE_PATH=/Ehashanul-Portfolio-Final/
```

Never use a `service_role` key, `sb_secret_...` key, or database password here. Vite exposes `VITE_` variables to visitors.
Restart `npm run dev`. Open `http://localhost:5173/Ehashanul-Portfolio-Final/#/admin`.

## 3. Start managing projects

- Sign in. On an empty workspace, import the existing projects as drafts.
- Edit a draft, upload thumbnail/hero/gallery images, set order (lower numbers first), and choose whether it is featured.
- Save draft keeps the public version unchanged. Save & publish publishes a snapshot.
- Uploads accept JPG/PNG/WebP, optimize to WebP at up to 2400 px, and enforce a 5 MB output limit.
- Draft uploads are private. Publishing copies referenced files to a public bucket. Unpublishing hides the project, but already-public media URLs remain accessible.
- Trash removes the published project and retains its editable draft. Restore returns it to drafts, not to public view.
- Project IDs are stable and kept when editing. Display titles can change without breaking links.
- Use **Customize page sections** to convert an existing case study into flexible sections. Add, hide, remove, or reorder text, images, galleries, result metrics, and external links. Empty section lists intentionally show no body content. Hidden sections are retained in drafts but excluded from published snapshots.
- Card title/subtitle/image and detail-page hero/metadata can be hidden independently. Deliverables and live project links appear only when supplied. Existing projects keep their legacy text/gallery layout until you customize it.
- The content export includes drafts and current published data, **not image files**. Download both Storage buckets separately for a full backup. Never commit private draft exports to the public repository.

The public site fetches the current published list on mount and on window focus. An empty published list stays empty. On a network failure it uses the bundled snapshot, which may be older. To refresh that outage snapshot, update `src/data/projects.js` with reviewed public data and deploy it; do not include drafts.

## 4. Verify permissions before launch

Use a signed-out/incognito session and a second signed-in account without an admin membership:

1. Both can read `published_projects`.
2. Neither can read or modify `project_drafts` or insert admin memberships.
3. Neither can upload or sign private image URLs, or call publish/trash RPCs successfully.
4. Your authorized account can save a draft without changing public content.
5. Publish, unpublish, trash, and restore behave correctly in a separate public browser.
6. Concurrent draft edits fail instead of silently overwriting another tab's saved changes.
7. Test an image upload and download the content export before migrating all content.

These checks require your real Supabase project. They cannot be verified by the frontend build alone.

## 5. Vercel or another host

For Vercel, configure `npm run build`, output `dist`, and the two Supabase public environment settings. Set `VITE_BASE_PATH=/`.
The app currently keeps HashRouter, so `/#/admin` works without SPA rewrite rules. Clean URLs/SEO are a separate migration.
The Vercel free plan must fit your site's permitted use. GitHub Pages remains compatible with the default repository base path.
Connecting a custom domain later does not migrate or reset the database. Update Supabase Auth Site URL/allowed redirects if you enable email links or OAuth.

## Free-plan operating notes

Supabase Free currently includes 500 MB of database space and 1 GB of file storage; free projects can pause after inactivity. Check current quotas at https://supabase.com/pricing.
There is no paid upgrade required by this implementation. Monitor Storage and egress usage; do not upload videos to these image buckets.
Uploaded files and old published copies are not automatically deleted, to avoid breaking referenced media. Remove unused files carefully through Storage after backing them up and checking all references.
Use separate Supabase development and production projects where possible. Keep SQL migrations in Git.

## Included now / next steps

Included: admin login, backend authorization policies, editable project drafts, image optimization/uploads, published snapshots, featured/order controls, private draft preview, trash/restore, content export, cloud-backed public pages.

Not yet included: full revision history/rollback, in-app restore from backup, account recovery UI, automatic cloud backups/media cleanup, drag-and-drop ordering, and CV/settings management. Admin passwords can be managed in Supabase Dashboard. These can be added without replacing the database.
