export const mediaUrl = (path = '') => {
  if (/^https:\/\//i.test(path)) return path;
  if (!path || /^(?:[a-z]+:|\/\/)/i.test(path)) return '';
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
};
