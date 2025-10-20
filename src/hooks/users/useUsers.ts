"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAllUsers, User } from "@/hooks/api/v2/users/all.hook.v2"
import { toast } from "sonner"

/**
 * Custom hook untuk mengelola logika users
 * @returns Fungsi dan state yang dibutuhkan untuk manajemen users
 */
export function useUsers() {
  const router = useRouter()
  const [search, setSearch] = React.useState("")
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)

  // Menggunakan hook useAllUsers untuk mendapatkan data users + indikator cache
  const { data, loading, error, refetch, clearCache, isStale, lastUpdated } = useAllUsers()

  // Handler untuk melihat detail user
  const handleViewUser = (userId: string) => {
    router.push(`/users/${userId}`)
  }

  // Handler untuk edit user
  const handleEditUser = (userId: string) => {
    router.push(`/users/${userId}/edit`)
  }

  // Handler untuk konfirmasi hapus user
  const handleDeleteConfirm = (userId: string) => {
    setSelectedUserId(userId)
    setShowDeleteDialog(true)
  }

  // Handler untuk menghapus user
  const handleDeleteUser = async () => {
    if (!selectedUserId) return

    try {
      // Implementasi API delete user akan ditambahkan nanti
      toast.success("User berhasil dihapus", {
        description: "Data user telah dihapus dari sistem"
      })
      
      // Refresh data
      refetch()
    } catch (error) {
      toast.error("Gagal menghapus user", {
        description: "Terjadi kesalahan saat menghapus data user"
      })
    } finally {
      setShowDeleteDialog(false)
      setSelectedUserId(null)
    }
  }

  // Filter users berdasarkan pencarian
  const filteredUsers = React.useMemo(() => {
    if (!data?.data) return []
    
    if (!search) return data.data
    
    const searchLower = search.toLowerCase()
    return data.data.filter(user => 
      user.username.toLowerCase().includes(searchLower) || 
      user.email.toLowerCase().includes(searchLower)
    )
  }, [data, search])

  return {
    users: data?.data || [],
    filteredUsers,
    loading,
    error,
    isStale,
    lastUpdated,
    search,
    setSearch,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedUserId,
    setSelectedUserId,
    handleViewUser,
    handleEditUser,
    handleDeleteConfirm,
    handleDeleteUser,
    refetch,
    clearCache
  }
}