import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
// Fail clearly when the backend is offline instead of displaying an HTML error
// page inside the admin or leaving the workspace loading indefinitely.
async function backendFetch(input, init = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timer = setTimeout(abort, 15000);
  if (init.signal?.aborted) abort();
  init.signal?.addEventListener('abort', abort, { once: true });
  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    if (response.status >= 500) throw new Error('The cloud workspace is unavailable. Check that your Supabase project is running, then try again.');
    return response;
  } catch (error) {
    if (controller.signal.aborted) throw new Error('The cloud connection timed out. Please try again.');
    if (error instanceof TypeError) throw new Error('Could not reach the cloud workspace. Check your connection and try again.');
    throw error;
  } finally {
    clearTimeout(timer);
    init.signal?.removeEventListener('abort', abort);
  }
}

export const supabase = url && key ? createClient(url, key, { global: { fetch: backendFetch } }) : null;
