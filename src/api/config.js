// client/src/api/config.js

// This is the "Nuclear" option. No variables, just the hard link.
const BASE_URL = 'https://bilel-portfolio-backend.onrender.com/api';

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