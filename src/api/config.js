import axios from 'axios';
const BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://bilel-portfolio-backend-l652.onrender.com/api')).replace(/\/$/, '');
axios.defaults.timeout = 15000;
axios.interceptors.request.use(config => {
  const url = new URL(config.url, window.location.origin);
  const api = new URL(BASE_URL, window.location.origin);
  config.withCredentials = url.origin === api.origin && /\/(auth|messages|feedback\/admin)(?:\/|$)/.test(url.pathname) && !(url.pathname.endsWith('/messages') && config.method === 'post');
  if (url.origin === api.origin && !['get', 'head', 'options'].includes(config.method)) config.withCredentials = !['/messages', '/feedback'].some(path => url.pathname.endsWith(path));
  return config;
});
export const CONFIG = {
  API_URL: BASE_URL,
  ENDPOINTS: Object.fromEntries(['projects', 'auth', 'feedback', 'messages'].map(name => [name.toUpperCase(), `${BASE_URL}/${name}`])),
};
export default CONFIG;
