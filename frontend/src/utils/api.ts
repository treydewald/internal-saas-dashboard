/**
 * API utility with authentication header injection
 */

export interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const api = {
  /**
   * Make an API request with automatic token injection
   */
  request: async (url: string, options: ApiOptions = {}) => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If 401, token might be expired
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }

    return response;
  },

  /**
   * GET request
   */
  get: async (url: string, options: ApiOptions = {}) => {
    return api.request(url, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post: async (url: string, data: any, options: ApiOptions = {}) => {
    return api.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  put: async (url: string, data: any, options: ApiOptions = {}) => {
    return api.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  delete: async (url: string, options: ApiOptions = {}) => {
    return api.request(url, { ...options, method: 'DELETE' });
  },
};
