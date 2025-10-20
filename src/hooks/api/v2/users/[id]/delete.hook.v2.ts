"use client";

import { useSWRConfig } from "swr";
import { useMutation } from "@/lib/useMutation";
import { cache } from "@/lib/cache";

/**
 * Hook untuk menghapus user (API v2)
 * @param id - ID user yang akan dihapus
 * @returns Object yang berisi fungsi deleteUser, status loading/error, dan response
 */
export function useDeleteUser(id: string) {
  const { mutate: swrMutate } = useSWRConfig();

  // Gunakan useMutation untuk konsistensi auth & error handling
  const { mutate, loading, error, data } = useMutation<{ message: string }, unknown>(
    `/api/v2/users/${id}`,
    "DELETE"
  );

  /**
   * Fungsi untuk menghapus user
   * @param userId - ID user yang akan dihapus (jika tidak disediakan saat inisialisasi hook)
   * @returns Promise yang berisi response dari API
   */
  const deleteUser = async (): Promise<void> => {
    await mutate(undefined as unknown);

    // Invalidate cache untuk memperbarui data pada consumer berbasis useFetch
    cache.clear("/api/v2/users");
    cache.clear(`/api/v2/users/${id}`);

    // Back-compat: invalidate SWR key jika ada consumer lama
    swrMutate("/api/v2/users");
    swrMutate(`/api/v2/users/${id}`);
  };

  return {
    deleteUser,
    isLoading: loading,
    error,
    response: data,
  };
}