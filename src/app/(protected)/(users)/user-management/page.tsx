"use client"

import * as React from "react"

// Import komponen UI
import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/ui/avatar"
import { SkeletonUserManagement } from "@/components/skeletons/SkeletonUserManagement"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/ui/dropdown-menu"
import { IconEdit, IconEye, IconFilter, IconPlus, IconSearch, IconTrash, IconUsers } from "@tabler/icons-react"

// Import komponen yang telah dipisahkan
import { UserManagementStats } from '@/components/users/UserManagementStats'
import { UserManagementPagination } from '@/components/users/UserManagementPagination'
import { DepartmentName } from "./components/DepartmentName"
import { UserAddModal } from "@/components/users/UserAddModal"
import { UserDeleteModal } from "@/components/users/UserDeleteModal"
import { UserEditModal } from "@/components/users/UserEditModal"
import { UserViewModal } from "@/components/users/UserViewModal"

// Import custom hook untuk logika
import { useUserManagement } from '@/hooks/users/useUserManagement';

/**
 * Interface untuk data pengguna dari API v2
 */
interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  active: boolean;
  rolesUpdatedAt: string | null;
  primaryDepartmentId?: string | null;
  region: string | null;
  level: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  addresses: any[];
  phones: any[];
  identities: any[];
  roles: any[];
  departments: Department[];
  primaryDepartment?: Department;
}

/**
 * Interface untuk data departemen
 */
interface Department {
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
 * Komponen utama dashboard manajemen pengguna
 * Mengimplementasikan prinsip SRP dengan memisahkan UI dan logika
 */
export default function UserManagementPage() {
  // Menggunakan custom hook untuk semua logika manajemen pengguna
  const userManagement = useUserManagement();
  const {
    // Data
    users,
    departments,
    isLoading,
    error,
    setError,
    
    // Filter dan pencarian
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    levelFilter,
    setLevelFilter,
    
    // Pagination
    currentPage,
    totalPages,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    // Modal
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,
    formData,
    setFormData,
    
    // Fungsi
    formatDate,
    handleAddUser,
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
    handleDeleteConfirm,
    getInitials,
    
    // Data yang sudah diproses
    filteredUsers,
    paginatedUsers,
    uniqueDepartments,
    uniqueLevels,
    stats
  } = userManagement;
  // Tampilkan skeleton loading saat data sedang dimuat
  if (isLoading) {
    return <SkeletonUserManagement />
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
        <p className="text-muted-foreground">
          Kelola pengguna sistem, departemen, dan hak akses
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Tutup</span>
            ×
          </button>
        </div>
      )}

      {/* Statistik Cards */}
      <UserManagementStats stats={stats} />

      {/* Filter dan Pencarian */}
      <Card>
        <CardHeader>
          <CardTitle>Filter dan Pencarian</CardTitle>
          <CardDescription>
            Gunakan filter untuk menemukan pengguna dengan cepat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Pencarian */}
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, atau departemen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Departemen */}
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Departemen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Departemen</SelectItem>
                {uniqueDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Level */}
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Level</SelectItem>
                {uniqueLevels.map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    Level {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tombol Tambah Pengguna */}
            <Button onClick={() => handleAddUser()} className="w-full md:w-auto">
              <IconPlus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Pengguna */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Menampilkan {paginatedUsers.length} dari {filteredUsers.length} pengguna (Total: {users.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <IconUsers className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Tidak ada pengguna yang ditemukan
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleViewUser(user)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/avatars/${user.id}.jpg`} />
                            <AvatarFallback className="text-xs">
                              {getInitials(user.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <DepartmentName userId={user.id} departmentId={user.departmentId || user.primaryDepartmentId || null} />
                        </Badge>
                      </TableCell>
                      <TableCell>{user.region || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.level && user.level >= 8 ? "default" : "secondary"}
                        >
                          {user.level ? `Level ${user.level}` : "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.active ? "default" : "destructive"}
                          className={user.active ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                        >
                          {user.active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild suppressHydrationWarning>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <IconFilter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation()
                              handleViewUser(user)
                            }}>
                              <IconEye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation()
                              handleEditUser(user)
                            }}>
                              <IconEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteConfirm()
                              }}
                              className="text-red-600"
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {filteredUsers.length > 0 && (
            <UserManagementPagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToFirstPage={goToFirstPage}
              goToPreviousPage={goToPreviousPage}
              goToNextPage={goToNextPage}
              goToLastPage={goToLastPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <UserAddModal 
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        formData={formData}
        setFormData={setFormData}
        departments={departments}
        uniqueLevels={uniqueLevels}
        handleSaveUser={handleAddUser}
        setError={setError}
      />

      <UserEditModal 
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        user={selectedUser}
        formData={formData}
        setFormData={setFormData}
        departments={departments}
        uniqueLevels={uniqueLevels}
        handleSaveUser={handleEditUser}
        setError={setError}
      />

      <UserViewModal 
        isOpen={isViewModalOpen}
        setIsOpen={setIsViewModalOpen}
        user={selectedUser}
        departments={departments}
        getInitials={getInitials}
        formatDate={formatDate}
      />

      <UserDeleteModal 
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        user={selectedUser}
        getInitials={getInitials}
        handleConfirmDelete={async () => await handleDeleteUser()}
        setError={setError}
      />
    </div>
  )
}