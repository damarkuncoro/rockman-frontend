"use client";

import { useMutation } from "@/lib/useMutation";

/**
 * Interface untuk data department
 */
export interface Department {
  id: string;
  name: string;
  description: string;
  slug: string;
  code: string;
  color: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * Interface untuk data user yang diambil dari API
 */
export interface User {
  id: string;
  username: string;
  email: string;
  active: boolean;
  rolesUpdatedAt: string | null;
  primaryDepartmentId: string | null;
  region: string | null;
  level: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // Relasi
  addresses?: any[];
  phones?: any[];
  identities?: any[];
  roles?: any[];
  departments?: Department[];
  primaryDepartment?: Department;
}

/**
 * Interface untuk data login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface untuk response dari API login
 */
export interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

/**
 * Hook untuk melakukan login ke API
 * @returns Fungsi login, status loading, error, dan data respons
 */
export function useLogin() {
  const { data, error, loading, mutate } = useMutation<LoginResponse, LoginRequest>(
    "/api/v2/auth/login",
    "POST"
  );

  /**
   * Fungsi untuk melakukan login
   * @param credentials - Email dan password untuk login
   * @returns Promise dengan hasil login
   */
  const login = async (credentials: LoginRequest) => {
    try {
      const result = await mutate(credentials);
      console.log("Login result:", result);
      
      // Simpan token ke localStorage jika login berhasil
      // Periksa struktur respons yang benar
      if (result?.data?.token) {
        console.log("Login successful, token received:", result.data.token);
        localStorage.setItem("auth_token", result.data.token);
      } else if (result?.data.token) {
        // Alternatif struktur respons
        console.log("Login successful, token received (alt format):", result.data.token);
        localStorage.setItem("auth_token", result.data.token);
      } else {
        console.warn("Token tidak ditemukan dalam respons:", result);
      }
      
      // Verifikasi token tersimpan
      const savedToken = localStorage.getItem("auth_token");
      console.log("Token tersimpan di localStorage:", savedToken ? "Ya" : "Tidak");
      
      return result;
    } catch (err) {
      // Error sudah ditangani di dalam useMutation,
      // tapi kita bisa tambahkan logging tambahan di sini jika perlu.
      console.error("Login process failed:", err);
      // Re-throw error agar komponen pemanggil tahu bahwa login gagal
      throw err;
    }
  };

  return {
    login,
    data,
    error,
    loading,
  };
}
