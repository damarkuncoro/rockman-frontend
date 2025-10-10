"use client"

import { useMemo } from "react"
import { decodeJwt, getAuthToken } from "@/lib/auth"
import { useUserDetail } from "@/hooks/api/v2/users/[id]/show.hook.v2"

/**
 * Hook untuk mengambil data user saat ini dari JWT
 * Menggunakan payload token untuk mendapatkan userId, lalu memanggil useUserDetail
 */
export function useCurrentUser() {
  const token = getAuthToken()
  const payload = useMemo(() => (token ? decodeJwt(token) : null), [token])
  const userId: string | null = payload?.userId ?? null

  const { data, loading, error, refetch } = useUserDetail(userId || "", {
    immediate: !!userId,
    useCache: true,
    revalidate: 60000,
  })


  console.log("useCurrentUser", userId, data, loading, error)
  return {
    userId,
    user: data?.data || null,
    loading,
    error,
    refetch,
  }
}