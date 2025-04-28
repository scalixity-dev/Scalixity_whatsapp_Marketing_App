// API configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://kea.mywire.org:5100/api',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default API_CONFIG; 