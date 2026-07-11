/**
 * File: client/src/utils/api.js
 * Description: Preconfigured Axios client instance for CareerLaunch API requests.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 120000, // 2-minute timeout to allow for slower Gemini AI processing
});

export default api;
