import axios from 'axios';
import CONFIG from './config';
let pending;
let cached;
let cachedAt = 0;
let version = 0;
export function getProjects({ refresh = false } = {}) {
  if (refresh) { version++; cached = undefined; cachedAt = 0; pending = undefined; }
  if (cached && Date.now() - cachedAt < 60000) return Promise.resolve(cached);
  if (!pending) {
    const current = version;
    const request = axios.get(CONFIG.ENDPOINTS.PROJECTS).then(response => {
      if (!response.data.success || !Array.isArray(response.data.data)) throw new Error('Invalid projects response');
      if (current === version) { cached = response.data.data; cachedAt = Date.now(); }
      return response.data.data;
    }).finally(() => { if (pending === request) pending = undefined; });
    pending = request;
  }
  return pending;
}
export function clearProjectsCache() { version++; cached = undefined; cachedAt = 0; pending = undefined; if (typeof window !== 'undefined') window.dispatchEvent(new Event('projects-updated')); }
