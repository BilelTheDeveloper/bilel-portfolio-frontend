import axios from 'axios';
// Same-origin API routing keeps Secure/SameSite cookies working without third-party cookies.
const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
let adminCsrf = '';
export const clearAdminCsrf = () => { adminCsrf = ''; };
axios.defaults.timeout = 20000;
axios.interceptors.request.use(config => {
  const url = new URL(config.url, window.location.origin);
  const api = new URL(BASE_URL, window.location.origin);
  const isApi = url.origin === api.origin && (url.pathname === api.pathname || url.pathname.startsWith(`${api.pathname}/`));
  const mutation = !['get', 'head', 'options'].includes(config.method || 'get');
  const publicSubmission = config.method === 'post' && ['/messages', '/feedback'].some(path => url.pathname === `${api.pathname}${path}`);
  config.withCredentials = isApi && !publicSubmission && (mutation || /\/(auth|messages|feedback\/admin)(?:\/|$)/.test(url.pathname));
  if (isApi && url.pathname.startsWith(`${api.pathname}/auth/`)) config.headers['X-Admin-Request'] = '1';
  if (isApi && adminCsrf && !publicSubmission) config.headers['X-Admin-CSRF'] = adminCsrf;
  return config;
});
axios.interceptors.response.use(response => {
  const url = new URL(response.config.url, window.location.origin);
  const api = new URL(BASE_URL, window.location.origin);
  if (url.origin === api.origin && url.pathname.startsWith(`${api.pathname}/auth/`) && response.data?.csrfToken) adminCsrf = response.data.csrfToken;
  return response;
});
export const CONFIG = {
  API_URL: BASE_URL,
  ENDPOINTS: Object.fromEntries(['projects', 'auth', 'feedback', 'messages'].map(name => [name.toUpperCase(), `${BASE_URL}/${name}`])),
};
export default CONFIG;
