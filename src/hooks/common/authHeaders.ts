"use client";

import { getAuthToken, isTokenExpired, refreshAuthToken } from "@/lib/auth";

/**
 * Mendapatkan token efektif untuk Authorization header.
 * - Mengambil dari util auth
 * - Refresh jika kadaluarsa
 * - Fallback refresh jika token tidak ada
 */
export async function getEffectiveToken(): Promise<string | null> {
  try {
    let token = getAuthToken();
    if (token && isTokenExpired(token)) {
      const refreshed = await refreshAuthToken();
      token = refreshed || token;
    }
    if (!token) {
      token = await refreshAuthToken();
    }
    return token || null;
  } catch {
    return null;
  }
}

/**
 * Membangun headers dengan Authorization (jika token tersedia).
 */
export async function buildAuthHeaders(
  extra: Record<string, string> = {}
): Promise<Record<string, string>> {
  const token = await getEffectiveToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}