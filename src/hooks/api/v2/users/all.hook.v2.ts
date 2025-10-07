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
export interface UsersResponse {
  message: string;
  data: User[];
}

/**
 * Hook untuk mengambil daftar users dari API
 * @param options - Opsi tambahan untuk useFetch
 * @returns Data users, status loading, error, dan fungsi untuk refetch
 */
export function useAllUsers(options: UseFetchOptions<UsersResponse> = {}) {
  const url = "/api/v2/users";

  // Default options
  const defaultOptions: UseFetchOptions<UsersResponse> = {
    revalidate: 60000, // Revalidasi setiap 1 menit
    useCache: true,
    cacheMaxAge: 300000, // Cache valid selama 5 menit
    ...options
  };

  return useFetch<UsersResponse>(url, defaultOptions);
}

