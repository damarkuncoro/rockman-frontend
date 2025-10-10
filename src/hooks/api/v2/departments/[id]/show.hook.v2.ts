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
  id?: string;
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
export function useDetailsDepartment(
  id: string,
  options: UseFetchOptions<{ message: string; data: Department }> = {}
) {
  // Buat URL dengan parameter query
  let url = `/api/v2/departments/${id}`;
  
  // Gunakan useFetch untuk mengambil data
  const { data, error, loading, refetch } = useFetch<{ message: string; data: Department }>(
    url,
    options
  );

  return {
    department: data?.data,
    message: data?.message,
    loading,
    error,
    refetch,
  };
}