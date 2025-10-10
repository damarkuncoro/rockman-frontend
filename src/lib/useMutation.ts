"use client";

import { useState, useCallback } from "react";
import { getAuthToken, isTokenExpired, refreshAuthToken } from "./auth";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

export type UseMutationOptions = {
  headers?: Record<string, string>;
};

export type UseMutationReturn<T, U> = {
  /** Data hasil fetch */
  data: T | null;
  
  /** Status loading */
  loading: boolean;
  
  /** Error jika terjadi kesalahan */
  error: Error | null;
  
  /** Function untuk menjalankan mutasi */
  mutate: (body: U) => Promise<T | undefined>;
};

export function useMutation<T = any, U = any>(
  url: string,
  method: HttpMethod,
  options: UseMutationOptions = {}
): UseMutationReturn<T, U> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (body: U): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      let token = getAuthToken();

      // Refresh awal jika token kadaluarsa
      if (token && isTokenExpired(token)) {
        const refreshed = await refreshAuthToken();
        token = refreshed || token;
      }

      const doRequest = async (bearer?: string) => fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
          ...(bearer && { Authorization: `Bearer ${bearer}` }),
        },
        body: JSON.stringify(body),
      });

      let response = await doRequest(token || undefined);

      const contentType = response.headers.get('content-type') || '';
      let result: any = null;
      try {
        if (contentType.includes('application/json')) {
          result = await response.json();
        } else {
          const text = await response.text();
          result = text ? { message: text } : null;
        }
      } catch (parseError) {
        // Fallback: coba baca sebagai text jika parsing JSON gagal
        try {
          const text = await response.text();
          result = text ? { message: text } : null;
        } catch {
          result = null;
        }
      }

      // Jika unauthorized, coba refresh token lalu ulangi sekali
      if (response.status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          response = await doRequest(refreshed);
          const ct2 = response.headers.get('content-type') || '';
          try {
            if (ct2.includes('application/json')) {
              result = await response.json();
            } else {
              const text = await response.text();
              result = text ? { message: text } : null;
            }
          } catch {
            result = null;
          }
        }
      }

      if (!response.ok) {
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          result,
          url,
          method
        });
        const message = (result && (result.message || result.error)) || `${method} request failed (${response.status})`;
        throw new Error(message);
      }
      
      setData(result);
      return result;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      // Re-throw error agar bisa ditangkap di level pemanggil jika perlu
      throw error;
    } finally {
      setLoading(false);
    }
  }, [url, method, options.headers]);

  return {
    data,
    loading,
    error,
    mutate,
  };
}