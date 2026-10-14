export const trackButtonGlow = (event) => {
  const button = event.currentTarget;
  const bounds = button.getBoundingClientRect();
  button.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
  button.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
  button.style.setProperty('--glow-x-percent', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
  button.style.setProperty('--glow-y-percent', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
};
