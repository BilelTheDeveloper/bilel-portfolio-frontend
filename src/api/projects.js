import axios from 'axios';
import CONFIG from './config';
let pending;
let cached;
let cachedAt = 0;
export function getProjects({ refresh = false } = {}) {
  if (!refresh && cached && Date.now() - cachedAt < 60000) return Promise.resolve(cached);
  if (!pending) pending = axios.get(CONFIG.ENDPOINTS.PROJECTS).then(response => {
    if (!response.data.success || !Array.isArray(response.data.data)) throw new Error('Invalid projects response');
    cached = response.data.data;
    cachedAt = Date.now();
    return cached;
  }).finally(() => { pending = undefined; });
  return pending;
}
export function clearProjectsCache() { cached = undefined; cachedAt = 0; }
