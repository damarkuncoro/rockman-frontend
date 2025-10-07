"use client";

import { useFetch, UseFetchOptions } from "@/lib/useFetch";

/**
 * Interface untuk data user
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
}

/**
 * Interface untuk data position
 */
export interface Position {
  id: string;
  name: string;
  description?: string | null;
  departmentId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/**
 * Interface untuk data departemen
 */
export interface Department {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  code: string;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // Relasi
  positions?: Position[];
  users?: User[];
}

/**
 * Interface untuk response dari API departments
 */
export interface DepartmentsResponse {
  message: string;
  data: Department[];
}

/**
 * Interface untuk parameter request departments
 */
export interface DepartmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
}

/**
 * Hook untuk mengambil daftar departemen dengan filter dan pagination
 * 
 * @param params Parameter untuk filter dan pagination
 * @param options Opsi tambahan untuk useFetch
 * @returns Data departemen, status loading, error, dan fungsi untuk refetch
 */
export function useAllDepartments(
  params: DepartmentsParams = {},
  options: UseFetchOptions<DepartmentsResponse> = {}
) {
  // Buat URL dengan parameter query
  let url = `/api/v2/departments`;
  
  // Tambahkan parameter ke URL jika ada
  const queryParts: string[] = [];
  
  if (params.page) queryParts.push(`page=${params.page}`);
  if (params.limit) queryParts.push(`limit=${params.limit}`);
  if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
  if (params.sortBy) queryParts.push(`sortBy=${encodeURIComponent(params.sortBy)}`);
  if (params.sortOrder) queryParts.push(`sortOrder=${params.sortOrder}`);
  if (params.isActive !== undefined) queryParts.push(`isActive=${params.isActive}`);
  
  // Tambahkan query string ke URL jika ada parameter
  if (queryParts.length > 0) {
    url = `${url}?${queryParts.join('&')}`;
  }
  
  // Default options
  const defaultOptions: UseFetchOptions<DepartmentsResponse> = {
    revalidate: 60000, // Revalidasi setiap 1 menit
    useCache: true,
    cacheMaxAge: 300000, // Cache valid selama 5 menit
    ...options
  };
  
  return useFetch<DepartmentsResponse>(url, defaultOptions);
}