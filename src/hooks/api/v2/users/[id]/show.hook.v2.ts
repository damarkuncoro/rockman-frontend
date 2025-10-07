"use client";

import { useFetch, UseFetchOptions } from "@/lib/useFetch";

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
  passwordHash: string;
  active: boolean;
  rolesUpdatedAt: string | null;
  primaryDepartmentId: string;
  region: string;
  level: number;
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
 * Interface untuk response dari API users
 */
export interface UserDetailResponse {
  message: string;
  data: User;
}

/**
 * Hook untuk mengambil detail user berdasarkan ID
 * @param id - ID user yang akan diambil detailnya
 * @param options - Opsi tambahan untuk fetch
 */
export const useUserDetail = (
  id: string,
  options?: {
    revalidate?: number
    useCache?: boolean
    immediate?: boolean
    cacheMaxAge?: number
  }
) => {
  const url = `/api/v2/users/${id}`

  return useFetch<UserDetailResponse>(url, {
    revalidate: options?.revalidate ?? 60000, // Default revalidasi setiap 1 menit
    useCache: options?.useCache ?? true,
    immediate: options?.immediate ?? true,
    cacheMaxAge: options?.cacheMaxAge ?? 300000, // Default cache valid selama 5 menit
  })
}