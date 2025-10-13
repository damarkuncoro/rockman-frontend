"use client";

// Gunakan kunci token dari env agar konsisten di seluruh app
const TOKEN_KEY = (process.env.NEXT_PUBLIC_LOCAL_STORAGE_TOKEN_KEY || "auth_token").trim();

/** Mendapatkan token dari localStorage */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Menyimpan token ke localStorage */
export function setAuthToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

/** Menghapus token dari localStorage */
export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

/** Decode payload JWT secara sederhana (tanpa verifikasi) */
export function decodeJwt(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Mengecek apakah token sudah kadaluarsa berdasarkan field exp (detik) */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== "number") return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSeconds;
}

/** Merefresh token menggunakan endpoint publik token-refresh */
export async function refreshAuthToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/v2/auth/refresh-token", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = res.headers.get("content-type") || "";
    let json: any = null;
    if (contentType.includes("application/json")) {
      json = await res.json();
    } else {
      const text = await res.text();
      json = text ? { message: text } : null;
    }

    if (!res.ok || !json?.success) {
      return null;
    }

    const token: string | undefined = json?.data?.token;
    if (token) {
      setAuthToken(token);
      return token;
    }
    return null;
  } catch (e) {
    return null;
  }
}