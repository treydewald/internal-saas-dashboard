/**
 * API utility with authentication header injection
 */

export interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'text' | 'response';
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Headers;
  data: T;
  raw: Response;
  json: () => Promise<T>;
  blob: () => Promise<Blob>;
  text: () => Promise<string>;
}

export const api = {
  /**
   * Make an API request with automatic token injection
   */
  request: async <T = unknown>(url: string, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const { responseType = 'json', ...requestOptions } = options;

    const response = await fetch(url, {
      ...requestOptions,
      headers,
    });

    // If 401, token might be expired
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }

    const parseData = async (): Promise<T> => {
      if (responseType === 'blob') {
        return (await response.blob()) as T;
      }

      if (responseType === 'text') {
        return (await response.text()) as T;
      }

      if (responseType === 'response') {
        return response as T;
      }

      if (response.status === 204) {
        return null as T;
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as T;
    };

    const data = await parseData();

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data,
      raw: response,
      json: async () => data,
      blob: async () => {
        if (data instanceof Blob) {
          return data;
        }

        return new Blob([typeof data === 'string' ? data : JSON.stringify(data)]);
      },
      text: async () => {
        if (typeof data === 'string') {
          return data;
        }

        if (data instanceof Blob) {
          return data.text();
        }

        return JSON.stringify(data);
      },
    };
  },

  /**
   * GET request
   */
  get: async <T = unknown>(url: string, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
    return api.request<T>(url, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post: async <T = unknown>(url: string, data: any, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
    return api.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  put: async <T = unknown>(url: string, data: any, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
    return api.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  delete: async <T = unknown>(url: string, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
    return api.request<T>(url, { ...options, method: 'DELETE' });
  },
};
