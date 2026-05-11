// config.js
// API URL changes based on environment
// Development → localhost
// Production  → Render URL
 
const API_URL = import.meta.env.VITE_API_URL 
  || 'http://localhost:8000'

export default API_URL