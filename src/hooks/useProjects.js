import { useState, useEffect } from 'react';
import { projects as snapshot } from '../data/projects';
import { supabase } from '../lib/supabase';
import { listPublished } from '../lib/projects';
import { populateCaseStudy } from '../data/caseStudyCopy';

export const useProjectCollection = () => {
  const [projects, setProjects] = useState(supabase ? [] : snapshot);
  const [loading, setLoading] = useState(Boolean(supabase));
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const refresh = async () => {
      try {
        const rows = await listPublished();
        if (active) setProjects(rows.map(row => populateCaseStudy({ ...row.content, id: row.id })));
      } catch (error) {
        // Only use the bundled snapshot on an actual outage, never an empty result.
        console.error('Could not load published projects', error);
        if (active) setProjects(snapshot);
      } finally {
        if (active) setLoading(false);
      }
    };
    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('portfolio-published', refresh);
    return () => {
      active = false;
      window.removeEventListener('focus', refresh);
      window.removeEventListener('portfolio-published', refresh);
    };
  }, []);
  return { projects, loading };
};

export const useProjects = () => useProjectCollection().projects;
