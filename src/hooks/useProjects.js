import { useState, useEffect } from 'react';
import { projects as staticProjects } from '../data/projects';

export const useProjects = () => {
  const [projects, setProjects] = useState(staticProjects);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse projects from localStorage", e);
        setProjects(staticProjects);
      }
    }
  }, []);

  // Listen for changes (e.g. if edited in another tab or updated in current)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_projects') {
        setProjects(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return projects;
};
