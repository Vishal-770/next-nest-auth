import { api } from "./api";
import { getAccessToken } from "./get-token";

/**
 * Authenticated API client that automatically includes JWT token
 * Use this for making authenticated requests from client components
 */

async function createAuthHeaders() {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const authApi = {
  get: async <T>(url: string): Promise<T> => {
    const headers = await createAuthHeaders();
    const response = await api.get<T>(url, { headers });
    return response.data;
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const headers = await createAuthHeaders();
    const response = await api.post<T>(url, data, { headers });
    return response.data;
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const headers = await createAuthHeaders();
    const response = await api.put<T>(url, data, { headers });
    return response.data;
  },

  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const headers = await createAuthHeaders();
    const response = await api.patch<T>(url, data, { headers });
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const headers = await createAuthHeaders();
    const response = await api.delete<T>(url, { headers });
    return response.data;
  },
};
