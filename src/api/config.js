/**
 * 🛠️ DYNAMIC API CONFIGURATION
 * This file automatically detects if you are in Development (Localhost)
 * or Production (Render/Vercel) so you don't have to change URLs manually.
 */

// 1. Check if the app is running in Production mode (Vercel)
const isProduction = import.meta.env.PROD;

// 2. Define the base URL based on the environment
// Fallback to Localhost if not in production
const BASE_URL = isProduction 
  ? 'https://bilel-portfolio-backend.onrender.com/api' 
  : 'http://localhost:5000/api';

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