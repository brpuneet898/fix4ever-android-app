import { config } from '../config';

export type ApiError = { message: string; success?: boolean; status?: number };

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: object;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<{ data?: T; error?: ApiError }> {
  const base = config.API_BASE_URL;
  const url = `${base}${path}`;
  const { body, headers: customHeaders, ...rest } = options;
  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };
  try {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('[API] Request:', options.method || 'GET', url);
    }
    const res = await fetch(url, {
      ...rest,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        typeof (json as any)?.message === 'string'
          ? (json as any).message
          : `Request failed (${res.status})`;
      return {
        error: {
          message,
          success: (json as any)?.success,
          status: res.status,
        },
      };
    }
    return { data: json as T };
  } catch (e: any) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log('[API] Network error:', url, e?.message || e);
    }
    return {
      error: {
        message: e?.message || 'Network error. Please check your connection.',
      },
    };
  }
}

export async function requestWithAuth<T>(
  path: string,
  token: string,
  options: RequestOptions = {}
): Promise<{ data?: T; error?: ApiError }> {
  return request<T>(path, {
    ...options,
    headers: {
      ...(options.headers as object),
      Authorization: `Bearer ${token}`,
    },
  });
}

export { request };
