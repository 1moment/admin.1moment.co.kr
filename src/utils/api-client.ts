interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiClient = (
  endpoint: string,
  options?: FetchOptions,
): Promise => {
  const token = localStorage.getItem("token");

  const defaultHeaders: Record<string, string> = {
    // "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // token이 있으면 추가
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  return fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, config);
};
