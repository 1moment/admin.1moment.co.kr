import { fetchAuthSession } from 'aws-amplify/auth';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiClient = async (
  endpoint: string,
  options?: FetchOptions,
): Promise => {
  const session = await fetchAuthSession();
  const accessToken = session.tokens?.accessToken.toString();

  const defaultHeaders: Record<string, string> = {
    // "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }), // token이 있으면 추가
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
