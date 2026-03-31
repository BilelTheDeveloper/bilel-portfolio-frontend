/**
 * 🛠️ SECURE API CONFIGURATION
 * This file pulls the URL directly from your .env file.
 */

// 1. Pull the URL from the VITE_API_URL variable you just set
const BASE_URL = import.meta.env.VITE_API_URL;

export const CONFIG = {
  API_URL: BASE_URL,
  ENDPOINTS: {
    PROJECTS: `${BASE_URL}/projects`,
    AUTH: `${BASE_URL}/auth`,
    FEEDBACK: `${BASE_URL}/feedback`,
    MESSAGES: `${BASE_URL}/messages`,
  },
  VERSION: '1.0.0',
};

export default CONFIG;