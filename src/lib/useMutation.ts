"use client";

import { useState, useCallback, useRef } from "react";
import { getAuthToken, isTokenExpired, refreshAuthToken } from "./auth";

export type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

export type UseMutationOptions<U = any> = {
  headers?: Record<string, string>;
  /** Optimistic update — dipanggil sebelum request */
  optimisticUpdate?: (body: U) => void;
  /** Rollback — dipanggil jika request gagal */
  rollback?: () => void;
  /** Cache keys yang akan dihapus saat sukses */
  invalidateKeys?: string[];
  /** Auto clear data sebelum request */
  clearOnStart?: boolean;
};

export type UseMutationReturn<T, U> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  mutate: (body: U) => Promise<T | undefined>;
  cancel: () => void;
};

export function useMutation<T = any, U = any>(
  url: string,
  method: HttpMethod = "POST",
  options: UseMutationOptions<U> = {}
): UseMutationReturn<T, U> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const mutate = useCallback(async (body: U): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    if (options.clearOnStart) setData(null);

    // Batalkan request sebelumnya (jika ada)
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      // Jalankan optimistic update sebelum request dikirim
      options.optimisticUpdate?.(body);

      // Ambil token dan refresh jika perlu
      let token: string | undefined = getAuthToken() ?? undefined;
      if (token && isTokenExpired(token)) {
        const refreshed = await refreshAuthToken() ?? undefined;
        token = refreshed ?? token;
      }

      // Fungsi request
      const doRequest = async (bearer?: string) => {
        return fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
            ...(bearer && { Authorization: `Bearer ${bearer}` }),
          },
          body: JSON.stringify(body),
          signal: controllerRef.current!.signal,
        });
      };

      let response = await doRequest(token ?? undefined);
      if (response.status === 401) {
        const refreshed = await refreshAuthToken() ?? undefined;
        if (refreshed) response = await doRequest(refreshed);
      }

      // Parsing response secara fleksibel
      const contentType = response.headers.get("content-type") || "";
      let result: any;
      try {
        if (contentType.includes("application/json")) {
          result = await response.json();
        } else {
          const text = await response.text();
          result = text ? { message: text } : null;
        }
      } catch {
        try {
          const text = await response.text();
          result = text ? { message: text } : null;
        } catch {
          result = null;
        }
      }

      // Tangani error response
      if (!response.ok) {
        const message =
          (result && (result.message || result.error)) ||
          `${method} request failed (${response.status})`;
        throw new Error(message);
      }

      // Jika sukses
      setData(result);
      options.invalidateKeys?.forEach((key) => {
        if (typeof window !== "undefined") {
          // contoh: bersihkan cache dari sessionStorage/localStorage
          sessionStorage.removeItem(key);
        }
      });

      return result;
    } catch (err: any) {
      // Rollback jika ada error
      options.rollback?.();

      const e = err instanceof Error ? err : new Error(String(err));
      if (e.name !== "AbortError") setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [url, method, options]);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  return { data, loading, error, mutate, cancel };
}
