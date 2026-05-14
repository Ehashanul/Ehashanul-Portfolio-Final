import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, Trash2, Download, LogIn, ExternalLink, Image as ImageIcon, RotateCcw } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { projects as initialProjects } from '../data/projects';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Load projects from localStorage or use initial data
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      setProjects(initialProjects);
    }
  }, []);

  const saveProjects = (newProjects) => {
    setProjects(newProjects);
    localStorage.setItem('portfolio_projects', JSON.stringify(newProjects));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all projects to default? All custom changes will be lost.')) {
      saveProjects(initialProjects);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple mock password
      setIsLoggedIn(true);
    } else {
      alert('Incorrect password');
    }
  };

  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'New Project',
      sub: 'Sub Title',
      thumbnail: '/project-1.png',
      heroImage: '/project-1-wide.png',
      gallery: ['', '', ''],
      size: 'small',
      platform: 'Web',
      emoji: '✨',
      problem: '',
      goal: '',
      process: ['Research', 'Design', 'Develop'],
      outcome: '',
      role: 'Designer',
      studio: 'Independent',
      duration: '1 Month'
    };
    setEditingProject(newProj);
  };

  const deleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      saveProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const exists = projects.find(p => p.id === editingProject.id);
    let newProjects;
    if (exists) {
      newProjects = projects.map(p => p.id === editingProject.id ? editingProject : p);
    } else {
      newProjects = [...projects, editingProject];
    }
    saveProjects(newProjects);
    setEditingProject(null);
  };

  const exportData = () => {
    const dataStr = "export const projects = " + JSON.stringify(projects, null, 2) + ";";
    const blob = new Blob([dataStr], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'projects.js';
    link.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <GlassCard className="w-full max-w-md p-10 rounded-[40px] border-white/10">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-p400/20 flex items-center justify-center mx-auto mb-6 text-p300">
              <LogIn className="w-8 h-8" />
            </div>
            <h1 className="font-bebas text-4xl tracking-widest text-white mb-2">RESTRICTED ACCESS</h1>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Portfolio Control Center</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Key"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-p400/50 transition-all placeholder:text-white/20"
            />
            <button className="w-full py-4 rounded-2xl bg-white text-black font-semibold text-sm tracking-widest uppercase hover:bg-p300 hover:text-white transition-all">
              Unlock Console
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-14 max-w-7xl mx-auto relative z-10">
      
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-[1000] px-8 py-4 rounded-full bg-white text-black font-mono text-[11px] font-bold uppercase tracking-widest shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Project Database Synchronized
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div>
          <div className="flex items-center gap-4 text-p300 font-mono text-[10.5px] uppercase tracking-widest mb-4">
            <div className="w-7 h-px bg-p300 shadow-[0_0_8px_#a78bfa]" />
            Dashboard
          </div>
          <h1 className="font-bebas text-7xl lg:text-8xl tracking-wider">
            PROJECT <span className="bg-grd-accent bg-clip-text text-transparent">MANAGER</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={handleReset} className="btn-secondary py-3 px-6 rounded-2xl flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={exportData} className="btn-secondary py-3 px-6 rounded-2xl flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button onClick={addProject} className="btn-primary py-3 px-6 rounded-2xl flex items-center gap-2 bg-p400 text-white hover:bg-p500">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <GlassCard key={proj.id} className="p-8 rounded-[32px] border-white/5 group hover:border-p400/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl group-hover:opacity-20 transition-opacity">{proj.emoji}</div>
            <h3 className="font-bebas text-3xl tracking-wider mb-2 text-white/90">{proj.title}</h3>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-8">{proj.sub}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setEditingProject(proj)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteProject(proj.id)}
                className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <AnimatePresence>
        {editingProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-end bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-2xl h-full bg-ink border-l border-white/10 p-12 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="font-bebas text-5xl tracking-widest text-white">Project Editor</h2>
                <button onClick={() => setEditingProject(null)} className="text-white/40 hover:text-white uppercase font-mono text-[10px] tracking-widest">Close</button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Project Title</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-p400"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Subtitle</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-p400"
                      value={editingProject.sub}
                      onChange={(e) => setEditingProject({...editingProject, sub: e.target.value})}
                    />
                  </div>
                </div>

                {/* Images Section */}
                <div className="space-y-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                  <h3 className="font-mono text-[10px] text-p300 uppercase tracking-widest mb-4">Project Imagery (5 Images)</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Thumbnail (Home/Gallery)</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-p400"
                        value={editingProject.thumbnail}
                        onChange={(e) => setEditingProject({...editingProject, thumbnail: e.target.value})}
                        placeholder="/project-1.png"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Hero Image (Wide Header)</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-p400"
                        value={editingProject.heroImage}
                        onChange={(e) => setEditingProject({...editingProject, heroImage: e.target.value})}
                        placeholder="/project-1-wide.png"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                       {[0, 1, 2].map((i) => (
                         <div key={i} className="space-y-2">
                           <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Gallery Image {i+1}</label>
                           <input 
                             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-p400"
                             value={editingProject.gallery?.[i] || ''}
                             onChange={(e) => {
                               const newGallery = [...(editingProject.gallery || ['', '', ''])];
                               newGallery[i] = e.target.value;
                               setEditingProject({...editingProject, gallery: newGallery});
                             }}
                             placeholder={`/gallery-${i+1}.png`}
                           />
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Platform</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-p400"
                      value={editingProject.platform}
                      onChange={(e) => setEditingProject({...editingProject, platform: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Emoji Icon</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-p400"
                      value={editingProject.emoji}
                      onChange={(e) => setEditingProject({...editingProject, emoji: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Layout Size</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-p400 appearance-none"
                      value={editingProject.size}
                      onChange={(e) => setEditingProject({...editingProject, size: e.target.value})}
                    >
                      <option value="small">Small (Square)</option>
                      <option value="large">Large (Wide)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">The Problem</label>
                  <textarea 
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-p400 resize-none"
                    value={editingProject.problem}
                    onChange={(e) => setEditingProject({...editingProject, problem: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">The Goal</label>
                  <textarea 
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-p400 resize-none"
                    value={editingProject.goal}
                    onChange={(e) => setEditingProject({...editingProject, goal: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Outcome & Impact</label>
                  <textarea 
                    rows="2"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-p400 resize-none italic"
                    value={editingProject.outcome}
                    onChange={(e) => setEditingProject({...editingProject, outcome: e.target.value})}
                  />
                </div>

                <div className="pt-8">
                  <button className="w-full py-5 rounded-[24px] bg-white text-black font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-p300 hover:text-white transition-all">
                    <Save className="w-4 h-4" /> Save Project Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
