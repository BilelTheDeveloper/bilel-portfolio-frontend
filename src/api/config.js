// client/src/api/config.js
const BASE_URL = import.meta.env.VITE_API_URL || 'https://bilel-portfolio-backend-l652.onrender.com/api';

export const CONFIG = {
  API_URL: BASE_URL,
  ENDPOINTS: {
    PROJECTS: `${BASE_URL}/projects`,
    AUTH: `${BASE_URL}/auth`,
    FEEDBACK: `${BASE_URL}/feedback`,
    MESSAGES: `${BASE_URL}/messages`,
  },
};

export default CONFIG;