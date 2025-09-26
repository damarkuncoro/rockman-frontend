"use client"

import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconFilter,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"

import { Badge } from "@/components/shadcn/ui/badge"
import { Button } from "@/components/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"
import { Input } from "@/components/shadcn/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/ui/dialog"
import { Label } from "@/components/shadcn/ui/label"
import { Textarea } from "@/components/shadcn/ui/textarea"
import { Switch } from "@/components/shadcn/ui/switch"
import { SkeletonUserManagement } from "@/components/skeleton-user-management"
import { useDepartments } from "@/hooks/useDepartments"

/**
 * Interface untuk data pengguna
 */
interface User {
  id: number
  name: string
  email: string
  passwordHash: string
  active: boolean
  rolesUpdatedAt: string | null
  department: string | null
  region: string | null
  level: number | null
  createdAt: string
  updatedAt: string
}

/**
 * Komponen utama dashboard manajemen pengguna
 */
export default function UserManagementPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  
  // Hook untuk departments
  const { departments, isLoading: isDepartmentsLoading } = useDepartments()
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // State untuk modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // State untuk form edit/add
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    region: "",
    level: "",
    active: true
  })

  /**
   * Fungsi untuk fetch data users dari API
   */
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch("http://localhost:9999/api/v1/users")
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Pastikan data memiliki struktur yang benar
      if (data && Array.isArray(data.data)) {
        setUsers(data.data)
      } else if (Array.isArray(data)) {
        setUsers(data)
      } else {
        throw new Error("Format data tidak valid")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error instanceof Error ? error.message : "Gagal memuat data pengguna")
      setUsers([]) // Set empty array jika error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Fungsi untuk create user baru
   */
  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash' | 'rolesUpdatedAt'>) => {
    try {
      const response = await fetch("http://localhost:9999/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newUser = await response.json()
      
      // Refresh data setelah create
      await fetchUsers()
      
      return newUser
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  /**
   * Fungsi untuk update user
   */
  const updateUser = async (userId: number, userData: Partial<User>) => {
    try {
      const response = await fetch(`http://localhost:9999/api/v1/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedUser = await response.json()
      
      // Refresh data setelah update
      await fetchUsers()
      
      return updatedUser
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }

  /**
   * Fungsi untuk delete user
   */
  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:9999/api/v1/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh data setelah delete
      await fetchUsers()
      
      return true
    } catch (error) {
      console.error("Error deleting user:", error)
      throw error
    }
  }

  // Fetch data saat komponen dimount
  useEffect(() => {
    fetchUsers()
  }, [])

  /**
   * Filter dan pencarian pengguna
   */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && user.active) ||
        (statusFilter === "inactive" && !user.active)
      const matchesLevel = levelFilter === "all" || user.level?.toString() === levelFilter

      return matchesSearch && matchesDepartment && matchesStatus && matchesLevel
    })
  }, [users, searchTerm, departmentFilter, statusFilter, levelFilter])

  /**
   * Mendapatkan daftar unik untuk filter
   */
  const uniqueDepartments = useMemo(() => 
    departments.map(dept => dept.name), [departments]
  )
  
  const uniqueLevels = useMemo(() => 
    [...new Set(users.map(user => user.level).filter(level => level !== null))], [users]
  )

  /**
   * Statistik pengguna
   */
  const stats = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter(user => user.active).length
    const inactiveUsers = totalUsers - activeUsers
    const departmentsCount = departments.length

    return { totalUsers, activeUsers, inactiveUsers, departments: departmentsCount }
  }, [users, departments])

  /**
   * Pagination logic
   */
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredUsers.slice(startIndex, endIndex)
  }, [filteredUsers, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  /**
   * Pagination handlers
   */
  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))

  // Reset ke halaman pertama ketika filter berubah
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, departmentFilter, statusFilter, levelFilter])

  /**
   * Fungsi untuk mendapatkan inisial nama
   */
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  /**
   * Fungsi untuk format tanggal
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  /**
   * Handler untuk aksi pengguna
   */
  const handleRowClick = (user: User) => {
    router.push(`/users/${user.id}`)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      department: user.department || "",
      region: user.region || "",
      level: user.level?.toString() || "",
      active: user.active
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleAddUser = () => {
    setFormData({
      name: "",
      email: "",
      department: "",
      region: "",
      level: "",
      active: true
    })
    setIsAddModalOpen(true)
  }

  /**
   * Handler untuk form submission
   */
  const handleSaveUser = async () => {
    try {
      setIsLoading(true)
      
      if (selectedUser) {
        // Update existing user
        await updateUser(selectedUser.id, {
          name: formData.name,
          email: formData.email,
          department: formData.department || null,
          region: formData.region || null,
          level: formData.level ? parseInt(formData.level) : null,
          active: formData.active
        })
      } else {
        // Create new user
        await createUser({
          name: formData.name,
          email: formData.email,
          department: formData.department || null,
          region: formData.region || null,
          level: formData.level ? parseInt(formData.level) : null,
          active: formData.active
        })
      }
      
      setIsEditModalOpen(false)
      setIsAddModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error saving user:", error)
      setError(error instanceof Error ? error.message : "Gagal menyimpan data pengguna")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return
    
    try {
      setIsLoading(true)
      await deleteUser(selectedUser.id)
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error deleting user:", error)
      setError(error instanceof Error ? error.message : "Gagal menghapus pengguna")
    } finally {
      setIsLoading(false)
    }
  }

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
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Semua pengguna terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
            <IconUserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Nonaktif</CardTitle>
            <IconUserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.inactiveUsers / stats.totalUsers) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departemen</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departments}</div>
            <p className="text-xs text-muted-foreground">
              Departemen aktif
            </p>
          </CardContent>
        </Card>
      </div>

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
                  <SelectItem key={dept} value={dept}>
                    {dept}
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
            <Button onClick={handleAddUser} className="w-full md:w-auto">
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
                      onClick={() => handleRowClick(user)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/avatars/${user.id}.jpg`} />
                            <AvatarFallback className="text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline">{user.department || "N/A"}</Badge>
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
                                handleDeleteUser(user)
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
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} dari {filteredUsers.length} pengguna
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground">Baris per halaman:</p>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <IconChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1 mx-2">
                    <p className="text-sm text-muted-foreground">
                      Halaman {currentPage} dari {totalPages}
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <IconChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Detail Pengguna */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pengguna</DialogTitle>
            <DialogDescription>
              Informasi lengkap pengguna sistem
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`/avatars/${selectedUser.id}.jpg`} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Label className="text-sm font-medium">ID Pengguna</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedUser.active ? "default" : "destructive"}>
                      {selectedUser.active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Departemen</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.department || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Region</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.region || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Level</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.level ? `Level ${selectedUser.level}` : "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dibuat</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Diperbarui</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedUser.updatedAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Role Diperbarui</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.rolesUpdatedAt ? formatDate(selectedUser.rolesUpdatedAt) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Pengguna */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Ubah informasi pengguna sistem
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nama Lengkap</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Masukkan email"
                />
              </div>
              <div>
                <Label htmlFor="edit-department">Departemen</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih departemen" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: dept.color }}
                          />
                          {dept.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-region">Region</Label>
                <Input
                  id="edit-region"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  placeholder="Masukkan region"
                />
              </div>
              <div>
                <Label htmlFor="edit-level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueLevels.map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        Level {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label htmlFor="edit-active">Status Aktif</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveUser}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Tambah Pengguna */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            <DialogDescription>
              Buat pengguna baru untuk sistem
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-name">Nama Lengkap</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Masukkan email"
                />
              </div>
              <div>
                <Label htmlFor="add-department">Departemen</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih departemen" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: dept.color }}
                          />
                          {dept.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="add-region">Region</Label>
                <Input
                  id="add-region"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  placeholder="Masukkan region"
                />
              </div>
              <div>
                <Label htmlFor="add-level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueLevels.map((level) => (
                      <SelectItem key={level} value={level.toString()}>
                        Level {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="add-active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label htmlFor="add-active">Status Aktif</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveUser}>
              Tambah Pengguna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Konfirmasi Hapus */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/avatars/${selectedUser.id}.jpg`} />
                  <AvatarFallback>
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Hapus Pengguna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}