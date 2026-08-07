/**
 * File: client/src/utils/api.js
 * Description: Preconfigured Axios client instance for HireCore OS API requests.
 *              Ensures /api endpoint prefix is always present and includes withCredentials: true.
 */

import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const baseURL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL,
  timeout: 120000, // 2-minute timeout for AI processing
  withCredentials: true // Transmit HTTP-only JWT cookies across cross-origin requests
});

export default api;
