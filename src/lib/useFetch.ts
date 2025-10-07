"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cache } from "./cache";

export type UseFetchOptions<T> = {
  /** Interval revalidasi otomatis dalam milidetik (0 = tidak ada revalidasi) */
  revalidate?: number;
  
  /** Aktifkan caching (default: true) */
  useCache?: boolean;
  
  /** Fetch langsung saat component mount (default: true) */
  immediate?: boolean;
  
  /** Maksimal umur cache dalam milidetik sebelum dianggap stale */
  cacheMaxAge?: number;
  
  /** Callback ketika fetch berhasil */
  onSuccess?: (data: T) => void;
  
  /** Callback ketika fetch gagal */
  onError?: (error: Error) => void;
  
  /** Custom fetch options */
  fetchOptions?: RequestInit;
};

export type UseFetchReturn<T> = {
  /** Data hasil fetch */
  data: T | null;
  
  /** Status loading */
  loading: boolean;
  
  /** Error jika terjadi kesalahan */
  error: Error | null;
  
  /** Function untuk refetch data (bypass cache) */
  refetch: () => Promise<void>;
  
  /** Function untuk clear cache untuk URL ini */
  clearCache: () => void;
  
  /** Status apakah data berasal dari cache */
  isStale: boolean;

  /** Timestamp terakhir kali data diperbarui (null jika belum ada data) */
  lastUpdated: number | null;
};

export function useFetch<T = any>(
  url: string, 
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const { 
    revalidate = 0, 
    useCache = true, 
    immediate = true,
    cacheMaxAge,
    onSuccess,
    onError,
    fetchOptions = {},
  } = options;

  // Cek cache awal
  const initialData = useCache ? cache.get<T>(url, cacheMaxAge) : null;
  
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(!initialData && immediate);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(
    initialData ? Date.now() : null
  );
  
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const fetchCountRef = useRef<number>(0);
  const lastRevalidateRef = useRef<number>(0); // Guard untuk mencegah spam revalidate

  const fetchData = useCallback(async (force = false): Promise<void> => {
    // Cek cache terlebih dahulu jika tidak force
    if (useCache && !force) {
      const cachedData = cache.get<T>(url, cacheMaxAge);
      if (cachedData) {
        if (isMountedRef.current) {
          setData(cachedData);
          setLoading(false);
          setIsStale(false);
        }
        return;
      }
    }

    // Batalkan request sebelumnya jika ada
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    fetchCountRef.current += 1;
    const currentFetchCount = fetchCountRef.current;

    try {
      const res = await fetch(url, { 
        ...fetchOptions,
        signal: controller.signal 
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const json = (await res.json()) as T;

      // Hanya update jika ini adalah fetch terbaru dan component masih mounted
      if (isMountedRef.current && currentFetchCount === fetchCountRef.current) {
        setData(json);
        setError(null);
        setIsStale(false);
        setLastUpdated(Date.now());
        
        if (useCache) {
          cache.set(url, json);
        }
        
        onSuccess?.(json);
      }
    } catch (err: any) {
      if (err.name !== "AbortError" && 
          isMountedRef.current && 
          currentFetchCount === fetchCountRef.current) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setIsStale(true);
        onError?.(error);
      }
    } finally {
      if (isMountedRef.current && currentFetchCount === fetchCountRef.current) {
        setLoading(false);
      }
    }
  }, [url, useCache, cacheMaxAge, onSuccess, onError, fetchOptions]);

  // Effect untuk initial fetch dan revalidasi
  useEffect(() => {
    isMountedRef.current = true;

    // Initial fetch
    if (immediate) {
      fetchData();
    }

    // Setup revalidasi berkala
    if (revalidate > 0) {
      timerRef.current = setInterval(() => {
        fetchData(true);
      }, revalidate);
    }

    // Refetch saat window focus (untuk data fresh)
    const handleWindowFocus = () => {
      // Guard: minimal 3 detik jeda untuk mencegah spam
      if (document.visibilityState === "visible" && 
          Date.now() - lastRevalidateRef.current > 3000) {
        lastRevalidateRef.current = Date.now();
        fetchData(true);
      }
    };

    // Refetch saat online kembali
    const handleOnline = () => {
      // Guard: minimal 3 detik jeda untuk mencegah spam
      if (Date.now() - lastRevalidateRef.current > 3000) {
        lastRevalidateRef.current = Date.now();
        fetchData(true);
      }
    };

    window.addEventListener("visibilitychange", handleWindowFocus);
    window.addEventListener("online", handleOnline);

    // Cleanup
    return () => {
      isMountedRef.current = false;
      abortRef.current?.abort();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      window.removeEventListener("visibilitychange", handleWindowFocus);
      window.removeEventListener("online", handleOnline);
    };
  }, [fetchData, immediate, revalidate]);

  // Memoized functions
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  const clearCache = useCallback(() => {
    cache.clear(url);
    setIsStale(true);
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    isStale,
    lastUpdated,
  };
}