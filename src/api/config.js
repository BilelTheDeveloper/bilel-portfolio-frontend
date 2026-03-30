/**
 * VITE_API_URL is pulled from your .env files.
 * If the .env variable is missing, it defaults to localhost for safety.
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CONFIG = {
  API_URL: BASE_URL,
  ENDPOINTS: {
    PROJECTS: `${BASE_URL}/projects`,
    AUTH: `${BASE_URL}/auth`, // Added for your Login logic
    FEEDBACK: `${BASE_URL}/feedback`,
    MESSAGES: `${BASE_URL}/messages`,
  },
  VERSION: '1.0.0',
};

export default CONFIG;