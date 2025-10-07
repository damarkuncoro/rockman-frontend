"use client"

import { useRouter } from "next/navigation"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"

// Komponen yang dipisahkan
import { UserTable } from "@/components/users/UserTable"
import { UserSearchFilter } from "@/components/users/UserSearchFilter"
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog"

// Custom hook untuk logika users
import { useUsers } from "@/hooks/users/useUsers"

/**
 * Komponen halaman manajemen users
 */
export default function UsersPage() {
  const router = useRouter()
  
  // Menggunakan custom hook untuk mengelola logika users
  const {
    filteredUsers,
    loading,
    error,
    search,
    setSearch,
    showDeleteDialog,
    setShowDeleteDialog,
    handleViewUser,
    handleEditUser,
    handleDeleteConfirm,
    handleDeleteUser
  } = useUsers()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen User</h1>
        <Button onClick={() => router.push("/users/create")}>
          <IconPlus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar User</CardTitle>
          <CardDescription>
            Kelola semua user dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Komponen pencarian dan filter */}
          <UserSearchFilter 
            search={search}
            onSearchChange={setSearch}
            onClearSearch={() => setSearch("")}
          />

          {/* Komponen tabel users */}
          <UserTable 
            users={filteredUsers}
            loading={loading}
            error={error}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteConfirm}
          />
        </CardContent>
      </Card>

      {/* Komponen dialog konfirmasi hapus */}
      <DeleteUserDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}