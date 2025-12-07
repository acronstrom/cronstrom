// API configuration
// Use environment variable for external API URL, fallback to relative path for same-origin deployment
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

