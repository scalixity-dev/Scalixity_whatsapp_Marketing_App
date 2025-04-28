import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://kea.mywire.org:5100/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api }; 