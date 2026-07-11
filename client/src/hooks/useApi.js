import { useCallback, useMemo } from 'react';
import api from '../utils/api';

export const useApi = () => {

  const request = useCallback(async (method, url, data = null, config = {}) => {
    const headers = { ...config.headers };

    try {
      const response = await api({
        method,
        url,
        data,
        ...config,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(`API Client error on ${method.toUpperCase()} ${url}:`, error.response?.data || error.message);
      // Throw standardized error payload or message
      throw error.response?.data || { message: 'A network communication error occurred.' };
    }
  }, []);

  return useMemo(() => ({
    get: (url, config) => request('get', url, null, config),
    post: (url, data, config) => request('post', url, data, config),
    put: (url, data, config) => request('put', url, data, config),
    delete: (url, config) => request('delete', url, null, config),
  }), [request]);
};
